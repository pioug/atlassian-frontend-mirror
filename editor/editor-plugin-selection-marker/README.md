# Editor Plugin Selection Marker

Selection marker plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The Selection Marker plugin provides visual decorations to highlight text selections in the editor when the editor is not focused. It manages the display of selection markers (blur effect) based on various editor states such as focus, type-ahead menu visibility, toolbar state, and other conditions.

## Key features

- **Visual selection markers** - Displays blur-effect decorations to indicate text selections when editor is not focused
- **Smart visibility control** - Automatically hides markers during focus, type-ahead, disabled state, toolbar visibility, and block menu interactions
- **Configurable initialization** - Option to hide cursor on editor initialization
- **Decoration hiding API** - Provides actions to programmatically hide and release selection markers
- **State management** - Exposes shared state for marker visibility and active status

## Install
- **Install** - *yarn add @atlaskit/editor-plugin-selection-marker*
- **npm** - [@atlaskit/editor-plugin-selection-marker](https://www.npmjs.com/package/@atlaskit/editor-plugin-selection-marker)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-selection-marker)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-selection-marker/dist/)

## Usage
**Internal use only**

@atlaskit/editor-plugin-selection-marker is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin selection marker](https://atlaskit.atlassian.com/packages/editor/editor-plugin-selection-marker) for documentation and examples for this package.

## Support
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.

## License
Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
