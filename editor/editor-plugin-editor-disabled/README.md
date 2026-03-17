# Editor Plugin Editor Disabled

Editor disabled plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The Editor Disabled plugin manages the enabled and disabled state of the Atlassian Editor. It provides functionality to track whether the editor is editable and allows plugins to control editor editability through a centralized state management system. This plugin integrates with `@atlaskit/editor-core` to handle editor state synchronization and expose shared state for components that need to respond to editor enabled/disabled changes.

## Key features

- **State tracking** - Track editor enabled/disabled state and share it with other components
- **Plugin-controlled editability** - Allow plugins to disable the editor programmatically
- **Shared state management** - Expose editor state through `useSharedPluginState` for components like panels and floating toolbars
- **Configuration options** - Set initial disabled state on plugin initialization
- **Command support** - Toggle editor disabled state via the `toggleDisabled` command

## Install

- **Install** - *yarn add @atlaskit/editor-plugin-editor-disabled*
- **npm** - [@atlaskit/editor-plugin-editor-disabled](https://www.npmjs.com/package/@atlaskit/editor-plugin-editor-disabled)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-editor-disabled)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-editor-disabled/dist/)

## Usage

**Internal use only**

@atlaskit/editor-plugin-editor-disabled is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin editor disabled](https://atlaskit.atlassian.com/packages/editor/editor-plugin-editor-disabled) for documentation and examples for this package.

## Support

For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.

## License

Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.