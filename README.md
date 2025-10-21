# Netflix & YouTube Speed Control Firefox Extension

![Netflix Speed Control Icon](NetflixSpeedContol.png)

## Support
If you find this extension useful, consider buying me a coffee!

[![Buy Me A Coffee](https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20coffee&button_colour=BD5FFF&font_colour=ffffff&font_family=Cookie&outline_colour=000000&coffee_colour=FFDD00)](https://buymeacoffee.com/ivideogameboss)

A Firefox WebExtension that allows you to control video playback speed on both **Netflix** and **YouTube**. It provides a simple popup UI to enable the feature and select speeds from 1x (normal) up to 4x. The extension is designed to apply speed changes instantly and seamlessly, without needing to reload the page.

**Note**: This extension is unofficial and for educational/personal purposes only. Respect the Terms of Service of the websites you use it on. Player UIs can change, which may break the extension in the future.

## Features
- **Multi-Site Support**: Works on both Netflix and YouTube video pages.
- **Speed Options**: Choose from 1x, 1.5x, 2x, 2.5x, 3x, 3.5x, or 4x playback speeds.
- **Instant Activation**: Enable the extension and change speeds without any page reloads.
- **Works on Existing Tabs**: When the extension is installed or enabled, it automatically works on any Netflix or YouTube tabs that are already open.
- **Persistent Settings**: Your preferences (enabled state and selected speed) are saved across browser sessions.
- **Manual Refresh**: Includes a fallback "Refresh Tab" button in the popup for any rare cases where the speed doesn't apply correctly.
- **Debug Logs**: Console logs for troubleshooting (visible in F12 DevTools on target pages).

## Installation
This is a temporary (unsigned) extension for Firefox. You can load it manually without using the Firefox Add-ons store.

### Prerequisites
- Firefox browser.
- A 48x48 PNG icon file named `icon.png` (the extension will work without it but will show a default icon).

### Steps to Install
1. **Download the Files**:
   - Clone this repository or download it as a ZIP file.
   - Extract the files to a dedicated folder (e.g., `SpeedControlExtension`).

2. **Files in the Repo**:
   - `manifest.json`: The core configuration file for the extension.
   - `popup.html`: The UI for the popup menu.
   - `popup.js`: The logic that powers the popup UI.
   - `content.js`: The script that runs on Netflix & YouTube pages to control the video speed.
   - `background.js`: The script that enables the extension to work on already-open tabs upon installation.
   - `style.css`: Contains styling for additional features.
   - `icon.png`: The 48x48 icon displayed in the Firefox toolbar.
   - `README.md`: This file.

3. **Load in Firefox**:
   - Open a new tab in Firefox and navigate to `about:debugging#/runtime/this-firefox`.
   - Click the "Load Temporary Add-on..." button.
   - Navigate to the folder where you extracted the files and select the `manifest.json` file.
   - The extension's icon should appear in your toolbar.

4. **Reload on Changes**: If you edit any of the extension's files, you can simply click the "Reload" button next to the extension's entry on the `about:debugging` page.

The extension will remain loaded until you close Firefox or manually remove it.

## How to Use
1. **Install the Extension**: Follow the installation steps above.
2. **Open Netflix or YouTube**: Navigate to a video on either site. The extension works on pages that were open *before* you installed it.
3. **Open the Popup**:
   - Click the extension's icon in your Firefox toolbar.
   - The popup will show:
     - A checkbox: "Enable Speed Control".
     - Radio buttons for the different speed options.
     - A "Refresh Tab to Apply" button as a manual override.
     - A status message (e.g., "Inactive" or "3x speed active").
4. **Enable and Apply Speed**:
   - Check the "Enable Speed Control" box.
   - Select your desired speed (e.g., 3x).
   - The video's speed will change **instantly**. No page reload is required.
5. **Change Speed Mid-Video**:
   - While the extension is enabled, you can open the popup at any time and select a new speed. The change will apply immediately.
6. **Disable**:
   - Uncheck the "Enable Speed Control" box. The video's speed will instantly reset to normal (1x).

## Troubleshooting
- **Speed Not Changing?**: If the speed control doesn't seem to have an effect (a rare case on a complex, already-loaded page), click the **"Refresh Tab to Apply"** button in the popup. This will reload the page and guarantee a clean start for the extension.
- **Icon Missing?**: Ensure you have a valid 48x48 PNG file named `icon.png` in the extension's folder and reload the extension.
- **Errors?**: You can inspect the extension's background console via the "Inspect" button on the `about:debugging` page. For page-specific errors, open the regular browser console (F12) on the Netflix/YouTube tab.

## Caveats
- The extension is designed to be robust, but future updates to the Netflix or YouTube video players could potentially break its functionality.
- For personal use only; not affiliated with Netflix or YouTube.

## License
This project is licensed under the MIT License—feel free to modify and share!

MIT License

Copyright (c) 2025 iVideoGameBoss

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Contributing
Fork the repo, make your changes, and submit a pull request! Issues are welcome for bug reports or feature requests (e.g., more speed options, keyboard shortcuts).

Enjoy faster binge-watching! 🚀
## Contributing
Fork the repo, make changes, and PR! Issues welcome for bugs or feature requests (e.g., more speeds, keyboard shortcuts).

Enjoy faster Netflix bingeing! 🚀
