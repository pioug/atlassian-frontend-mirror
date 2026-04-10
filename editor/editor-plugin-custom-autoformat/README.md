# Editor Plugin Custom Autoformat

Custom autoformat plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The Custom Autoformat plugin provides text pattern matching and replacement capabilities for the Atlassian Editor. It integrates with an autoformatting provider to detect user-defined text patterns and automatically replace them with formatted content, such as inline cards or transformed text nodes.

## Key features

- **Pattern matching** - Detect and match user-typed text patterns using customizable rules
- **Async replacement** - Asynchronously resolve pattern matches to replacement content
- **Provider-based rules** - Load autoformatting rules dynamically from an autoformatting provider
- **Soft break support** - Handle autoformatting correctly across soft line breaks
- **State management** - Track resolving and completed replacements with position remapping
- **History integration** - Properly integrate with ProseMirror history for undo/redo functionality

## Install
---
- **Install** - *yarn add @atlaskit/editor-plugin-custom-autoformat*
- **npm** - [@atlaskit/editor-plugin-custom-autoformat](https://www.npmjs.com/package/@atlaskit/editor-plugin-custom-autoformat)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-custom-autoformat)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-custom-autoformat/dist/)

## Usage
---
**Internal use only**

@atlaskit/editor-plugin-custom-autoformat is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin custom autoformat](https://atlaskit.atlassian.com/packages/editor/editor-plugin-custom-autoformat) for documentation and examples for this package.

## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.

## License
---
Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.