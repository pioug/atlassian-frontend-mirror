# Editor Plugin Limited Mode

LimitedMode plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The Limited Mode plugin provides performance optimization for the Atlassian Editor by monitoring document size and automatically enabling limited mode when documents exceed configurable thresholds. This helps maintain editor performance with large documents by disabling certain resource-intensive features.

## Key features

- **Document size monitoring** - Tracks document size and node count to detect when thresholds are breached
- **Automatic threshold detection** - Activates limited mode based on document size, node count, or presence of legacy content macros
- **Configurable thresholds** - Supports experimentation-based threshold configuration via Statsig
- **Node anchor integration** - Integrates with the node anchor system to disable anchor tracking in limited mode
- **Shared state** - Exposes enabled state through plugin API for other plugins to react to limited mode changes

## Install
---
- **Install** - *yarn add @atlaskit/editor-plugin-limited-mode*
- **npm** - [@atlaskit/editor-plugin-limited-mode](https://www.npmjs.com/package/@atlaskit/editor-plugin-limited-mode)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-limited-mode)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-limited-mode/dist/)

## Usage
---
**Internal use only**

@atlaskit/editor-plugin-limited-mode is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin limited mode](https://atlaskit.atlassian.com/packages/editor/editor-plugin-limited-mode) for documentation and examples for this package.

## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
