import type { ContentInsertionPlugin } from './contentInsertionPluginType';
import { createInsertNodeAPI } from './pm-plugins/api';

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
