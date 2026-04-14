# Editor Plugin Paste Options Toolbar

Paste options toolbar for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development. External contributors will
be able to use this component but will not be able to submit issues.

## Overview

The Paste Options Toolbar plugin provides a floating toolbar that appears after content is pasted into the editor. It allows users to select how the pasted content should be formatted, including options for rich text, markdown, and plain text formatting. The toolbar intelligently hides itself in certain contexts, such as when pasting into nested nodes or code blocks.

## Key features

- **Formatting options** - Choose between rich text, markdown, and plain text paste formats
- **Smart toolbar visibility** - Toolbar intelligently appears only when appropriate (e.g., not in code blocks or nested nodes)
- **Content detection** - Detects paste content type and pre-selects the appropriate formatting option
- **Markdown support** - Converts pasted content to markdown format with proper formatting preservation
- **Analytics integration** - Tracks user interactions with paste formatting options
- **Legacy and new menu modes** - Supports both floating toolbar and new paste actions menu UI variants

## Install
- **Install** - *yarn add @atlaskit/editor-plugin-paste-options-toolbar*
- **npm** - [@atlaskit/editor-plugin-paste-options-toolbar](https://www.npmjs.com/package/@atlaskit/editor-plugin-paste-options-toolbar)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/src/master/platform/packages/editor/editor-plugin-paste-options-toolbar)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-paste-options-toolbar/dist/)

## Usage
**Internal use only**

@atlaskit/editor-plugin-paste-options-toolbar is intended for internal use by the @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see [Atlaskit - Editor plugin paste options toolbar](https://atlaskit.atlassian.com/packages/editor/editor-plugin-paste-options-toolbar) for documentation and examples for this package.

## Support
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.

## License
Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
