# @atlaskit/editor-slack-transformer

## 3.0.0

### Major Changes

- [`8f0577e0eb1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f0577e0eb1) - [ux] Promoted captions to full schema and better support of wikimarkup, email and slack renderer

### Minor Changes

- [`b230f366971`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b230f366971) - [ED-14008] Bump prosemirror-view from 1.20.2 to 1.23.1

### Patch Changes

- [`c6feed82071`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c6feed82071) - ED-11632: Bump prosemirror packages;

  - prosmirror-commands 1.1.4 -> 1.1.11,
  - prosemirror-model 1.11.0 -> 1.14.3,
  - prosemirror-state 1.3.3 -> 1.3.4,
  - prosemirror-transform 1.2.8 -> 1.3.2,
  - prosemirror-view 1.15.4 + 1.18.8 -> 1.20.2.

## 2.0.0

### Major Changes

- [`ad7872a08ed`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ad7872a08ed) - Add media inline component to wikimarkup, slack markdown, email renderer transformers

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
