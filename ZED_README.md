# SFHT - Zed Editor Support

This directory contains the Zed Editor extension for SFHT (SFPHP Template Engine) syntax highlighting.

## Installation

1. Copy the `zed` directory to your Zed extensions folder:
   ```bash
   mkdir -p ~/.local/share/zed/extensions
   cp -r zed/sfht ~/.local/share/zed/extensions/
   ```

2. Restart Zed

3. Files with `.sfht` extension will now have syntax highlighting

## Features

✨ **Syntax Highlighting**
- SFHT directives (@if, @foreach, @extends, etc.)
- Template interpolation with variables
- Comments with {{-- --}}
- HTML syntax support

📝 **Snippets**
- Quick templates for common directives
- Form patterns
- Component examples

## Structure

```
zed/
├── extension.toml           # Zed extension manifest
├── languages/
│   └── sfht/
│       ├── language.toml    # Language definition
│       └── highlights.scm   # Syntax highlighting rules
└── snippets/
    └── sfht.json           # Code snippets
```

## Building for Publication

```bash
# Publish to Zed Marketplace
zed ext publish
```

## Documentation

See parent directory `README.md` for complete SFHT documentation and features.
