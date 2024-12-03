import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';

import type { InsertNodeAPI } from './types';

export type ContentInsertionPlugin = NextEditorPlugin<
	'contentInsertion',
	{
		dependencies: [AnalyticsPlugin];
	} & InsertNodeAPI
>;
