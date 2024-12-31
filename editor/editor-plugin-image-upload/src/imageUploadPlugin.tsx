import type { Command } from '@atlaskit/editor-common/types';

import type { ImageUploadPlugin } from './imageUploadPluginType';
import { insertActionForToolbar } from './pm-plugins/commands-toolbar';
// Ignored via go/ees005
// eslint-disable-next-line import/no-named-as-default
import inputRulePlugin from './pm-plugins/input-rule';
import { createPlugin } from './pm-plugins/main';
import { stateKey } from './pm-plugins/plugin-key';
import type { UploadHandlerReference } from './types';

/**
 * Image upload plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
export const imageUploadPlugin: ImageUploadPlugin = () => {
	const uploadHandlerReference: UploadHandlerReference = {
		current: null,
	};

	return {
		name: 'imageUpload',

		getSharedState(editorState) {
			if (!editorState) {
				return undefined;
			}

			return stateKey.getState(editorState);
		},

		actions: {
			startUpload: (): Command => insertActionForToolbar(uploadHandlerReference),
		},

		pmPlugins() {
			return [
				{
					name: 'imageUpload',
					plugin: createPlugin(uploadHandlerReference),
				},
				{
					name: 'imageUploadInputRule',
					plugin: ({ schema, featureFlags }) => inputRulePlugin(schema, featureFlags),
				},
			];
		},
	};
};
