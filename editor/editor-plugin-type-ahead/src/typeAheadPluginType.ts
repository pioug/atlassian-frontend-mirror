import type { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import type {
	Command,
	NextEditorPlugin,
	OptionalPlugin,
	TypeAheadHandler,
	TypeAheadItem,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { ConnectivityPlugin } from '@atlaskit/editor-plugin-connectivity';
import type { ContextPanelPlugin } from '@atlaskit/editor-plugin-context-panel';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

import {
	type TypeAheadInputMethod,
	type TypeAheadPluginOptions,
	type TypeAheadPluginSharedState,
} from './types';

type InsertTypeAheadItemProps = {
	triggerHandler: TypeAheadHandler;
	contentItem: TypeAheadItem;
	query: string;
	sourceListItem: TypeAheadItem[];
	mode?: SelectItemMode;
};

type OpenTypeAheadProps = {
	triggerHandler: TypeAheadHandler;
	inputMethod: TypeAheadInputMethod;
	query?: string;
};

type CloseTypeAheadProps = {
	insertCurrentQueryAsRawText: boolean;
	attachCommand?: Command;
};

/**
 * Type ahead plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
export type TypeAheadPlugin = NextEditorPlugin<
	'typeAhead',
	{
		pluginConfiguration: TypeAheadPluginOptions | undefined;
		dependencies: [
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<FeatureFlagsPlugin>,
			OptionalPlugin<ConnectivityPlugin>,
			OptionalPlugin<ContextPanelPlugin>,
		];
		sharedState: TypeAheadPluginSharedState;
		actions: {
			isOpen: (editorState: EditorState) => boolean;
			isAllowed: (editorState: EditorState) => boolean;
			insert: (props: InsertTypeAheadItemProps) => boolean;
			findHandlerByTrigger: (trigger: string) => TypeAheadHandler | null;
			open: (props: OpenTypeAheadProps) => boolean;
			close: (props: CloseTypeAheadProps) => boolean;
			openAtTransaction: (props: OpenTypeAheadProps) => (tr: Transaction) => boolean;
		};
	}
>;
