(() => {
  // src/shared/consts/links.const.ts
  var LINKS = {
    RACER: "https://lichess.org/racer/",
    TRAINING: "https://lichess.org/training/"
  };

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

  // src/shared/ui/training-page-helpers.ts
  var CUSTOM_LINK_CSS_CLASS = "liRacer-extension-next-puzzle-container";
  var CUSTOM_STYLES = `
  .${CUSTOM_LINK_CSS_CLASS} {
    min-width: 160px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    padding: 0 1rem;

    & > a { 
      color: var(--c-font);
      &:hover { color: var(--c-link); }
    }

    @media (min-width: 799.3px), (orientation: landscape) {
      border-top: 1px solid var(--c-border);
      justify-content: space-between;
      padding: 1em 2em;
    }
  }`;
  function attachCustomStylesIntoDocumentHead() {
    const style = document.createElement("style");
    style.textContent = CUSTOM_STYLES;
    document.head.appendChild(style);
  }
  function appendNextUnsolvedLink(container, puzzleLink, count) {
    if (!container) return;
    if (!puzzleLink) return;
    const wrapper = document.createElement("div");
    wrapper.className = "liRacer-extension-next-puzzle-container";
    wrapper.appendChild(createExtensionIconImage());
    wrapper.appendChild(createNextUnsolvedLink(puzzleLink, count));
    container.appendChild(wrapper);
  }
  function createExtensionIconImage(imgSize = "16px") {
    const img = document.createElement("img");
    img.src = chrome.runtime.getURL("assets/icons/48.png");
    img.alt = "LiRacer Extension icon";
    img.title = "LiRacer Extension";
    img.loading = "lazy";
    img.decoding = "async";
    img.style.width = imgSize;
    img.style.height = imgSize;
    return img;
  }
  function createNextUnsolvedLink(puzzleLink, count) {
    const link = document.createElement("a");
    link.href = prependPathIfNeeded(LINKS.TRAINING, puzzleLink);
    link.textContent = `LiRacer: Next in Training (${count})`;
    return link;
  }
  function prependPathIfNeeded(path, puzzleLinkOrId) {
    return puzzleLinkOrId.startsWith(path) ? puzzleLinkOrId : `${path}${puzzleLinkOrId}`;
  }

  // src/shared/ui/selectors.ts
  var PUZZLE_FEEDBACK_SELECTOR = ".puzzle__feedback";
  var PUZZLE_FEEDBACK_SUCCESS_SELECTOR = `${PUZZLE_FEEDBACK_SELECTOR} .complete`;
  var PUZZLE_FEEDBACK_FAIL_SELECTOR = `${PUZZLE_FEEDBACK_SELECTOR} .fail`;
  var PUZZLE_FEEDBACK_NEXT_SELECTOR = `${PUZZLE_FEEDBACK_SELECTOR} .puzzle__more`;

  // src/content/content_training.ts
  (function() {
    const extractLastSegment = (href) => href.split("/").filter(Boolean).pop();
    const puzzleId = extractLastSegment(location.pathname);
    attachCustomStylesIntoDocumentHead();
    const observer = new MutationObserver(() => checkIfPuzzleSolved());
    observer.observe(document.body, { childList: true, subtree: true });
    function checkIfPuzzleSolved() {
      const isPuzzleSolved = document.querySelector(PUZZLE_FEEDBACK_SUCCESS_SELECTOR);
      if (!isPuzzleSolved) return;
      chrome.runtime.sendMessage({ type: "puzzle_solved_single" /* puzzle_solved_single */, id: puzzleId });
      const nextPuzzleContainer = document.querySelector(PUZZLE_FEEDBACK_SELECTOR);
      if (!nextPuzzleContainer) return;
      chrome.storage.local.get([STORAGE_KEYS.TRAINING], (data) => {
        const training = data[STORAGE_KEYS.TRAINING];
        if (!training?.puzzles?.length) return;
        const unsolvedPuzzles = training.puzzles.map((link) => extractLastSegment(link)).filter((id) => id !== puzzleId);
        if (!unsolvedPuzzles?.length) return;
        const remaining = unsolvedPuzzles.length;
        const nextUnsolvedPuzzleLink = unsolvedPuzzles.pop();
        appendNextUnsolvedLink(nextPuzzleContainer, nextUnsolvedPuzzleLink, remaining);
      });
      observer.disconnect();
      return;
    }
    checkIfPuzzleSolved();
  })();
})();
