import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';

import type { InsertNodeAPI } from '../types';

import { createInsertNodeAPI } from './api';

export type ContentInsertionPlugin = NextEditorPlugin<
	'contentInsertion',
	{
		actions: InsertNodeAPI;
		dependencies: [AnalyticsPlugin];
	}
>;

/**
 * Content insertion plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
export const contentInsertionPlugin: ContentInsertionPlugin = ({ api }) => {
	return {
		name: 'contentInsertion',

		actions: createInsertNodeAPI(api?.analytics?.actions),
	};
};
