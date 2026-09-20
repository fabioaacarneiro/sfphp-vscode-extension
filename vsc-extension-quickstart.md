# VSCode Extension Development

## Getting Started

### Install Dependencies
```bash
npm install
```

### Debug in VSCode
1. Press `F5` to start debugging
2. This opens a new VSCode window with the extension loaded
3. Open a `.sfht` file to test syntax highlighting

### Test the Extension
- Create a test file: `test.sfht`
- Try snippets: Type `@if`, `@foreach`, etc.
- Check syntax highlighting for directives and variables

## Publishing

### Prerequisites
1. Create Visual Studio Marketplace account: https://dev.azure.com/
2. Create Personal Access Token (PAT)
3. Install vsce: `npm install -g vsce`

### Publish Steps
```bash
# Login to marketplace
vsce login fabioaacarneiro

# Publish
vsce publish

# Or publish with version bump
vsce publish patch   # 1.0.0 -> 1.0.1
vsce publish minor   # 1.0.0 -> 1.1.0
vsce publish major   # 1.0.0 -> 2.0.0
```

## File Structure

```
sfphp-vscode-extension/
├── extension.js              Main extension file
├── package.json              Manifest
├── language-configuration.json
├── syntaxes/
│   └── sfht.json            Syntax rules (TextMate format)
├── snippets/
│   └── sfht.json            Code snippets
└── README.md                 Documentation
```

## Resources

- [VSCode Extension Docs](https://code.visualstudio.com/api)
- [TextMate Grammar](https://macromates.com/manual/en/language_grammars)
- [Snippet Format](https://code.visualstudio.com/docs/editor/userdefinedsnippets)

## Testing Syntax

The `syntaxes/sfht.json` file defines the syntax rules. Test by:
1. Opening a `.sfht` file
2. Using Command Palette: `Developer: Inspect Editor Tokens and Scopes`
3. This shows the syntax scope under the cursor

## Common Issues

**Extension not loading?**
- Check `package.json` has correct `contributes` section
- Verify file paths are correct
- Check browser console (F1 > Toggle Developer Tools)

**Snippets not showing?**
- Ensure `snippets/sfht.json` is valid JSON
- Check language ID matches (`sfht`)
- Restart VSCode

**Syntax not highlighting?**
- Verify file extension is `.sfht`
- Check scopes in `syntaxes/sfht.json`
- Use inspector tool to debug
