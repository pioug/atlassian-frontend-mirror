# Editor Plugin Tasks and Decisions

Tasks and decisions plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The Tasks and Decisions plugin provides comprehensive functionality for creating and managing task lists and decision lists within the Atlassian Editor. It integrates seamlessly with the editor's toolbar, block menu, and type-ahead features to enable users to create, edit, and track tasks and decisions inline with their content.

## Key features

- **Task and decision lists** - Create and manage task lists and decision lists with full editing capabilities
- **Nested tasks** - Support for nested task structures with configurable indentation levels
- **Block task items** - Support for block-level task items that can contain extension nodes (useful for content migrations)
- **Edit permissions** - Control edit permissions and request-to-edit functionality for tasks
- **Provider integration** - Extensible provider-based architecture for custom task decision handling
- **Toolbar integration** - Quick access to task and decision creation through the editor toolbar
- **Block menu support** - Transform content into tasks and decisions through the block menu
- **Type-ahead support** - Quick insert support for creating tasks and decisions

## Install
---
- **Install** - *yarn add @atlaskit/editor-plugin-tasks-and-decisions*
- **npm** - [@atlaskit/editor-plugin-tasks-and-decisions](https://www.npmjs.com/package/@atlaskit/editor-plugin-tasks-and-decisions)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-tasks-and-decisions)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-tasks-and-decisions/dist/)

## Usage
---
**Internal use only**

@atlaskit/editor-plugin-tasks-and-decisions is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin tasks and decisions](https://atlaskit.atlassian.com/packages/editor/editor-plugin-tasks-and-decisions) for documentation and examples for this package.

## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.