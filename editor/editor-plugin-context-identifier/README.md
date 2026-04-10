# Editor Plugin Context Identifier

Context identifier plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The Context Identifier plugin provides functionality to manage and track context identifiers within the Atlassian Editor. It enables configuration of context identifier providers to support multi-product contexts (Jira, Confluence, etc.) and handles the state management of context information during editor operations.

## Key features

- **Context provider management** - Configure and manage context identifier providers
- **Multi-product support** - Support for different Atlassian products (Jira, Confluence)
- **State management** - Maintain context identifier state through ProseMirror plugin
- **Dynamic configuration** - Update context identifier provider at runtime through commands
- **Plugin integration** - Seamlessly integrates with @atlaskit/editor-core plugin system

## Install

- **Install** - *yarn add @atlaskit/editor-plugin-context-identifier*
- **npm** - [@atlaskit/editor-plugin-context-identifier](https://www.npmjs.com/package/@atlaskit/editor-plugin-context-identifier)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-context-identifier)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-context-identifier/dist/)

## Usage

**Internal use only**

@atlaskit/editor-plugin-context-identifier is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin context identifier](https://atlaskit.atlassian.com/packages/editor/editor-plugin-context-identifier) for documentation and examples for this package.

## Support

For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.

## License

Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.