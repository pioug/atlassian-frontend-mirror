import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { BlockMenuPlugin } from '@atlaskit/editor-plugin-block-menu/blockMenuPluginType';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags/featureFlagsPluginType';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar/toolbar-plugin-type';
import type { UiControlRegistryPlugin } from '@atlaskit/editor-plugin-ui-control-registry/ui-control-registry-plugin-type';

import type {
	FindRootParentListNode,
	IndentList,
	IsInsideListItem,
	ListState,
	OutdentList,
	ToggleBulletList,
	ToggleOrderedList,
} from './types';

export type ListPluginDependencies = [
	OptionalPlugin<FeatureFlagsPlugin>,
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<BlockMenuPlugin>,
	OptionalPlugin<ToolbarPlugin>,
	OptionalPlugin<UiControlRegistryPlugin>,
];

export type ListPluginActions = {
	findRootParentListNode: FindRootParentListNode;
	isInsideListItem: IsInsideListItem;
};

export type ListPluginCommands = {
	indentList: IndentList;
	outdentList: OutdentList;
	toggleBulletList: ToggleBulletList;
	toggleOrderedList: ToggleOrderedList;
};

export type ListPluginSharedState = ListState | undefined;

export type ListPlugin = NextEditorPlugin<
	'list',
	{
		actions: ListPluginActions;
		commands: ListPluginCommands;
		dependencies: ListPluginDependencies;
		sharedState: ListPluginSharedState;
	}
>;
