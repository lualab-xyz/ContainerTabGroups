# 📦 Building and Publishing Guide

## Building the Extension Package

### Quick Build (Manual)

The simplest way to package the extension (update version accordingly):

```powershell
# Create a ZIP file with all necessary files
Compress-Archive -Path manifest.json,background.js,options.html,options.js,options.css,i18n.js,icons -DestinationPath ContainerTabGroups-v1.0.1.zip -Force
```

### Using the Build Script (Recommended)

We've included a build script that automates the process:

```powershell
# Run the build script
.\build.ps1
```

This will create:
- `dist/ContainerTabGroups-v1.0.1.zip` - Ready to upload to AMO
- `dist/ContainerTabGroups-v1.0.1-source.zip` - Source code (if needed for review)

### What Gets Included

The package includes only the necessary files:
- ✅ `manifest.json`
- ✅ `background.js`
- ✅ `options.html`
- ✅ `options.js`
- ✅ `options.css`
- ✅ `i18n.js`
- ✅ `icons/` folder

**Excluded** (not needed for the extension):
- ❌ README.md
- ❌ TESTING.md
- ❌ CHANGELOG.md
- ❌ .git/
- ❌ .gitignore
- ❌ Build scripts

---

## Publishing to Firefox Add-ons (AMO)

### Prerequisites

1. **Firefox Account**: Create one at https://addons.mozilla.org/
2. **Developer Account**: Accept the developer agreement
3. **Package**: Your `.zip` file from the build step

### Step 1: Submit Your Extension

1. Go to https://addons.mozilla.org/developers/addon/submit/distribution
2. Choose "On this site" (to list on AMO)
3. Click "Continue"

### Step 2: Upload Your Package

1. Click "Select a file" or drag & drop `ContainerTabGroups-v1.0.0.zip`
2. Wait for validation (usually takes a few seconds)
3. Fix any errors if they appear
4. Click "Continue"

### Step 3: Fill Extension Information

**Basic Information:**
- **Name**: Container Tab Groups
- **Add-on URL**: container-tab-groups (or your preference)
- **Summary**: Automatically organize tabs into groups based on their Firefox Multi-Account Containers
- **Description**: Copy from README.md or use:

```
Container Tab Groups automatically organizes your Firefox tabs into groups based on their Multi-Account Containers.

Features:
• Automatic tab grouping by container
• Color synchronization with containers
• Configurable "No Container" tab handling
• Bilingual interface (English/Spanish)
• Real-time group management

Simply install and your tabs will organize themselves!
```

**Categories:**
- Tabs
- Privacy & Security

**Tags**: containers, tabs, organization, groups, multi-account

**Support Information:**
- **Homepage**: Your GitHub repo URL
- **Support email**: Your email (optional)
- **Support site**: GitHub Issues URL

### Step 4: Version Information

- **Version number**: 1.0.0
- **Release notes**: Copy from CHANGELOG.md

**Compatible with:**
- Firefox: Select the minimum version that supports Tab Groups API

**License**: MIT License (already in your repo)

### Step 5: Review & Submit

1. Review all information
2. Click "Submit Version"
3. Wait for automated review (usually minutes to hours)
4. Manual review may be needed (can take a few days)

---

## After Publication

### Update Badge in README

Add to your README.md:

```markdown
[![Mozilla Add-on](https://img.shields.io/amo/v/container-tab-groups)](https://addons.mozilla.org/firefox/addon/container-tab-groups/)
[![Mozilla Add-on Users](https://img.shields.io/amo/users/container-tab-groups)](https://addons.mozilla.org/firefox/addon/container-tab-groups/)
[![Mozilla Add-on Rating](https://img.shields.io/amo/rating/container-tab-groups)](https://addons.mozilla.org/firefox/addon/container-tab-groups/)
```

### For Future Updates

1. Update version in `manifest.json`
2. Update `CHANGELOG.md`
3. Run build script
4. Go to your extension page on AMO
5. Click "Upload New Version"
6. Upload the new `.zip` file

---

## Self-Distribution (Alternative)

If you want to distribute outside AMO:

### Option 1: Signed XPI (Recommended)

1. Go to https://addons.mozilla.org/developers/addon/submit/distribution
2. Choose "On your own"
3. Upload your `.zip`
4. Download the signed `.xpi` file
5. Distribute the `.xpi` file

Users can install by dragging the `.xpi` to Firefox.

### Option 2: Unsigned (Development Only)

Only works in Developer/Nightly editions with `xpinstall.signatures.required` set to `false`.

Not recommended for public distribution.

---

## Versioning Strategy

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.x.x): Breaking changes
- **MINOR** (x.1.x): New features, backwards compatible
- **PATCH** (x.x.1): Bug fixes

Example:
- 1.0.0 - Initial release
- 1.0.1 - Bug fix
- 1.1.0 - New feature
- 2.0.0 - Breaking change

---

## Tips for Approval

✅ **Do:**
- Use clear, descriptive code
- Include detailed descriptions
- Test thoroughly before submitting
- Respond quickly to reviewer feedback

❌ **Don't:**
- Include minified/obfuscated code without source
- Use remote scripts
- Request unnecessary permissions
- Include analytics without disclosure

---

## Troubleshooting

**"Manifest validation failed"**
- Check JSON syntax in manifest.json
- Verify all required fields are present

**"Could not find icon"**
- Ensure icons/ folder is included in the package
- Check paths in manifest.json

**"Version already exists"**
- Increment version number in manifest.json
- Can't reuse version numbers

**"Manual review required"**
- Normal for first submission
- Can take 1-5 days
- Check email for updates

---

Need help? Check:
- [AMO Developer Hub](https://addons.mozilla.org/developers/)
- [Extension Workshop](https://extensionworkshop.com/)
- [Firefox Add-on Guidelines](https://extensionworkshop.com/documentation/publish/add-on-policies/)
