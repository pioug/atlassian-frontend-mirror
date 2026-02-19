# Editor Plugin Base

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

Base plugin for @atlaskit/editor-core that provides core editor functionality and utilities. This plugin establishes foundational features including node definitions, editor state management, keyboard interactions, and performance tracking.

## Key features

- **Core node definitions** - Provides essential document, paragraph, and text nodes
- **ProseMirror plugins** - Includes undo/redo history, frozen editor detection, keyboard height tracking, and spell-checking enabled/disabled management
- **Mark management** - Register and resolve text marks with custom callbacks
- **Keyboard support** - Mobile keyboard height tracking and navigation enhancements
- **Scroll gutter** - Scroll container management for improved scrolling behavior
- **Editor decorations** - Lazy node view decorations and inline cursor targeting
- **Performance tracking** - Input latency monitoring and freeze detection (deprecated)

## Install

- **Install** - `yarn add @atlaskit/editor-plugin-base`
- **npm** - [@atlaskit/editor-plugin-base](https://www.npmjs.com/package/@atlaskit/editor-plugin-base)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-base)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-base/dist/)

## Usage

**Internal use only**

@atlaskit/editor-plugin-base is intended for internal use by @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin base](https://atlaskit.atlassian.com/packages/editor/editor-plugin-base) for documentation and examples for this package.

## Support

For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.

## License

Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
