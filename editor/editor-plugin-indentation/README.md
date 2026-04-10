# Editor Plugin Indentation

Indentation plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The Indentation plugin provides text indentation capabilities for paragraphs and headings in the Atlassian Editor. It allows users to increase or decrease indentation levels using keyboard shortcuts or toolbar actions, with built-in analytics tracking for indentation changes.

## Key features

- **Indent and outdent commands** - Increase or decrease indentation levels for paragraphs and headings
- **Keyboard shortcuts** - Support for Tab/Shift+Tab shortcuts and backspace outdenting at cursor start
- **Maximum indentation control** - Enforces a maximum indentation level to maintain readability
- **Analytics integration** - Track indentation actions with detailed analytics events
- **Mark-based implementation** - Uses ProseMirror marks for efficient indentation state management
- **Alignment compatibility** - Prevents indentation on nodes with alignment marks to avoid conflicts

## Install
---
- **Install** - *yarn add @atlaskit/editor-plugin-indentation*
- **npm** - [@atlaskit/editor-plugin-indentation](https://www.npmjs.com/package/@atlaskit/editor-plugin-indentation)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-indentation)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-indentation/dist/)

## Usage
---
**Internal use only**

@atlaskit/editor-plugin-indentation is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin indentation](https://atlaskit.atlassian.com/packages/editor/editor-plugin-indentation) for documentation and examples for this package.

## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.