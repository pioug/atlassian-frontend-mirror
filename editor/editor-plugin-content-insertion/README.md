# Editor Plugin Content Insertion

Content insertion plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The Content Insertion plugin provides capabilities to programmatically insert content (nodes and fragments) into the editor at specified positions. It integrates with ProseMirror to handle content insertion with support for custom selection placement, analytics tracking, and flexible insertion options.

## Key features

- **Flexible content insertion** - Insert ProseMirror nodes or fragments at custom positions within the document
- **Selection control** - Optionally select newly inserted nodes or override insertion position
- **Analytics integration** - Attach analytics payloads to insertion operations
- **Command and action APIs** - Expose both command and action interfaces for content insertion
- **Transaction support** - Seamlessly integrates with ProseMirror transactions

## Install

- **Install** - *yarn add @atlaskit/editor-plugin-content-insertion*
- **npm** - [@atlaskit/editor-plugin-content-insertion](https://www.npmjs.com/package/@atlaskit/editor-plugin-content-insertion)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-content-insertion)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-content-insertion/dist/)

## Usage

**Internal use only**

@atlaskit/editor-plugin-content-insertion is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin content insertion](https://atlaskit.atlassian.com/packages/editor/editor-plugin-content-insertion) for documentation and examples for this package.

## Support

For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.

## License

Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.