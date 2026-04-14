# Editor Plugin Scroll Into View

Scroll-into-view plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The Scroll Into View plugin automatically scrolls the user's selection into view whenever the document is updated through user actions such as inserting, deleting, or formatting content. This ensures that the cursor and relevant content remain visible to the user during editing operations.

## Key features

- **Automatic scroll handling** - Scroll selection into view on document changes
- **Smart filtering** - Ignores collaborative changes, appended transactions, and undo/redo operations
- **Configurable behavior** - Can be disabled per transaction using metadata
- **Input rule awareness** - Skips scrolling for input rule transactions to avoid unwanted behavior

## Install
---
- **Install** - *yarn add @atlaskit/editor-plugin-scroll-into-view*
- **npm** - [@atlaskit/editor-plugin-scroll-into-view](https://www.npmjs.com/package/@atlaskit/editor-plugin-scroll-into-view)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-scroll-into-view)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-scroll-into-view/dist/)

## Usage
---
**Internal use only**

@atlaskit/editor-plugin-scroll-into-view is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin scroll-into-view](https://atlaskit.atlassian.com/packages/editor/editor-plugin-scroll-into-view) for documentation and examples for this package.

## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#Platform-License) for more licensing information.
