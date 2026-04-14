# Editor Plugin Save-on-enter

Save-on-enter plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development.
External contributors will be able to use this component but will not be able to submit issues.

## Overview

The Save-on-enter plugin enables automatic saving of editor content when the Enter key is pressed under specific conditions. It integrates with the Atlassian Editor to provide a streamlined save experience with analytics tracking.

## Key features

- **Keyboard shortcut handling** - Triggers save action when Enter key is pressed in appropriate contexts
- **Smart context detection** - Only activates in valid save contexts (top-level paragraphs, non-empty tasks/decisions)
- **Analytics integration** - Tracks save events with detailed analytics payloads
- **Configurable callback** - Accepts a custom save handler to integrate with your save workflow

## Install
---
- **Install** - *yarn add @atlaskit/editor-plugin-save-on-enter*
- **npm** - [@atlaskit/editor-plugin-save-on-enter](https://www.npmjs.com/package/@atlaskit/editor-plugin-save-on-enter)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-save-on-enter)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-save-on-enter/dist/)

## Usage
---
**Internal use only**

@atlaskit/editor-plugin-save-on-enter is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin Save-on-enter](https://atlaskit.atlassian.com/packages/editor/editor-plugin-save-on-enter) for documentation and examples for this package.

## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
