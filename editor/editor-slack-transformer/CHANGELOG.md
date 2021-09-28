# @atlaskit/editor-slack-transformer

## 1.0.6

### Patch Changes

- [`4855cb64aab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4855cb64aab) - Fixed typo in the embedded node name

## 1.0.5

### Patch Changes

- [`5eb1f5c3eb6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5eb1f5c3eb6) - Moved @atlaskit/editor-common to devDependencies. Extracted Transformer interface from it.

## 1.0.4

### Patch Changes

- Updated dependencies

## 1.0.3

### Patch Changes

- [`b7d23a07930`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b7d23a07930) - Added/updated unsupported nodes/marks stubs. Added support for decisions, layouts, status, panel.
  Emojis return text (an emoji itself) instead of a short name.

## 1.0.2

### Patch Changes

- [`a17337cd389`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a17337cd389) - Added stubs for unsupported nodes in Slack markdown such as table, panel, inline card, task, decision as ["node type" attached]

## 1.0.1

### Patch Changes

- [`93a63117404`](https://bitbucket.org/atlassian/atlassian-frontend/commits/93a63117404) - Replaced a [media attached] link (when some file is attached) just with a text [media attached].
  Added a rule node (serialized to an empty line) and a text color mark (serialized to a pure text). Slack doesn’t have syntax for it.
  Added a missed description in package.json. Removed unused devDependencies.

## 1.0.0

### Major Changes

- [`944b9d04d22`](https://bitbucket.org/atlassian/atlassian-frontend/commits/944b9d04d22) - [ux] TI-210 Implemented a converter to support ADF to Slack markdown transformation.
  Supported bold, italic and strikethrough text, links, quotes, inline code blocks, code blocks, emojis. Mentions are serialised as @id.
  There’s no specific list syntax in app-published text, but we can mimic list (bullet, numbered) formatting. Also there’s no specific syntax for headers, images/files (will be converted to [image attached] or [media attached] as a link).
