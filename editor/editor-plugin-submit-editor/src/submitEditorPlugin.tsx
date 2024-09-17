import { createPlugin } from './pm-plugins/main';
import { type SubmitEditorPlugin } from './submitEditorPluginType';

export const submitEditorPlugin: SubmitEditorPlugin = ({ config: onSave, api }) => ({
	name: 'submitEditor',

	pmPlugins() {
		return [
			{
				name: 'submitEditor',
				plugin: ({ dispatch }) => createPlugin(dispatch, api, onSave),
			},
		];
	},
});
