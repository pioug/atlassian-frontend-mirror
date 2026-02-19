# Editor Plugin Code Block Advanced

## Overview

This package provides an advanced code block plugin for `@atlaskit/editor-core` that extends the basic code block functionality with a CodeMirror editor integration. It enables rich editing features for code blocks within Atlassian editors.

## Key features

- **CodeMirror integration**: Uses CodeMirror 6 for advanced code editing capabilities within the editor
- **Syntax highlighting**: Supports syntax highlighting for multiple programming languages
- **Extensible language support**: Includes support for various languages such as JavaScript, Python, Java, GraphQL, Elixir, Handlebars, ActionScript, and more
- **Code folding**: Optional code folding functionality via the `allowCodeFolding` configuration option
- **Custom extensions**: Ability to inject custom CodeMirror extensions through configuration
- **Advanced editing features**: Includes features like autocomplete, bracket closing, line separation, and keyboard shortcuts

## Install
---
- **Install** - *yarn add @atlaskit/editor-plugin-code-block-advanced*
- **npm** - [@atlaskit/editor-plugin-code-block-advanced](https://www.npmjs.com/package/@atlaskit/editor-plugin-code-block-advanced)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-code-block-advanced)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-code-block-advanced/dist/)

## Usage

---
**Internal use only**

`@atlaskit/editor-plugin-code-block-advanced` is intended for internal use by the `@atlaskit/editor-core` and as a plugin dependency of the Editor within your product.

Direct use of this component is not supported. Please see [Atlaskit - Editor plugin code block advanced](https://atlaskit.atlassian.com/packages/editor/editor-plugin-code-block-advanced) for documentation and examples for this package.

### Configuration options

- `allowCodeFolding` (optional, boolean): Enable code folding in code blocks. Defaults to `false`.
- `extensions` (optional, Extension[]): Array of custom CodeMirror extensions to inject into the code editor.

### Dependencies

This plugin requires the following peer dependencies:

- `@atlaskit/editor-common`
- `react` (^18.2.0)
- `react-intl-next`

It also depends on the `@atlaskit/editor-plugin-code-block` plugin.

## Support

For Atlassian internal users, visit the Slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.

## License

Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
