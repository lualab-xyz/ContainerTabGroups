# Makefile for Container Tab Groups
# Works on Linux/Mac with make installed

VERSION = 1.0.1
PACKAGE_NAME = ContainerTabGroups-v$(VERSION).zip
DIST_DIR = dist

# Files to include in the package
EXTENSION_FILES = manifest.json background.js options.html options.js options.css i18n.js icons

.PHONY: all build clean test help

all: build

# Build the extension package
build: clean
	@echo "🔨 Building Container Tab Groups v$(VERSION)"
	@mkdir -p $(DIST_DIR)
	@echo "📦 Creating package..."
	@zip -r $(DIST_DIR)/$(PACKAGE_NAME) $(EXTENSION_FILES) -x "*.DS_Store" "*.git*"
	@echo "✅ Package created: $(DIST_DIR)/$(PACKAGE_NAME)"
	@echo "📊 Package size: $$(du -h $(DIST_DIR)/$(PACKAGE_NAME) | cut -f1)"
	@echo "✨ Build complete!"

# Build with source code included
build-source: build
	@echo "📚 Creating source package..."
	@zip -r $(DIST_DIR)/ContainerTabGroups-v$(VERSION)-source.zip . \
		-x "*.git*" "dist/*" "node_modules/*" "*.zip" "*.xpi" "*.DS_Store"
	@echo "✅ Source package created"

# Clean build artifacts
clean:
	@echo "🗑️  Cleaning build artifacts..."
	@rm -rf $(DIST_DIR)
	@echo "✅ Clean complete"

# Test package contents
test:
	@echo "📋 Testing package..."
	@unzip -l $(DIST_DIR)/$(PACKAGE_NAME)

# Show help
help:
	@echo "Container Tab Groups - Build Commands"
	@echo ""
	@echo "Usage:"
	@echo "  make build         - Build the extension package"
	@echo "  make build-source  - Build with source code"
	@echo "  make clean         - Remove build artifacts"
	@echo "  make test          - Show package contents"
	@echo "  make help          - Show this help message"
	@echo ""
	@echo "Variables:"
	@echo "  VERSION=$(VERSION)"
