# Editor Plugin Paste

Paste plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The Paste plugin handles all paste operations in the Atlassian Editor. It intelligently processes clipboard content from various sources and transforms it into the appropriate editor content, supporting rich text, plain text, code blocks, media, links, and special formatting from applications like Microsoft Word, Excel, and VS Code.

## Key features

- **Rich content handling** - Process and transform HTML, markdown, and plain text from clipboard
- **Smart content detection** - Automatically detect and handle paste from Word, Excel, VS Code, and other sources
- **Media support** - Handle pasted images and files with proper media node creation
- **Link intelligence** - Convert pasted URLs to smart cards or inline links based on context
- **Content transformation** - Transform pasted content to match editor schema (lists, tables, code blocks, etc.)
- **Macro auto-conversion** - Automatically convert pasted macro links to proper extensions
- **Paste warnings** - Display contextual warnings for paste operations when needed
- **Analytics tracking** - Track paste events and sources for performance monitoring

## Install
---
- **Install** - *yarn add @atlaskit/editor-plugin-paste*
- **npm** - [@atlaskit/editor-plugin-paste](https://www.npmjs.com/package/@atlaskit/editor-plugin-paste)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-paste)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-paste/dist/)

## Usage
---
**Internal use only**

@atlaskit/editor-plugin-paste is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin paste](https://atlaskit.atlassian.com/packages/editor/editor-plugin-paste) for documentation and examples for this package.

## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
