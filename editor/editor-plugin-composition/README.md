# Editor Plugin Composition

Composition plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The Composition plugin handles IME (Input Method Editor) composition events for the Atlassian Editor. It tracks the composition state during text input operations, particularly for languages that use complex character input methods such as Chinese, Japanese, and Korean. On Linux systems, it manages zero-width space insertion to ensure proper text composition handling.

## Key features

- **Composition event tracking** - Track IME composition start and end events
- **Linux-specific handling** - Insert and manage zero-width spaces on Linux systems during composition
- **State management** - Maintain composition state accessible through shared state
- **Event delegation** - Handle DOM composition events at the editor level

## Install
---
- **Install** - *yarn add @atlaskit/editor-plugin-composition*
- **npm** - [@atlaskit/editor-plugin-composition](https://www.npmjs.com/package/@atlaskit/editor-plugin-composition)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-composition)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-composition/dist/)

## Usage
---
**Internal use only**

@atlaskit/editor-plugin-composition is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin composition](https://atlaskit.atlassian.com/packages/editor/editor-plugin-composition) for documentation and examples for this package.

## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.

## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.