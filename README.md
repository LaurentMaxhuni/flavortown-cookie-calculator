# 🍪 Flavortown Cookie Goal Calculator

A Chrome extension that helps Hack Club members track their cookies and set savings goals for Flavortown store items.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## What It Does

- 🎯 **Track Your Cookies**: See your current cookie balance in real-time
- 📊 **Set Goals**: Create multiple savings goals for store items
- 🏪 **Browse Store**: View all Flavortown store items and their prices
- 💾 **Local Storage**: All your data stays on your computer
- ✨ **Beautiful UI**: Cookie-themed design with smooth animations

## Screenshots

### Main View
See your cookie balance and track multiple goals with progress bars.

### Store Browser
Browse all available Flavortown items and click to create goals instantly.

### Goal Tracking
Watch your progress with visual indicators showing how close you are to each goal.

## Installation

### For Users

1. Download the latest release
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `flavortown-cookie-calculator` folder
6. Click the extension icon and enter your API key

### Getting Your API Key

1. Go to Flavortown Settings (by clicking on the little gear icon)
2. Find or generate your API key
3. Copy it
4. Paste it into the extension when prompted

## Usage

### Adding Your First Goal

1. Click the extension icon in your toolbar
2. Enter the number of cookies you want to save
3. Give your goal a name (e.g., "Sprig Console")
4. Click "Add Goal"

### Quick Goal from Store

1. Click "Browse Store Items"
2. Click any item you want
3. The extension automatically creates a goal for that item's price

### Managing Goals

- **View Progress**: Each goal shows a progress bar and percentage complete
- **Delete Goals**: Click the × button to remove a goal
- **Refresh Data**: Click ↻ to update your cookie balance


### Tech Stack

- **Vanilla JavaScript** - No frameworks needed
- **Chrome Extension Manifest V3** - Latest standard
- **Chrome Storage API** - Local data persistence
- **Flavortown API v1** - Real-time cookie data

### API Endpoints Used

```
GET /api/v1/users/me          # Get user data and cookie balance
GET /api/v1/store             # Get all store items
```

### Key Features Implementation

**Authentication:**
```javascript
headers: {
  'Authorization': `Bearer ${apiKey}`
}
```

**Local Storage:**
```javascript
chrome.storage.local.get(['key'], callback)
chrome.storage.local.set({key: value}, callback)
```

**Goal Tracking:**
- Goals stored as JSON array in Chrome storage
- Progress calculated: `(currentCookies / goalAmount) * 100`
- Visual progress bars update in real-time

### Development Setup

1. Clone or download this repository
2. Open the folder in your text editor
3. Make changes to the files
4. Go to `chrome://extensions/`
5. Click "Reload" on your extension to see changes

### Testing

1. Load the extension in Chrome
2. Enter a test API key
3. Add a few goals
4. Test all buttons and features
5. Check for console errors (F12)

## API Rate Limits

Be mindful of Flavortown API rate limits:
- `/users/me` - 30 requests/minute
- `/store` - 5 requests/minute

The extension caches data to minimize API calls.

## Privacy & Security

- ✅ API key stored locally (never shared)
- ✅ No data sent to third parties
- ✅ Only communicates with official Flavortown API
- ✅ All preferences stored in your browser
- ✅ Open source - verify the code yourself

## Troubleshooting

### "Invalid API Key" Error

**Problem:** Can't connect to Flavortown
**Solution:**
- Verify you copied the entire API key
- Try regenerating your key in Flavortown settings
- Make sure there are no extra spaces

### Data Not Refreshing

**Problem:** Cookie count not updating
**Solution:**
- Click the ↻ Refresh button
- Check your internet connection
- Verify you're logged into Flavortown

### Extension Not Loading

**Problem:** Chrome won't load the extension
**Solution:**
- Enable Developer mode in `chrome://extensions/`
- Check for errors in the Chrome console
- Verify all files are in the folder
- Try removing and re-adding the extension

### Goals Not Saving

**Problem:** Goals disappear when reopening
**Solution:**
- Check Chrome storage permissions in manifest.json
- Look for JavaScript errors in console (F12)
- Try clearing extension storage and re-adding goals

## Contributing

Want to improve this extension? Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Ideas for Contributions

- [ ] Add goal categories/tags
- [ ] Cookie earning rate calculator
- [ ] Historical tracking graphs
- [ ] Export/import goals
- [ ] Dark mode toggle
- [ ] Notifications when goals are reached
- [ ] Integration with Scrapbook
- [ ] Weekly progress reports

## Credits & Acknowledgments

**Created for:** Hack Club's Flavortown

**Built with:** Love, cookies, and late-night coding sessions 🍪

**Special thanks to:**
- Hack Club team for building Flavortown
- The Hack Club community for feedback
- Everyone who uses and improves this extension

## Resources

- [Flavortown](https://flavortown.hackclub.com) - The main platform
- [Flavortown API Docs](https://flavortown.hackclub.com/api/v1/docs) - API reference
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/) - Learn more
- [Hack Club](https://hackclub.com) - Join the community

## License

MIT License - see LICENSE file for details

**TL;DR:** You can use, modify, and distribute this freely. Just keep the license notice.

## Support

- **Issues:** Open an issue on GitHub
- **Questions:** Ask in Hack Club Slack
- **Flavortown Help:** [Flavortown Support](https://flavortown.hackclub.com)

---

**Made with 🍪 by a Hack Clubber, for Hack Clubbers**

*This is an unofficial extension and is not officially endorsed by Hack Club.*
