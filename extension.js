const vscode = require('vscode');

/**
 * SFHT VSCode Extension
 * Syntax highlighting, snippets, IntelliSense, validation, and documentation
 */

// ========== DATA ==========

const FILTERS = {
  upper: { desc: 'Convert to uppercase', example: '{{ $text | upper }}' },
  lower: { desc: 'Convert to lowercase', example: '{{ $text | lower }}' },
  capitalize: { desc: 'Capitalize first letter', example: '{{ $text | capitalize }}' },
  truncate: { desc: 'Truncate to length', example: '{{ $text | truncate(50) }}' },
  escape: { desc: 'Escape HTML entities', example: '{{ $html | escape }}' },
  json: { desc: 'Convert to JSON', example: '{{ $data | json }}' },
  format: { desc: 'Format string', example: '{{ $date | format("Y-m-d") }}' },
  trim: { desc: 'Remove whitespace', example: '{{ $text | trim }}' },
  reverse: { desc: 'Reverse string', example: '{{ $text | reverse }}' },
  abs: { desc: 'Absolute value', example: '{{ $number | abs }}' },
  round: { desc: 'Round number', example: '{{ $number | round(2) }}' },
};

const DIRECTIVES = {
  if: { desc: 'Conditional block', syntax: '@if($condition) ... @endif' },
  elseif: { desc: 'Else if condition', syntax: '@elseif($condition)' },
  else: { desc: 'Else block', syntax: '@else' },
  foreach: { desc: 'Loop over items', syntax: '@foreach($items as $item) ... @endforeach' },
  for: { desc: 'For loop', syntax: '@for($i = 0; $i < $count; $i++) ... @endfor' },
  while: { desc: 'While loop', syntax: '@while($condition) ... @endwhile' },
  extends: { desc: 'Extend template', syntax: "@extends('layout.base')" },
  block: { desc: 'Template block', syntax: '@block("name") ... @endblock' },
  include: { desc: 'Include template', syntax: "@include('partial')" },
  includeWhen: { desc: 'Conditional include', syntax: "@includeWhen($cond, 'partial')" },
  component: { desc: 'Use component', syntax: "@component('name', ['prop' => 'value'])" },
  use: { desc: 'Activate feature', syntax: '@use(FeatureName)' },
};

const LOOP_VARS = {
  first: 'First iteration?',
  last: 'Last iteration?',
  even: 'Even iteration?',
  odd: 'Odd iteration?',
  iteration: 'Current iteration number',
  index: 'Current index (0-based)',
  count: 'Total items count',
};

const REACTIVE_ATTRS = {
  data: { desc: 'Initialize reactive component', example: '@data="{ count: 0 }"' },
  text: { desc: 'Bind text content', example: '@text="message"' },
  html: { desc: 'Bind HTML content', example: '@html="htmlContent"' },
  show: { desc: 'Toggle visibility', example: '@show="visible"' },
  if: { desc: 'Conditional rendering', example: '@if="showForm"' },
  model: { desc: 'Two-way binding', example: '@model="email"' },
  init: { desc: 'Initialize component', example: '@init="setup()"' },
};

// ========== ACTIVATION ==========

function activate(context) {
  console.log('SFHT extension activated with full features');

  // Register providers
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider('sfht', new CompletionProvider()),
    vscode.languages.registerHoverProvider('sfht', new HoverProvider()),
    vscode.languages.registerDefinitionProvider('sfht', new DefinitionProvider()),
    vscode.languages.registerCodeActionsProvider('sfht', new CodeActionsProvider())
  );

  // Validate on open and change
  const diagnosticsCollection = vscode.languages.createDiagnosticCollection('sfht');
  context.subscriptions.push(diagnosticsCollection);

  if (vscode.window.activeTextEditor) {
    validateDocument(vscode.window.activeTextEditor.document, diagnosticsCollection);
  }

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(editor => {
      if (editor && editor.document.languageId === 'sfht') {
        validateDocument(editor.document, diagnosticsCollection);
      }
    }),
    vscode.workspace.onDidChangeTextDocument(e => {
      if (e.document.languageId === 'sfht') {
        validateDocument(e.document, diagnosticsCollection);
      }
    })
  );
}

