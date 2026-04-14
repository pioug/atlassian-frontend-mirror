# Editor Plugin Floating Toolbar

Floating toolbar plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The Floating Toolbar plugin provides a context-aware toolbar that displays relevant actions based on the current editor selection and node type. It integrates with `@atlaskit/editor-core` to render floating toolbars for various content elements with automatic positioning and visibility management.

## Key features

- **Context-aware toolbars** - Display relevant toolbar items based on selected content
- **Automatic positioning** - Smart positioning of floating toolbars with configurable alignment and offset
- **Node type matching** - Support for multiple node types with priority-based configuration selection
- **Confirmation dialogs** - Built-in support for confirmation dialogs on toolbar actions
- **Toolbar consolidation** - Automatic consolidation of overflow dropdowns for cleaner UI
- **View mode support** - Compatible with editor view mode with filtered toolbar items
- **Analytics integration** - Track toolbar interactions and state changes
- **User intent handling** - Suppress toolbar display based on user interaction state

## Install
---
- **Install** - *yarn add @atlaskit/editor-plugin-floating-toolbar*
- **npm** - [@atlaskit/editor-plugin-floating-toolbar](https://www.npmjs.com/package/@atlaskit/editor-plugin-floating-toolbar)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-floating-toolbar)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-floating-toolbar/dist/)

## Usage
---
**Internal use only**

@atlaskit/editor-plugin-floating-toolbar is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin floating toolbar](https://atlaskit.atlassian.com/packages/editor/editor-plugin-floating-toolbar) for documentation and examples for this package.

## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.

## License
---
Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
