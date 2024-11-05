import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import type {
	Command,
	QuickInsertSharedState as CommonQuickInsertSharedState,
	EditorCommand,
	NextEditorPlugin,
	QuickInsertHandler,
	QuickInsertPluginOptions,
	QuickInsertSearchOptions,
	TypeAheadHandler,
} from '@atlaskit/editor-common/types';
import type { TypeAheadInputMethod, TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';

export type QuickInsertSharedState = CommonQuickInsertSharedState & {
	typeAheadHandler: TypeAheadHandler;
};

export type QuickInsertPlugin = NextEditorPlugin<
	'quickInsert',
	{
		pluginConfiguration: QuickInsertPluginOptions | undefined;
		dependencies: [TypeAheadPlugin];
		sharedState: QuickInsertSharedState | null;
		actions: {
			openTypeAhead: (inputMethod: TypeAheadInputMethod) => boolean;
			insertItem: (
				item: QuickInsertItem,
				source?: INPUT_METHOD.QUICK_INSERT | INPUT_METHOD.TOOLBAR,
			) => Command;
			getSuggestions: (searchOptions: QuickInsertSearchOptions) => QuickInsertItem[];
		};
		commands: {
			openElementBrowserModal: EditorCommand;
			addQuickInsertItem: (item: QuickInsertHandler) => EditorCommand;
		};
	}
>;
