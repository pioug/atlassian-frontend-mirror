# Editor Plugin Interaction

Interaction plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The Interaction plugin tracks user interactions with the Atlassian Editor. It monitors mouse clicks, keyboard input, drag-and-drop operations, and focus events to detect whether a user has interacted with the editor, providing state management for interaction detection across editor operations.

## Key features

- **Interaction tracking** - Detect and track user interactions including clicks, keyboard input, drag-and-drop, and focus events
- **Interaction state management** - Maintain state indicating whether the editor has received any user interaction
- **Event handling** - Handle multiple DOM event types through integrated ProseMirror plugins
- **Command support** - Expose `handleInteraction` command for programmatic interaction state updates

## Install
---
- **Install** - *yarn add @atlaskit/editor-plugin-interaction*
- **npm** - [@atlaskit/editor-plugin-interaction](https://www.npmjs.com/package/@atlaskit/editor-plugin-interaction)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-interaction)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-interaction/dist/)

## Usage
---
**Internal use only**

@atlaskit/editor-plugin-interaction is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin interaction](https://atlaskit.atlassian.com/packages/editor/editor-plugin-interaction) for documentation and examples for this package.

## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.