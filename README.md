# LiRacer - Lichess Puzzle Tracker

A Chrome extension that automatically saves puzzles from Lichess Puzzle Racer and Puzzle Storm so you can review them later.

## Overview

The **Lichess Puzzles Tracker** extension helps you efficiently track and manage puzzles from racer runs and storm runs from Lichess. It automatically collects solved and unsolved puzzle links and provides an organized interface to manage, review and revisit them.

This extension was inspired to help [ElyneLee](https://www.twitch.tv/elynelee) keep track of unsolved puzzles from previous puzzle racer runs, allowing for easy review and solving of those puzzles after the races.

## What It Does

- **Auto-saves puzzles** from Puzzle Racer and Puzzle Storm runs
- **Groups runs by timestamp** - see today's runs, yesterday's runs, and so on for you to manage
- **Tracks your progress and stats** - shows how many puzzles you solved, how many missed, and other stats for you to review later
- **Marks reviewed puzzles automatically** - when you solve a failed puzzle on `lichess.org/training`, it moves to the reviewed list
- **Shows completion status** - runs with all puzzles reviewed get marked as completed
- **Adapts to your theme** - supports both light and dark modes

The goal: review all unsolved puzzles from your daily runs, track your progress per run and per day, and keep everything organized.

## Works With

- **Puzzle Racer** - [`lichess.org/racer`](https://lichess.org/racer)
- **Puzzle Storm** - [`lichess.org/storm`](https://lichess.org/storm)
- **Puzzle Training** - `lichess.org/training/[puzzle]` (where you review saved puzzles)

## Installation

1. Download or clone this repo
2. Go to [`chrome://extensions/`](chrome://extensions/) in Chrome
3. Turn on "Developer mode" (top right corner)
4. Click "Load unpacked" and select the extension folder
5. You'll see the LiRacer icon in your toolbar

## How to Use

1. Head to Lichess [`Puzzle Racer`](https://lichess.org/racer) or [`Puzzle Storm`](https://lichess.org/storm)
2. Play normally - when your run finishes, the extension automatically saves your puzzles and your run stats (score, rank, etc.)
3. Click the extension icon to see your saved puzzles grouped by run and day
4. Click any unsolved puzzle link to jump to `lichess.org/training/[puzzle]`
5. Solve the puzzle - it automatically moves to your reviewed list
6. Keep going until all runs show as complete!

## How It Works

1. **Content Scripts** - Monitor puzzle activity on Lichess pages
2. **Background Worker** - Manages storage and data persistence
3. **Popup Interface** - Displays collected puzzles and provides navigation
4. **Chrome Storage API** - Persists puzzle data across sessions


## Permissions Explained

The extension needs a few permissions to work:

- **Access to lichess.org** - to detect and save puzzles during runs
- **Storage** - to keep your puzzles saved locally in your browser (your data stays on your device)
- **Tabs** - to open puzzle links and detect when you've solved them on the training page
- **Downloads** - to export your puzzle stats and backups

## Browser Support

- Chrome/Chromium-based browsers with Manifest V3 support (including Edge browser)

## License

Free to use for personal purposes.

## Contributing

Found a bug or have an idea? Feel free to open an issue or suggest improvements!  
Want to check out the source code? visit [`https://github.com/akmalkrmv/liracer-extension-source`](https://github.com/akmalkrmv/liracer-extension-source)

---

Made with ♟️ for the Lichess community