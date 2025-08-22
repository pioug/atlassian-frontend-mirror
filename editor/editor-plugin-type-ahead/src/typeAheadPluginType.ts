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
import type { MetricsPlugin } from '@atlaskit/editor-plugin-metrics';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

import {
	type TypeAheadPluginOptions,
	type TypeAheadPluginSharedState,
	type OpenTypeAheadProps,
} from './types';

type InsertTypeAheadItemProps = {
	contentItem: TypeAheadItem;
	mode?: SelectItemMode;
	query: string;
	sourceListItem: TypeAheadItem[];
	triggerHandler: TypeAheadHandler;
};

type CloseTypeAheadProps = {
	attachCommand?: Command;
	insertCurrentQueryAsRawText: boolean;
};

/**
 * Type ahead plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
export type TypeAheadPlugin = NextEditorPlugin<
	'typeAhead',
	{
		actions: {
			close: (props: CloseTypeAheadProps) => boolean;
			findHandlerByTrigger: (trigger: string) => TypeAheadHandler | null;
			insert: (props: InsertTypeAheadItemProps) => boolean;
			isAllowed: (editorState: EditorState) => boolean;
			isOpen: (editorState: EditorState) => boolean;
			open: (props: OpenTypeAheadProps) => boolean;
			openAtTransaction: (props: OpenTypeAheadProps) => (tr: Transaction) => boolean;
		};
		dependencies: [
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<FeatureFlagsPlugin>,
			OptionalPlugin<ConnectivityPlugin>,
			OptionalPlugin<ContextPanelPlugin>,
			OptionalPlugin<MetricsPlugin>,
		];
		pluginConfiguration: TypeAheadPluginOptions | undefined;
		sharedState: TypeAheadPluginSharedState;
	}
>;
