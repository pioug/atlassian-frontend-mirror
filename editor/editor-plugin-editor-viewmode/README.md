# Editor Plugin Editor Viewmode

View Mode plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The Editor Viewmode plugin enables switching between edit and view modes in the Atlassian Editor. It provides state management and commands for controlling the editor's editability based on the current mode, integrating seamlessly with `@atlaskit/editor-core` via the `ComposableEditor` and `EditorPresetBuilder`.

## Key features

- **Mode management** - Switch between edit and view modes
- **State tracking** - Maintain and access current editor mode state via shared state
- **Command integration** - Update view mode through editor commands
- **ProseMirror integration** - Seamless integration with ProseMirror plugin system
- **Configuration options** - Set initial mode on plugin initialization

## Install
---
- **Install** - *yarn add @atlaskit/editor-plugin-editor-viewmode*
- **npm** - [@atlaskit/editor-plugin-editor-viewmode](https://www.npmjs.com/package/@atlaskit/editor-plugin-editor-viewmode)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-editor-viewmode)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-editor-viewmode/dist/)

## Usage
---
**Internal use only**

@atlaskit/editor-plugin-editor-viewmode is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor ViewMode Plugin](https://atlaskit.atlassian.com/packages/editor/editor-plugin-editor-viewmode) for documentation and examples for this package.

## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.

## License
---
Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
