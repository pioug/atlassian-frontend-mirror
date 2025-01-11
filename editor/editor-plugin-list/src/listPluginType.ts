import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';

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
];

export type ListPluginActions = {
	isInsideListItem: IsInsideListItem;
	findRootParentListNode: FindRootParentListNode;
};

export type ListPluginCommands = {
	indentList: IndentList;
	outdentList: OutdentList;
	toggleOrderedList: ToggleOrderedList;
	toggleBulletList: ToggleBulletList;
};

export type ListPluginSharedState = ListState | undefined;

export type ListPlugin = NextEditorPlugin<
	'list',
	{
		dependencies: ListPluginDependencies;
		actions: ListPluginActions;
		commands: ListPluginCommands;
		sharedState: ListPluginSharedState;
	}
>;
