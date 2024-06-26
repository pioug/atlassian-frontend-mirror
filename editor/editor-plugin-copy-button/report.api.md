<!-- API Report Version: 2.3 -->

## API Report File for "@atlaskit/editor-plugin-copy-button"

> Do not edit this file. This report is auto-generated using
> [API Extractor](https://api-extractor.com/).
> [Learn more about API reports](https://hello.atlassian.net/wiki/spaces/UR/pages/1825484529/Package+API+Reports)

### Table of contents

- [Main Entry Types](#main-entry-types)
- [Peer Dependencies](#peer-dependencies)

### Main Entry Types

<!--SECTION START: Main Entry Types-->

```ts
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { Command } from '@atlaskit/editor-common/types';
import { EditorState } from 'prosemirror-state';
import { FloatingToolbarItem } from '@atlaskit/editor-common/types';
import type { MarkType } from '@atlaskit/editor-prosemirror/model';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import { NodeType } from 'prosemirror-model';
import type { OptionalPlugin } from '@atlaskit/editor-common/types';

// @public (undocumented)
export type CopyButtonPlugin = NextEditorPlugin<
	'copyButton',
	{
		dependencies: [OptionalPlugin<AnalyticsPlugin>];
		actions: {
			processCopyButtonItems: typeof processCopyButtonItemsWithAnalytics;
		};
	}
>;

// @public (undocumented)
export const copyButtonPlugin: CopyButtonPlugin;

// @public (undocumented)
export type CopyButtonPluginState = {
	copied: boolean;
	markSelection?: {
		start: number;
		end: number;
		markType: MarkType;
	};
};

// @public (undocumented)
const processCopyButtonItemsWithAnalytics: (
	state: EditorState,
) => (
	items: FloatingToolbarItem<Command>[],
	hoverDecoration:
		| ((nodeType: NodeType | NodeType[], add: boolean, className?: string | undefined) => Command)
		| undefined,
) => FloatingToolbarItem<Command>[];

// (No @packageDocumentation comment for this package)
```

<!--SECTION END: Main Entry Types-->

### Peer Dependencies

<!--SECTION START: Peer Dependencies-->

```json
{
	"react": "^16.8.0"
}
```

<!--SECTION END: Peer Dependencies-->
