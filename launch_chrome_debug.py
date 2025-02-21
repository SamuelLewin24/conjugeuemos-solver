import subprocess

chrome_path = r'"C:\Program Files\Google\Chrome\Application\chrome.exe"'
debug_command = f'{chrome_path} --remote-debugging-port=9222 --user-data-dir="C:\\ChromeProfile"'

subprocess.Popen(debug_command, shell=True)