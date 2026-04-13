# Editor Plugin User Intent

User Intent plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The User Intent plugin tracks and manages the current user's interaction intent within the editor. It provides a mechanism to communicate what the user is currently doing (e.g., typing, dragging, resizing, commenting) so that other editor components can respond appropriately to this context.

## Key features

- **Intent tracking** - Track the current user interaction intent (typing, dragging, resizing, commenting, etc.)
- **State management** - Maintains and updates the current intent state across editor transactions
- **Intent types** - Supports multiple intent types including default, dragging, block menu open, resizing, commenting, AI streaming, and drag handle selection
- **Command-based updates** - Update user intent through editor commands
- **Shared state access** - Query the current user intent through the plugin's shared state interface

## Install
---
- **Install** - *yarn add @atlaskit/editor-plugin-user-intent*
- **npm** - [@atlaskit/editor-plugin-user-intent](https://www.npmjs.com/package/@atlaskit/editor-plugin-user-intent)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-user-intent)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-user-intent/dist/)

## Usage
---
**Internal use only**

@atlaskit/editor-plugin-user-intent is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin user intent](https://atlaskit.atlassian.com/packages/editor/editor-plugin-user-intent) for documentation and examples for this package.

## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.

## License
---
Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