// ========== COMPLETION PROVIDER ==========

class CompletionProvider {
  provideCompletionItems(document, position, token, context) {
    const items = [];

    // Directives
    Object.entries(DIRECTIVES).forEach(([name, info]) => {
      const item = new vscode.CompletionItem(`@${name}`, vscode.CompletionItemKind.Keyword);
      item.detail = info.desc;
      item.documentation = info.syntax;
      items.push(item);
    });

    // Filters
    Object.entries(FILTERS).forEach(([name, info]) => {
      const item = new vscode.CompletionItem(`| ${name}`, vscode.CompletionItemKind.Function);
      item.detail = info.desc;
      item.documentation = info.example;
      item.insertText = `| ${name}`;
      items.push(item);
    });

    // Loop variables
    Object.entries(LOOP_VARS).forEach(([name, desc]) => {
      const item = new vscode.CompletionItem(`$loop->${name}`, vscode.CompletionItemKind.Variable);
      item.detail = desc;
      item.documentation = `$loop->${name}`;
      item.insertText = `$loop->${name}`;
      items.push(item);
    });

    // Reactive attributes
    Object.entries(REACTIVE_ATTRS).forEach(([name, info]) => {
      const item = new vscode.CompletionItem(`@${name}`, vscode.CompletionItemKind.Property);
      item.detail = info.desc;
      item.documentation = info.example;
      items.push(item);
    });

    return items;
  }
}

// ========== HOVER PROVIDER ==========

class HoverProvider {
  provideHover(document, position, token) {
    const range = document.getWordRangeAtPosition(position, /[\w$|@->]+/);
    if (!range) return null;

    const word = document.getText(range);

    // Check filters
    if (word.startsWith('|')) {
      const filterName = word.substring(1).trim();
      if (FILTERS[filterName]) {
        const info = FILTERS[filterName];
        return new vscode.Hover(
          new vscode.MarkdownString(
            `**Filter:** \`${filterName}\`\n\n${info.desc}\n\n\`\`\`\n${info.example}\n\`\`\``
          )
        );
      }
    }

    // Check directives
    if (word.startsWith('@')) {
      const dirName = word.substring(1).toLowerCase();
      if (DIRECTIVES[dirName]) {
        const info = DIRECTIVES[dirName];
        return new vscode.Hover(
          new vscode.MarkdownString(
            `**Directive:** \`${word}\`\n\n${info.desc}\n\n\`\`\`\n${info.syntax}\n\`\`\``
          )
        );
      }
      if (REACTIVE_ATTRS[dirName]) {
        const info = REACTIVE_ATTRS[dirName];
        return new vscode.Hover(
          new vscode.MarkdownString(
            `**Reactive Attribute:** \`${word}\`\n\n${info.desc}\n\n\`\`\`\n${info.example}\n\`\`\``
          )
        );
      }
    }

    // Check loop variables
    if (word.includes('$loop->')) {
      const loopVar = word.split('->')[1];
      if (LOOP_VARS[loopVar]) {
        return new vscode.Hover(
          new vscode.MarkdownString(
            `**Loop Variable:** \`$loop->${loopVar}\`\n\n${LOOP_VARS[loopVar]}`
          )
        );
      }
    }

    return null;
  }
}

// ========== DEFINITION PROVIDER ==========

class DefinitionProvider {
  provideDefinition(document, position, token) {
    const range = document.getWordRangeAtPosition(position, /['"]([^'"]+)['"]/);
    if (!range) return null;

    const fullText = document.getText(range);
    const match = fullText.match(/['"]([^'"]+)['"]/);
    if (!match) return null;

    const filePath = match[1];
    const line = document.lineAt(position.line);

    // Check if it's an @extends
    if (line.text.includes('@extends')) {
      return this.resolveFile(document, filePath, 'sfht');
    }

    // Check if it's an @include
    if (line.text.includes('@include')) {
      return this.resolveFile(document, filePath, 'sfht');
    }

    // Check if it's a @component
    if (line.text.includes('@component')) {
      return this.resolveFile(document, filePath, 'sfht');
    }

    return null;
  }

