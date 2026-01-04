(() => {
  // src/shared/consts/storage-keys.const.ts
  var STORAGE_KEYS = {
    RACES: "races",
    OPEN_RACES: "openRaces",
    STORMS: "storms",
    OPEN_STORMS: "openStorms",
    CURRENT_TAB: "currentTab",
    POPUP_SCROLL_POSITION: "popupScrollPosition",
    SETTINGS: "settings",
    TRAINING: "training"
  };

  // src/background/viewMode.ts
  var POPUP_PATH = "popup/browser/index.html";
  async function applyViewMode() {
    const data = await chrome.storage.local.get([STORAGE_KEYS.SETTINGS]);
    const settings = data.settings || {};
    if (settings.viewMode === "popup") {
      await chrome.action.setPopup({ popup: POPUP_PATH });
      await chrome.sidePanel.setOptions({ enabled: false });
    } else {
      await chrome.action.setPopup({ popup: "" });
      await chrome.sidePanel.setOptions({ path: POPUP_PATH, enabled: true });
    }
  }
  function initializeViewMode() {
    applyViewMode();
    chrome.storage.onChanged.addListener((changes) => {
      if (changes[STORAGE_KEYS.SETTINGS]) {
        applyViewMode();
      }
    });
  }

  // src/background/index.ts
  (function() {
    initializeViewMode();
    chrome.runtime.onInstalled.addListener(() => {
      replacePuzzleFullPathsWithOnlyPuzzleIds();
    });
    chrome.runtime.onMessage.addListener((message, sender, _sendResponse) => {
      switch (message.type) {
        // Race
        case "get_race_runs":
          getRaceRuns(message, _sendResponse);
          break;
        case "puzzle_race_finished":
          saveRaceInformation(message);
          break;
        // Storm
        case "get_storm_runs":
          getStormRuns(message, _sendResponse);
          break;
        case "puzzle_storm_finished":
          saveStormInformation(message);
          break;
        // Training
        case "puzzle_solved_single":
          updatePuzzleStateToReviewed(message);
          break;
        // Other
        case "debug_script":
          debug_script(message);
          break;
        case "close_tab":
          closeTab(sender);
          break;
        default:
          break;
      }
    });
    function getRaceRuns(message, _sendResponse) {
      chrome.storage.local.get([STORAGE_KEYS.RACES], (data) => {
        const races = data.races || {};
        _sendResponse(races);
      });
    }
    function saveRaceInformation(message) {
      chrome.storage.local.get([STORAGE_KEYS.RACES], (data) => {
        const races = data.races || {};
        races[message.raceId] = {
          raceId: message.raceId,
          timestamp: message.timestamp,
          // puzzles
          solved: message.solved || [],
          unsolved: message.unsolved || [],
          reviewed: message.reviewed || [],
          // stats
          score: message.score || 0,
          rank: message.rank || 0,
          totalPlayers: message.totalPlayers || 0
        };
        chrome.storage.local.set({ races });
      });
    }
    function getStormRuns(message, _sendResponse) {
      chrome.storage.local.get([STORAGE_KEYS.STORMS], (data) => {
        const storms = data.races || {};
        _sendResponse(storms);
      });
    }
    function saveStormInformation(message) {
      chrome.storage.local.get([STORAGE_KEYS.STORMS], (data) => {
        const storms = data.storms || {};
        storms[message.stormId] = {
          stormId: message.stormId,
          timestamp: message.timestamp,
          // puzzles
          solved: message.solved || [],
          unsolved: message.unsolved || [],
          reviewed: message.reviewed || [],
          // stats
          score: message.score || 0,
          moves: message.moves || 0,
          accuracy: message.accuracy || 0,
          combo: message.combo || 0,
          time: message.time || 0,
          timePerMove: message.timePerMove || 0,
          highestSolved: message.highestSolved || 0
        };
        chrome.storage.local.set({ storms });
      });
    }
    function updatePuzzleStateToReviewed(message) {
      const puzzleId = message.id;
      chrome.storage.local.get([STORAGE_KEYS.RACES, STORAGE_KEYS.STORMS], (data) => {
        const races = data.races || {};
        const storms = data.storms || {};
        for (const raceId in races) {
          const race = races[raceId];
          const puzzleIndex = race.unsolved.findIndex((url) => url.endsWith("/" + puzzleId) || url === puzzleId);
          if (puzzleIndex !== -1) {
            const puzzleUrl = race.unsolved[puzzleIndex];
            race.unsolved.splice(puzzleIndex, 1);
            race.reviewed.push(puzzleUrl);
            setTimeout(() => chrome.storage.local.set({ races: { ...races } }), 50);
            chrome.runtime.sendMessage({ type: "races_updated" /* races_updated */ });
            return;
          }
        }
        for (const stormId in storms) {
          const storm = storms[stormId];
          const puzzleIndex = storm.unsolved.findIndex((url) => url.endsWith("/" + puzzleId) || url === puzzleId);
          if (puzzleIndex !== -1) {
            const puzzleUrl = storm.unsolved[puzzleIndex];
            storm.unsolved.splice(puzzleIndex, 1);
            storm.reviewed.push(puzzleUrl);
            setTimeout(() => chrome.storage.local.set({ storms: { ...storms } }), 50);
            chrome.runtime.sendMessage({ type: "storms_updated" /* storms_updated */ });
            return;
          }
        }
      });
    }
    function debug_script(message) {
      chrome.storage.local.set({ debug_content: message.text });
      return;
    }
    function closeTab(sender) {
      if (sender.tab && sender.tab.id) {
        chrome.tabs.remove(sender.tab.id);
      }
    }
    function replacePuzzleFullPathsWithOnlyPuzzleIds() {
      const extractLastSegment = (href) => href.split("/").pop();
      chrome.storage.local.get([STORAGE_KEYS.RACES, STORAGE_KEYS.STORMS], (data) => {
        const races = data.races || {};
        const storms = data.storms || {};
        for (const raceId in races) {
          const race = races[raceId];
          races[raceId] = {
            ...race,
            solved: race.solved.map(extractLastSegment),
            unsolved: race.unsolved.map(extractLastSegment),
            reviewed: race.reviewed.map(extractLastSegment)
          };
        }
        for (const stormId in storms) {
          const storm = storms[stormId];
          storms[stormId] = {
            ...storm,
            solved: storm.solved.map(extractLastSegment),
            unsolved: storm.unsolved.map(extractLastSegment),
            reviewed: storm.reviewed.map(extractLastSegment)
          };
        }
        chrome.storage.local.set({ races, storms, debug_content: storms.length });
      });
    }
  })();
})();
