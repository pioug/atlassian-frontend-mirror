# @atlaskit/editor-plugin-toolbar-lists-indentation

## 0.2.0

### Minor Changes

- [#43661](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43661) [`ebf781502ed`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ebf781502ed) - Extract toolbar-lists-indentation plugin code from editor-core and move into @atlaskit/editor-plugin-toolbar-lists-indentation.

## 0.1.1

### Patch Changes

- [#43646](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43646) [`d43f8e9402f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d43f8e9402f) - Make feature flags plugin optional in all plugins including:

  - analytics
  - base
  - card
  - code-block
  - expand
  - extension
  - floating-toolbar
  - hyperlink
  - insert-block
  - layout
  - layout
  - list
  - media
  - paste
  - rule
  - table
  - tasks-and-decisions

  We already treat it as optional in the plugins, so this is just ensuring that the plugin is not mandatory to be added to the preset.
