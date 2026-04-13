# Editor Plugin Toolbar

Toolbar plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The Toolbar plugin provides a comprehensive toolbar interface for the Atlassian Editor. It manages both primary (top) and contextual (inline) toolbars, enabling flexible formatting control options. The plugin integrates with various editor plugins to provide contextual formatting capabilities and supports customizable toolbar layouts based on viewport size.

## Key features

- **Primary toolbar** - Always-visible toolbar mounted at the top of the editor
- **Inline text toolbar** - Optional floating toolbar that appears near selected text for quick formatting
- **Flexible toolbar modes** - Configure formatting toolbar placement with `always-inline`, `always-pinned`, or `controlled` modes
- **Component registration** - Register custom toolbar components dynamically
- **Responsive design** - Support for breakpoint presets to adapt toolbar layout to different viewport sizes
- **Selection tracking** - Track selected nodes and formatting state for contextual toolbar updates

## Install
---
- **Install** - *yarn add @atlaskit/editor-plugin-toolbar*
- **npm** - [@atlaskit/editor-plugin-toolbar](https://www.npmjs.com/package/@atlaskit/editor-plugin-toolbar)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-toolbar)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-toolbar/dist/)

## Usage
---
**Internal use only**

@atlaskit/editor-plugin-toolbar is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin toolbar](https://atlaskit.atlassian.com/packages/editor/editor-plugin-toolbar) for documentation and examples for this package.

## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.

## License
---
Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
