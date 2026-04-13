# Editor Plugin Undo Redo

Undo redo plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The Undo Redo plugin provides undo and redo functionality for the Atlassian Editor. It integrates with `@atlaskit/prosemirror-history` to manage document history, supports both keyboard shortcuts and toolbar buttons, and tracks user actions through analytics.

## Key features

- **Undo and redo actions** - Revert or replay document changes
- **Keyboard shortcuts** - Support for standard undo/redo keyboard shortcuts
- **Toolbar buttons** - Optional toolbar UI components for undo/redo actions
- **Analytics tracking** - Track undo/redo actions and their sources
- **Configurable display** - Control toolbar button visibility
- **Multiple input sources** - Support keyboard, toolbar, and external invocations

## Install
---
- **Install** - *yarn add @atlaskit/editor-plugin-undo-redo*
- **npm** - [@atlaskit/editor-plugin-undo-redo](https://www.npmjs.com/package/@atlaskit/editor-plugin-undo-redo)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-undo-redo)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-undo-redo/dist/)

## Usage
---
**Internal use only**

@atlaskit/editor-plugin-undo-redo is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin undo redo](https://atlaskit.atlassian.com/packages/editor/editor-plugin-undo-redo) for documentation and examples for this package.

## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.

## License
---
Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
