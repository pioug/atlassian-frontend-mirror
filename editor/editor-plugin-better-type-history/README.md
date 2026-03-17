# Editor Plugin Better Type History

Better Type History plugin for @atlaskit/editor-core

## Overview

The Better Type History plugin improves undo behavior for custom editor applications by intelligently handling text operations. It optimizes the undo history for paste events, block splitting, and new line insertion, ensuring a better user experience when undoing changes in these specific scenarios.

## Key features

- **Paste event handling** - Automatically flags and closes history for paste operations to improve undo behavior
- **Block splitting detection** - Detects when Enter key splits block nodes and optimizes history accordingly
- **Newline handling** - Intelligently manages history for newline character insertions
- **Transaction metadata** - Uses ProseMirror transaction metadata to track and manage paste events
- **Undo optimization** - Closes history at appropriate points to create better undo snapshots

## Install

- **Install** - `yarn add @atlaskit/editor-plugin-better-type-history`
- **npm** - [@atlaskit/editor-plugin-better-type-history](https://www.npmjs.com/package/@atlaskit/editor-plugin-better-type-history)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-better-type-history)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-better-type-history/dist/)

## Usage

The Better Type History plugin is intended for internal use by @atlaskit/editor-core and as a plugin dependency of the Editor within your product.

```typescript
import { betterTypeHistoryPlugin } from '@atlaskit/editor-plugin-better-type-history';
```

Use the `flagPasteEvent` action to mark paste events in transactions:

```typescript
const api = editorAPI.betterTypeHistory;
api.flagPasteEvent(transaction);
```

Detailed docs and example usage can be found [here](https://atlaskit.atlassian.com/packages/editor/editor-plugin-better-type-history).

## Support

For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.

## License

Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
