# Editor Plugin Block Menu

Block Menu plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The Block Menu plugin provides a context menu for block-level transformations and operations in the Atlassian Editor. It enables users to quickly transform content blocks (paragraphs, lists, headings, etc.) into different node types and perform block-level actions like moving, copying, and deleting content through an interactive menu interface.

## Key features

- **Block transformation** - Transform content blocks between different node types (paragraphs, lists, headings, blockquotes, code blocks, etc.)
- **Customizable menu** - Register custom menu items, sections, and nested menus through a flexible component registry
- **Block actions** - Move blocks up/down, delete, copy links to specific blocks with deep linking support
- **Intelligent transformations** - Handle complex transformations with proper handling of nested content, lists, and mixed content types
- **Analytics integration** - Built-in event tracking for menu interactions and block transformations
- **Performance monitoring** - Measure and track transformation performance metrics
- **Keyboard and mouse support** - Open menu via drag handle, keyboard shortcut, or custom triggers

## Install

- **Install** - *yarn add @atlaskit/editor-plugin-block-menu*
- **npm** - [@atlaskit/editor-plugin-block-menu](https://www.npmjs.com/package/@atlaskit/editor-plugin-block-menu)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-block-menu)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-block-menu/dist/)

## Usage

**Internal use only**

@atlaskit/editor-plugin-block-menu is intended for internal use by @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin block menu](https://atlaskit.atlassian.com/packages/editor/editor-plugin-block-menu) for documentation and examples for this package.

## Support

For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.

## License

Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
