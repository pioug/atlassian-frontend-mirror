# Editor Plugin History

History plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The History plugin provides undo and redo functionality for the Atlassian Editor. It tracks document changes and manages the history state, allowing users to revert or reapply edits. The plugin integrates with ProseMirror's history system to monitor transaction history and expose undo/redo capabilities.

## Key features

- **Undo/Redo tracking** - Track and manage undo and redo state with canUndo and canRedo indicators
- **History slicing** - Group multiple transactions into a single undo step using startHistorySlice and endHistorySlice commands
- **State management** - Maintain history state with event counts for done and undone operations
- **Transaction monitoring** - Automatically track document changes and update history state based on ProseMirror transactions

## Install
---
- **Install** - *yarn add @atlaskit/editor-plugin-history*
- **npm** - [@atlaskit/editor-plugin-history](https://www.npmjs.com/package/@atlaskit/editor-plugin-history)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-history)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-history/dist/)

## Usage
---
**Internal use only**

@atlaskit/editor-plugin-history is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin history](https://atlaskit.atlassian.com/packages/editor/editor-plugin-history) for documentation and examples for this package.

## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
