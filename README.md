# Container Tab Groups

Firefox extension that automatically organizes your tabs into groups based on their Multi-Account Containers.

## Features

- 🎯 **Automatic Grouping**: Tabs automatically organize by container
- 🎨 **Color Sync**: Groups match container colors
- ⚙️ **Configurable**: Control grouping behavior and "No Container" tabs
- 🌍 **Bilingual**: Full English & Spanish support
- 🔄 **Real-time**: Updates as you work

## Installation

### From Source

1. Clone this repository
2. Open Firefox and go to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select `manifest.json` from the project folder

### From Firefox Add-ons (Coming Soon)

Once published, you'll be able to install directly from the Firefox Add-ons store.

## Usage

The extension works automatically once installed. All tabs opened in containers will be grouped together.

### Configuration

Access settings via `about:addons` → Container Tab Groups → Options

**Available options:**
- **Enable automatic tab grouping**: Turn the extension on/off
- **Create group for "No Container" tabs**: Group regular tabs or leave them ungrouped
- **Language**: Switch between English and Spanish

## Development

### Building

```powershell
# Windows
.\build.ps1

# Linux/Mac
make build

# Cross-platform (with npm)
npm run build
```

Output: `dist/ContainerTabGroups-v1.0.0.zip`

### Publishing

See [PUBLISHING.md](PUBLISHING.md) for instructions on publishing to Firefox Add-ons (AMO).

### Project Structure

```
ContainerTabGroups/
├── manifest.json       # Extension configuration
├── background.js       # Main extension logic
├── options.html        # Options page UI
├── options.js          # Options page logic
├── options.css         # Options page styles
├── i18n.js            # Internationalization system
├── icons/             # Extension icons
├── build.ps1          # Build script (Windows)
├── Makefile           # Build script (Linux/Mac)
└── PUBLISHING.md      # Publishing guide
```

## Requirements

- Firefox with Tab Groups API support
- (Optional) Firefox Multi-Account Containers extension

## License

MIT License - see [LICENSE](LICENSE) file for details

## Contributing

Contributions are welcome! Feel free to open issues or pull requests.

## Author

Bruno Grillo Cruz
