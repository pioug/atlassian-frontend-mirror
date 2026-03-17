# Editor Plugin Editor ViewMode Effects

Editor ViewMode Effects plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development. External contributors will be able to use this component but will not be able to submit issues.

## Overview

The Editor ViewMode Effects plugin manages state transitions and effects when the editor switches between edit and view modes. It handles transaction filtering, view mode steps, and inline comment integration with collaborative editing features.

## Key features

- **Transaction filtering** - Prevent document modifications when in view mode while allowing specific approved transactions
- **View mode steps** - Custom ProseMirror steps for view-only state changes that don't modify the document
- **Inline comment integration** - Apply and sync annotation marks with collaborative editing
- **Document replacement handling** - Manage selection and state updates during remote document replacements
- **Feature flag support** - Conditional logic for experimental features and transaction policies

## Install

- **Install** - *yarn add @atlaskit/editor-plugin-editor-viewmode-effects*
- **npm** - [@atlaskit/editor-plugin-editor-viewmode-effects](https://www.npmjs.com/package/@atlaskit/editor-plugin-editor-viewmode-effects)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-editor-viewmode-effects)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-editor-viewmode-effects/dist/)

## Usage

**Internal use only**

@atlaskit/editor-plugin-editor-viewmode-effects is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin editor viewmode effects](https://atlaskit.atlassian.com/packages/editor/editor-plugin-editor-viewmode-effects) for documentation and examples for this package.

## Support

For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.

## License

Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
