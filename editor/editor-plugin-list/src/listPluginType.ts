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

export type ListPlugin = NextEditorPlugin<
	'list',
	{
		dependencies: [OptionalPlugin<FeatureFlagsPlugin>, OptionalPlugin<AnalyticsPlugin>];
		actions: {
			isInsideListItem: IsInsideListItem;
			findRootParentListNode: FindRootParentListNode;
		};
		commands: {
			indentList: IndentList;
			outdentList: OutdentList;
			toggleOrderedList: ToggleOrderedList;
			toggleBulletList: ToggleBulletList;
		};
		sharedState: ListState | undefined;
	}
>;
