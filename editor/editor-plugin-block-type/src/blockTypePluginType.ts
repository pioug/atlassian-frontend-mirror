import type {
	Command,
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';

import type { TextBlockTypes } from './pm-plugins/block-types';
import type { InputMethod } from './pm-plugins/commands/block-type';
import type { BlockTypeState } from './pm-plugins/main';
import type { BlockTypePluginOptions } from './pm-plugins/types';

export type BlockTypePlugin = NextEditorPlugin<
	'blockType',
	{
		pluginConfiguration: BlockTypePluginOptions | undefined;
		dependencies: [OptionalPlugin<AnalyticsPlugin>, OptionalPlugin<PrimaryToolbarPlugin>];
		sharedState: BlockTypeState | undefined;
		actions: {
			insertBlockQuote: (inputMethod: InputMethod) => Command;
		};
		commands: {
			setTextLevel: (
				level: TextBlockTypes,
				inputMethod: InputMethod,
				fromBlockQuote?: boolean,
			) => EditorCommand;
			insertBlockQuote: (inputMethod: InputMethod) => EditorCommand;
		};
	}
>;
