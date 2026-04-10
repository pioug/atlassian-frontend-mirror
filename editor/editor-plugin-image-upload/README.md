# Editor Plugin Image Upload

Image upload plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The Image Upload plugin provides image upload capabilities for the Atlassian Editor. It integrates with `@atlaskit/editor-core` to handle image insertion through multiple input methods and manages the upload workflow.

## Key features

- **Drag-and-drop upload** - Drag images directly into the editor
- **Clipboard paste** - Paste images from clipboard with intelligent MS Office screenshot detection
- **Markdown image syntax** - Convert markdown image syntax `![alt](url)` to media nodes
- **Upload handler integration** - Configurable upload handlers for custom image processing
- **Plugin state management** - Track upload state with enabled, active, and hidden states

## Install
---
- **Install** - *yarn add @atlaskit/editor-plugin-image-upload*
- **npm** - [@atlaskit/editor-plugin-image-upload](https://www.npmjs.com/package/@atlaskit/editor-plugin-image-upload)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-image-upload)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-image-upload/dist/)

## Usage
---
**Internal use only**

@atlaskit/editor-plugin-image-upload is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin image upload](https://atlaskit.atlassian.com/packages/editor/editor-plugin-image-upload) for documentation and examples for this package.

## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.

## License
---
Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.