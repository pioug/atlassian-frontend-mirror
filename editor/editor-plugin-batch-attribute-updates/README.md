# Editor Plugin Batch Attribute Updates

Batch attribute updates plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The Batch Attribute Updates plugin provides a runtime tool to merge an array of `SetAttrsStep` and/or `AttrStep` instances into a single `BatchAttrsStep`. This optimization reduces the number of ProseMirror steps that need to be processed when multiple attribute updates are applied to the same or different positions in the document.

## Key features

- **Step batching** - Merges multiple attribute steps into a single `BatchAttrsStep` for improved performance
- **Attribute grouping** - Groups attributes by position and aggregates changes automatically
- **Type validation** - Validates that only attribute-related steps (`SetAttrsStep` or `AttrStep`) are batched
- **Error handling** - Throws errors for invalid step usage to prevent data loss

## Install
---
- **Install** - *yarn add @atlaskit/editor-plugin-batch-attribute-updates*
- **npm** - [@atlaskit/editor-plugin-batch-attribute-updates](https://www.npmjs.com/package/@atlaskit/editor-plugin-batch-attribute-updates)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-batch-attribute-updates)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-batch-attribute-updates/dist/)

## Usage
---
**Internal use only**

@atlaskit/editor-plugin-batch-attribute-updates is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin batch attribute updates](https://atlaskit.atlassian.com/packages/editor/editor-plugin-batch-attribute-updates) for documentation and examples for this package.

## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
