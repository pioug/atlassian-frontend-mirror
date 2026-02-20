# Editor Plugin Highlight

Highlight plugin for @atlaskit/editor-core

## Overview

The Highlight plugin provides text highlighting capabilities for the Atlassian Editor. It allows users to highlight text with a customizable color palette, integrated with the editor's toolbar and keyboard shortcuts. The plugin manages highlight state, tracks analytics events, and supports both primary and selection toolbars.

## Key features

- **Color palette selection** - Choose from a predefined palette of highlight colors
- **Highlight removal** - Remove highlight from selected text
- **Toolbar integration** - Access highlighting through primary and selection toolbars
- **Keyboard shortcuts** - Quick keyboard access for toggling the palette and applying yellow highlight
- **State management** - Tracks active highlight color and palette visibility
- **Analytics tracking** - Records highlight actions for usage metrics
- **Visual enhancements** - Padding decorations for improved visual representation

## Install
---
- **Install** - *yarn add @atlaskit/editor-plugin-highlight*
- **npm** - [@atlaskit/editor-plugin-highlight](https://www.npmjs.com/package/@atlaskit/editor-plugin-highlight)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-highlight)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-highlight/dist/)

## Usage
---

```typescript
import { highlightPlugin } from '@atlaskit/editor-plugin-highlight';
```

The highlight plugin is intended for use as a plugin dependency within the Editor. It provides the `changeColor` command to programmatically change or remove highlight colors.

Please see [Atlaskit - Editor plugin highlight](https://atlaskit.atlassian.com/packages/editor/editor-plugin-highlight) for documentation and examples for this package.

## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.

## License
---
Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
