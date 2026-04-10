# Editor Plugin Max Content Size

Max content size plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The Max Content Size plugin enforces content size limits within the Atlassian Editor. It tracks when the editor content exceeds a configured maximum size threshold and prevents further edits that would exceed this limit, ensuring controlled content growth.

## Key features

- **Size enforcement** - Enforce maximum content size limits on editor documents
- **State tracking** - Track whether the content size limit has been reached
- **Transaction filtering** - Prevent transactions that would exceed the size limit
- **Flexible configuration** - Configure the maximum content size in characters

## Install
---
- **Install** - *yarn add @atlaskit/editor-plugin-max-content-size*
- **npm** - [@atlaskit/editor-plugin-max-content-size](https://www.npmjs.com/package/@atlaskit/editor-plugin-max-content-size)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-max-content-size)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-max-content-size/dist/)

## Usage
---
**Internal use only**

@atlaskit/editor-plugin-max-content-size is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin max-content-size](https://atlaskit.atlassian.com/packages/editor/editor-plugin-max-content-size) for documentation and examples for this package.

## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.

## License
---
Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
