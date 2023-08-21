# @atlaskit/editor-slack-transformer

## 3.2.7

### Patch Changes

- [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete version.json

## 3.2.6

### Patch Changes

- Updated dependencies

## 3.2.5

### Patch Changes

- [`4e6f1bf8511`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e6f1bf8511) - [ED-19233] Import prosemirror libraries from internal facade package

## 3.2.4

### Patch Changes

- [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing unused dependencies and dev dependencies

## 3.2.3

### Patch Changes

- [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 3.2.2

### Patch Changes

- [`a142ba1aa28`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a142ba1aa28) - [ED17172] Bump prosemirror-model to 1.16.0 and prosemirror-view to 1.23.7 and removed work-arounds for fixed issues

## 3.2.1

### Patch Changes

- [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 3.2.0

### Minor Changes

- [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

## 3.1.7

### Patch Changes

- [`0ffb55018c9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ffb55018c9) - Revert "[ED-17172] Bumped prosemirror-view from 1.23.2 to 1.23.7 and removed work-around for fixed issues"

## 3.1.6

### Patch Changes

- [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY remove before merging to master; dupe adf-schema via adf-utils

## 3.1.5

### Patch Changes

- [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 3.1.4

### Patch Changes

- [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 3.1.3

### Patch Changes

- [`4db684dafa6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4db684dafa6) - ED-13895 update editor slack transformer to emotion

## 3.1.2

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4

## 3.1.1

### Patch Changes

- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - ED-13025 Bump prosemirror-view 1.23.1 -> 1.23.2

## 3.1.0

### Minor Changes

- [`95c8a998ef1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/95c8a998ef1) - Inline cards with url type attributes are sent as links. Adding a new row after embedded card

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
