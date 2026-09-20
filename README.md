# SFHT - SFPHP Template Syntax

Complete VSCode support for **SFHT** (Simple Framework HTML Template) - the template engine of the SFPHP microframework.

## Features

✨ **Syntax Highlighting**
- SFHT directives: `@if`, `@foreach`, `@extends`, `@block`, `@include`, etc.
- Template interpolation with variables and filters
- Comments with `{{-- --}}`
- HTML syntax support
- SFJS Reactive attributes: `@data`, `@text`, `@show`, `@if`, `@model`, etc.

💡 **IntelliSense & Autocompletion**
- Autocomplete for directives, filters, and variables
- Suggestions for `$loop` properties
- Reactive component attributes
- Smart completion in all contexts

📋 **Validation & Diagnostics**
- Detect unclosed directives (`@if` without `@endif`)
- Warn about unknown filters
- Warn about invalid directives
- Real-time error checking

🔍 **Hover Documentation**
- Detailed help for directives
- Filter descriptions and examples
- Reactive attribute documentation
- Loop variable references

🔗 **Go to Definition**
- Jump to included templates with `@include`
- Jump to extended templates with `@extends`
- Jump to components with `@component`

📝 **Snippets (28+)**
- All SFHT directives with proper syntax
- SFJS reactive components
- Form examples
- Common patterns (counters, forms, lists)

🎯 **Smart Features**
- Language configuration for brackets and folding
- Auto-closing pairs
- Quick fixes for missing closing tags
- Word pattern recognition

## Installation

1. Open VSCode Extension Marketplace
2. Search for **"SFHT"** or **"sfphp"**
3. Click **Install**

Or install from command line:
```bash
code --install-extension fabioaacarneiro.sfphp-sfht
```

## Usage

### File Association

Files with `.sfht` extension are automatically recognized:

```html
<!-- resources/views/home.sfht -->
@extends('layouts.app')

@block('content')
  <h1>Welcome</h1>
@endblock
```

### Snippets

Type shortcuts to insert template code:

| Shortcut | Description |
|----------|-------------|
| `@if` | If conditional |
| `@foreach` | Foreach loop |
| `@for` | For loop |
| `@while` | While loop |
| `@extends` | Template inheritance |
| `@block` | Block definition |
| `@include` | Include template |
| `@component` | Component |
| `@use` | Feature activation |
| `{{` | Variable interpolation |
| `{{--` | Comment |

### Syntax Examples

#### Conditionals
```sfpt
@if($user)
  <p>Hello, {{ $user->name }}</p>
@else
  <p>Please login</p>
@endif
```

#### Loops
```sfpt
@foreach($items as $item)
  <div>{{ $item->title }}</div>
@endforeach
```

#### Template Inheritance
```sfpt
@extends('layouts.base')

@block('content')
  <h1>Page Title</h1>
@endblock
```

#### Filters
```sfpt
{{ $name | upper }}
{{ $text | truncate(50) }}
{{ $data | json }}
```

#### Components
```sfpt
@component('components.button', ['label' => 'Click'])
@endcomponent
```

## What's New in v2.0

🎉 **Complete IDE Experience**
- ✨ Full IntelliSense with 11+ filter completions
- 🔍 Validation detects unclosed tags and invalid directives
- 📚 Hover documentation for every directive and filter
- 🔗 Go to Definition for includes, extends, and components
- ✅ Quick fixes for common mistakes
- 🎯 28+ snippets including SFJS reactive components

## SFPHP Framework

Learn more about SFPHP at: https://github.com/fabioaacarneiro/sfphp-project

## License

MIT

## Author

Fabio Carneiro - [@fabioaacarneiro](https://github.com/fabioaacarneiro)
