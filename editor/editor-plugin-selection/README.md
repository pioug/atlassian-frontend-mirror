# Editor Plugin Selection

Selection plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The Selection plugin provides comprehensive selection and cursor management capabilities for the Atlassian Editor. It integrates with ProseMirror to handle text selection, cursor positioning, gap cursors for structural navigation, and mark boundary indicators for better visual feedback during editing.

## Key features

- **Text selection management** - Handle and manipulate text selections within the editor
- **Gap cursor support** - Navigate between non-text blocks with visual indicators
- **Mark boundary cursors** - Display cursor position indicators at mark boundaries (e.g., code, bold, italic)
- **Auto-expand selection** - Automatically expand selection ranges when interacting with inline nodes
- **Selection utilities** - Retrieve selection fragments and local IDs from the editor state
- **Relative selection positioning** - Position selections relative to document nodes

## Install
---
- **Install** - *yarn add @atlaskit/editor-plugin-selection*
- **npm** - [@atlaskit/editor-plugin-selection](https://www.npmjs.com/package/@atlaskit/editor-plugin-selection)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-selection)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-selection/dist/)

## Usage
---
**Internal use only**

@atlaskit/editor-plugin-selection is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin selection](https://atlaskit.atlassian.com/packages/editor/editor-plugin-selection) for documentation and examples for this package.

## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#Platform-License) for more licensing information.
