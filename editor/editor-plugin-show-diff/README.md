# Editor Plugin Show Diff

Show Diff plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The Show Diff plugin provides visual diff visualization capabilities for the Atlassian Editor. It highlights changes made to document content by displaying additions, deletions, and modifications with configurable color schemes. The plugin integrates with ProseMirror to calculate and render diff decorations based on document steps.

## Key features

- **Visual diff highlighting** - Display changes as inline, block, and widget decorations
- **Multiple color schemes** - Support for 'standard' (purple) and 'traditional' (green/red) highlighting
- **Change navigation** - Scroll through and navigate between different changes in the document
- **Flexible configuration** - Configurable color schemes and diff parameters
- **ProseMirror integration** - Works seamlessly with ProseMirror steps and transactions

## Install
---
- **Install** - *yarn add @atlaskit/editor-plugin-show-diff*
- **npm** - [@atlaskit/editor-plugin-show-diff](https://www.npmjs.com/package/@atlaskit/editor-plugin-show-diff)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-show-diff)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-show-diff/dist/)

## Usage
---
**Internal use only**

@atlaskit/editor-plugin-show-diff is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin show diff](https://atlaskit.atlassian.com/packages/editor/editor-plugin-show-diff) for documentation and examples for this package.

## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.

## License
---
Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
