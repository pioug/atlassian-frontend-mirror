# Editor Plugin Code Block

Code Block plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The code block plugin extends the Atlassian Editor with rich code editing functionality. It provides the code block node with language selection and IDE-like keyboard shortcuts for a better code editing experience.

## Key features

- **Language Selection** - Support for multiple programming languages
- **IDE-like Keyboard Shortcuts** - Auto-closing brackets and quotes, smart indentation
- **Line Numbers** - Display of line numbers and tracking of line positions
- **Word Wrapping** - Support for toggling word wrap in code blocks
- **Toolbar Support** - Floating toolbar with language selector and additional actions
- **Quick Insert** - Insert code blocks using the quick insert menu with `/` or ` ``` `

## Install
---
- **Install** - *yarn add @atlaskit/editor-plugin-code-block*
- **npm** - [@atlaskit/editor-plugin-code-block](https://www.npmjs.com/package/@atlaskit/editor-plugin-code-block)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-code-block)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-code-block/dist/)

## Usage
---
**Internal use only**

@atlaskit/editor-plugin-code-block is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin code block](https://atlaskit.atlassian.com/packages/editor/editor-plugin-code-block) for documentation and examples for this package.

### Plugin Configuration

The plugin accepts the following configuration options via `CodeBlockPluginOptions`:

- `allowCopyToClipboard`: Enable/disable the copy to clipboard button (boolean)
- `overrideLanguageName`: Function to customize language display names
- `useLongPressSelection`: Enable long-press selection on mobile (boolean)
- `allowCompositionInputOverride`: Allow composition input override on mobile (boolean)

### Plugin Actions

The plugin provides the following action:

- `insertCodeBlock(inputMethod)`: Insert a code block at the current selection with analytics tracking

## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.

## License
---
Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.