  resolveFile(document, filePath, ext) {
    // Try different file locations
    const paths = [
      `${filePath}.${ext}`,
      filePath,
      `resources/views/${filePath}.${ext}`,
      `app/Views/${filePath}.${ext}`,
    ];

    // Return first path as potential definition
    // In real implementation, would validate file existence
    const uri = vscode.Uri.file(paths[0]);
    return new vscode.Location(uri, new vscode.Position(0, 0));
  }
}

// ========== CODE ACTIONS PROVIDER ==========

class CodeActionsProvider {
  provideCodeActions(document, range, context, token) {
    const actions = [];
    const line = document.lineAt(range.start.line);

    // Quick fix for missing @endif
    if (line.text.includes('@if') && !document.getText().includes('@endif')) {
      const action = new vscode.CodeAction('Add @endif', vscode.CodeActionKind.QuickFix);
      action.edit = new vscode.WorkspaceEdit();
      action.edit.insert(document.uri, new vscode.Position(document.lineCount, 0), '\n@endif');
      actions.push(action);
    }

    // Quick fix for missing @endforeach
    if (line.text.includes('@foreach') && !document.getText().includes('@endforeach')) {
      const action = new vscode.CodeAction('Add @endforeach', vscode.CodeActionKind.QuickFix);
      action.edit = new vscode.WorkspaceEdit();
      action.edit.insert(document.uri, new vscode.Position(document.lineCount, 0), '\n@endforeach');
      actions.push(action);
    }

    return actions;
  }
}

// ========== VALIDATION ==========

function validateDocument(document, diagnosticsCollection) {
  const diagnostics = [];
  const text = document.getText();
  const lines = text.split('\n');

  const opens = {
    '@if': '@endif',
    '@foreach': '@endforeach',
    '@for': '@endfor',
    '@while': '@endwhile',
    '@block': '@endblock',
    '@component': '@endcomponent',
  };

  lines.forEach((line, lineNum) => {
    // Check for unclosed tags
    Object.entries(opens).forEach(([open, close]) => {
      if (line.includes(open)) {
        const closePattern = new RegExp(`${close.replace('@', '\\@')}`);
        if (!text.includes(close)) {
          diagnostics.push(
            new vscode.Diagnostic(
              new vscode.Range(lineNum, 0, lineNum, line.length),
              `Missing ${close}`,
              vscode.DiagnosticSeverity.Warning
            )
          );
        }
      }
    });

    // Check for invalid filters
    const filterMatches = line.matchAll(/\|\s*(\w+)/g);
    for (const match of filterMatches) {
      const filterName = match[1];
      if (!FILTERS[filterName]) {
        diagnostics.push(
          new vscode.Diagnostic(
            new vscode.Range(lineNum, match.index, lineNum, match.index + match[0].length),
            `Unknown filter: ${filterName}`,
            vscode.DiagnosticSeverity.Information
          )
        );
      }
    }

    // Check for invalid directives
    const dirMatches = line.matchAll(/@(\w+)/g);
    for (const match of dirMatches) {
      const dirName = match[1];
      if (!DIRECTIVES[dirName] && !REACTIVE_ATTRS[dirName]) {
        diagnostics.push(
          new vscode.Diagnostic(
            new vscode.Range(lineNum, match.index, lineNum, match.index + match[0].length),
            `Unknown directive: @${dirName}`,
            vscode.DiagnosticSeverity.Information
          )
        );
      }
    }
  });

  diagnosticsCollection.set(document.uri, diagnostics);
}

function deactivate() {
  console.log('SFHT extension deactivated');
}

module.exports = {
  activate,
  deactivate,
};
