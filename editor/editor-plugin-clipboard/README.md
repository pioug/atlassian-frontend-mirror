# Editor Plugin Clipboard

Clipboard plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The Clipboard plugin provides comprehensive clipboard handling for the Atlassian Editor. It manages copy and cut operations, providing custom serialization for clipboard content and analytics tracking for clipboard events.

## Key features

- **Custom clipboard serialization** - Overrides ProseMirror's default serialization to handle special cases like table rows and media nodes
- **Table row copy/paste** - Preserves table attributes (like layout) when copying table rows
- **Media annotation handling** - Strips annotations from media nodes during copy operations
- **Analytics integration** - Tracks copy and cut events with detailed analytics payloads
- **Event handling** - Manages DOM clipboard events (cut and copy) within the editor

## Install
---
- **Install** - *yarn add @atlaskit/editor-plugin-clipboard*
- **npm** - [@atlaskit/editor-plugin-clipboard](https://www.npmjs.com/package/@atlaskit/editor-plugin-clipboard)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-clipboard)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-clipboard/dist/)

## Usage
---
**Internal use only**

@atlaskit/editor-plugin-clipboard is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin clipboard](https://atlaskit.atlassian.com/packages/editor/editor-plugin-clipboard) for documentation and examples for this package.

## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
