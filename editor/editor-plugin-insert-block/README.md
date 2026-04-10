# Editor Plugin Insert Block

Insert block plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The Insert Block plugin provides a comprehensive toolbar interface for inserting various content types and block elements into the Atlassian Editor. It manages the insert menu, toolbar buttons, and element browser, enabling users to add rich content such as tables, media, code blocks, emojis, mentions, and other block-level elements.

## Key features

- **Toolbar insert buttons** - Provides individual toolbar buttons for quickly inserting common content types (tables, media, emojis, mentions, etc.)
- **Insert menu dropdown** - Offers a comprehensive dropdown menu with all available insert options organized by category
- **Element browser** - Displays a searchable, categorized browser for discovering and inserting elements
- **Responsive toolbar** - Automatically adjusts the number of visible buttons based on available toolbar space
- **Configurable buttons** - Allows customization of which insert buttons are visible in the toolbar
- **Block type insertion** - Supports inserting block types like code blocks, panels, and block quotes
- **Media integration** - Integrates with media plugin to enable image and media uploads
- **Offline mode support** - Adapts UI based on connectivity status
- **Performance optimized** - Lazy loads element browser for improved initial rendering performance

## Install
---
- **Install** - *yarn add @atlaskit/editor-plugin-insert-block*
- **npm** - [@atlaskit/editor-plugin-insert-block](https://www.npmjs.com/package/@atlaskit/editor-plugin-insert-block)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-insert-block)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-insert-block/dist/)

## Usage
---
**Internal use only**

@atlaskit/editor-plugin-insert-block is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin insert block](https://atlaskit.atlassian.com/packages/editor/editor-plugin-insert-block) for documentation and examples for this package.

## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.