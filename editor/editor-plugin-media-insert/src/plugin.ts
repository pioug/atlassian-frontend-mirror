import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

export type MediaInsertPlugin = NextEditorPlugin<'mediaInsert', {}>;

export const mediaInsertPlugin: MediaInsertPlugin = () => {
	return {
		name: 'mediaInsert',

		pmPlugins: () => [
			{
				name: 'mediaInsert',
				plugin: () => {
					return undefined;
				},
			},
		],
	};
};
