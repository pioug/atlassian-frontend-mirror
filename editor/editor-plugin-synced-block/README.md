# Editor Plugin Synced Block

Synced Block plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The Synced Block plugin enables content synchronization across multiple locations within the Atlassian Editor. It provides functionality for creating, managing, and rendering synced block nodes that automatically update across all references. This plugin supports both simple reference blocks and bodied synced blocks with full editing capabilities.

## Key features

- **Synced block creation and management** - Create and manage synced blocks with automatic reference tracking
- **Bodied sync blocks** - Support for editable synced blocks with full content capabilities
- **Reference synchronization** - Automatically synchronize content changes across all block references
- **Floating toolbar integration** - Contextual toolbar for synced block operations (delete, unsync, view locations)
- **Quick insert support** - Easy insertion of synced blocks through quick insert menu
- **Block menu integration** - Block menu support for creating and managing synced blocks
- **Offline handling** - Graceful handling of offline scenarios with appropriate user notifications
- **Analytics integration** - Built-in analytics event tracking for synced block operations
- **Copy to clipboard** - Copy synced block references for sharing across documents

## Install
---
- **Install** - *yarn add @atlaskit/editor-plugin-synced-block*
- **npm** - [@atlaskit/editor-plugin-synced-block](https://www.npmjs.com/package/@atlaskit/editor-plugin-synced-block)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-synced-block)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-synced-block/dist/)

## Usage
---
**Internal use only**

@atlaskit/editor-plugin-synced-block is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin synced block](https://atlaskit.atlassian.com/packages/editor/editor-plugin-synced-block) for documentation and examples for this package.

## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.

## License
---
Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.