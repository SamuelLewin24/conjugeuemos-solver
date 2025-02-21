# Conjuguemos Bot

## This Bot:
* Extracts phrases from conjuguemos
* Looks up translations from a local JSON database
* Types the answer found in the local DB (instead of pasting)
* Submits the answer and checks correctness
* Updates the database if a new correct answer is found
* Logs errors, and quits when something goes wrong

## Installation

This instalation guide is designed for people who have very minimal computer knowledge

### 1. Clone Repository
Open windows terminal and run:
```sh
git clone https://github.com/SamuelLewin24/conjugeuemos-solver.git
```
### 2. Navigate to folder
Within windows terminal run:
```sh
cd conjugeuemos-solver
```
### 3. Install Dependencies
Ensure you have Python and Selenium installed, run:
```sh
pip install selenium
```

### 2. Run chrome in debug mode
The bot connects to an **already open Chrome browser**. To do this:
- **Close all Chrome windows**
- Run Chrome in debugging mode:
  ```sh
  chrome.exe --remote-debugging-port=9222 --user-data-dir="C:\ChromeProfile"
  ```
  *(On Mac/Linux, use:)*
  ```sh
  /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir="/tmp/ChromeProfile"
  ```
  - On new chrome window open conjuguemos and assignment wanted to automate **BEFORE** running

## Usage
### Run the script in terminal:
```sh
python translator_bot.py
```
### What Happens:
1. The bot extracts the Spanish phrase from the webpage.
2. If found in `translations.json`, it types the translation.
3. If not found, it types `"a"`, submits it, and waits for the correct answer.
4. It extracts only the **first** correct phrase (ignoring extra suggestions like "or").
5. Updates `translations.json` and continues.
6. Logs any errors in `errors.log` and exits if something goes wrong.

## Troubleshooting
### Error: "Could not find Spanish phrase"
- Ensure the website is open in Chrome.
- Check if the correct **element IDs or XPaths** are still valid.

### Error: "Could not retrieve correct answer"
- The webpage format might have changed. Update the script's XPath selectors.

### Error: "Could not attach to Chrome"
- Chrome **must be running in debugging mode** (`--remote-debugging-port=9222`).

### Other Error/Can't find fix:
- Do the assignment manually you lazy cheater

