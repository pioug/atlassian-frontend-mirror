# Editor Plugin UFO

UFO plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The UFO (User-Facing Operations) plugin provides performance monitoring and interaction tracking capabilities for the Atlassian Editor. It integrates with `@atlaskit/react-ufo` to abort UFO measurements when user interactions occur, ensuring accurate performance metrics by preventing false measurements from ongoing interactions.

## Key features

- **Interaction tracking** - Monitors first user interaction with the editor to abort ongoing UFO measurements
- **SSR compatibility** - Automatically disabled in server-side rendering environments
- **Event-based abort** - Aborts UFO measurements on various user interaction events (wheel, keydown, mousedown, pointerdown, pointerup, touchend, scroll, mouseover)
- **Selection change detection** - Aborts active 'edit-page' and 'live-edit' UFO interactions when editor selection changes

## Install
---
- **Install** - *yarn add @atlaskit/editor-plugin-ufo*
- **npm** - [@atlaskit/editor-plugin-ufo](https://www.npmjs.com/package/@atlaskit/editor-plugin-ufo)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-ufo)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-ufo/dist/)

## Usage
---
**Internal use only**

@atlaskit/editor-plugin-ufo is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin ufo](https://atlaskit.atlassian.com/packages/editor/editor-plugin-ufo) for documentation and examples for this package.

## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
