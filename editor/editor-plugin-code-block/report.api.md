<!-- API Report Version: 2.3 -->

## API Report File for "@atlaskit/editor-plugin-code-block"

> Do not edit this file. This report is auto-generated using
> [API Extractor](https://api-extractor.com/).
> [Learn more about API reports](https://hello.atlassian.net/wiki/spaces/UR/pages/1825484529/Package+API+Reports)

### Table of contents

- [Main Entry Types](#main-entry-types)
- [Peer Dependencies](#peer-dependencies)

### Main Entry Types

<!--SECTION START: Main Entry Types-->

```ts
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { Command } from '@atlaskit/editor-common/types';
import type { compositionPlugin } from '@atlaskit/editor-plugin-composition';
import type { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { EditorAppearance } from '@atlaskit/editor-common/types';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { LongPressSelectionPluginOptions } from '@atlaskit/editor-common/types';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { OptionalPlugin } from '@atlaskit/editor-common/types';

// @public (undocumented)
export interface CodeBlockOptions extends LongPressSelectionPluginOptions {
	// (undocumented)
	allowCompositionInputOverride?: boolean;
	// (undocumented)
	allowCopyToClipboard?: boolean;
	// (undocumented)
	appearance?: EditorAppearance | undefined;
}

// @public (undocumented)
export type CodeBlockPlugin = NextEditorPlugin<
	'codeBlock',
	{
		pluginConfiguration: CodeBlockOptions;
		dependencies: [
			typeof decorationsPlugin,
			typeof compositionPlugin,
			OptionalPlugin<typeof analyticsPlugin>,
		];
		actions: {
			insertCodeBlock: (inputMethod: INPUT_METHOD) => Command;
		};
	}
>;

// @public (undocumented)
export const codeBlockPlugin: CodeBlockPlugin;

// (No @packageDocumentation comment for this package)
```

<!--SECTION END: Main Entry Types-->

### Peer Dependencies

<!--SECTION START: Peer Dependencies-->

```json
{
	"react": "^16.8.0",
	"react-intl-next": "npm:react-intl@^5.18.1"
}
```

<!--SECTION END: Peer Dependencies-->
