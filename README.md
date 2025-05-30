# AbleSnatch - Ableton Downloader Userscript

A Tampermonkey/Greasemonkey userscript that enhances the Ableton Live trial download page (`https://www.ableton.com/en/trial/`) by replacing the standard trial download button with a more versatile interface.

## Features

*   **Select Version Type:** Choose between Stable or Beta releases.
*   **Specific Version Selection:** Pick from a list of specific version numbers fetched directly from Ableton's official release notes.
*   **Edition Choice (for Stable):** Select Suite, Standard, Intro, or Trial editions for stable releases.
*   **Custom Styled UI:** Modern, animated interface that integrates with the Ableton website.
*   **Stable Layout:** Designed to prevent page layout shifts during loading.
*   **Direct Download Links:** Constructs and initiates direct downloads for your chosen version.

## Screenshot / Demo

*Here's how the new interface looks:*
![image](https://github.com/user-attachments/assets/6a648d4b-dcc7-4683-bea3-98e70d1c6d45)

https://github.com/user-attachments/assets/2860b6f5-c6fb-471d-97b8-9474555f83ce


## Prerequisites

*   A userscript manager browser extension such as:
    *   [Tampermonkey](https://www.tampermonkey.net/) (Recommended)
    *   [Greasemonkey](https://www.greasespot.net/) (Firefox)
    *   [Violentmonkey](https://violentmonkey.github.io/)

## Installation

1.  **Install a userscript manager** (if you haven't already) from the links above.
2.  **Click the link below** to install AbleSnatch:
    *   [**Install AbleSnatch from GitHub**](https://raw.githubusercontent.com/HimuCodes/AbleSnatch/main/AbleSnatch.user.js)
    *   (Your userscript manager should automatically detect the `.user.js` file and prompt you for installation.)

Alternatively, you can copy the contents of `AbleSnatch.user.js` and manually create a new script in your userscript manager.

## Usage

1.  After installation, navigate to the Ableton Live trial page: [https://www.ableton.com/en/trial/](https://www.ableton.com/en/trial/)
2.  The original "Download free trial" button (or similar) will be hidden.
3.  A new interface with dropdowns for "Version Type," "Select Version," and (for stable) "Edition" will appear.
4.  Make your selections.
5.  Click the "Download Selected Version" button to start your download.

## Known Issues/Limitations

*   The script relies on the specific HTML structure of Ableton's release notes pages to fetch version numbers. Significant changes to these pages by Ableton might break the version fetching functionality.
*   The script targets the `/en/trial/` page. Other language versions of the trial page might not work without modification.

## Contributing

Bug reports, feature requests, and contributions are welcome! Please feel free to:
*   [Open an issue](https://github.com/HimuCodes/AbleSnatch/issues) for bugs or suggestions.
*   Fork the repository and submit a pull request for improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

*   **HimuCodes** - [GitHub Profile](https://github.com/HimuCodes)
