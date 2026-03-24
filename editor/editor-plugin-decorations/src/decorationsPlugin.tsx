import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { DecorationsPlugin, HoverDecorationProps } from './decorationsPluginType';
import { hoverDecorationCommand, removeDecorationCommand } from './pm-plugins/commands';
import decorationPlugin, {
	decorationStateKey,
	hoverDecoration,
	removeDecoration,
} from './pm-plugins/main';

/**
 * Decorations plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
export const decorationsPlugin: DecorationsPlugin = () => ({
	name: 'decorations',

	pmPlugins() {
		return [{ name: 'decorationPlugin', plugin: () => decorationPlugin() }];
	},

	actions: {
		hoverDecoration,
		removeDecoration,
	},

	getSharedState(editorState) {
		if (!editorState) {
			return { decoration: undefined };
		}
		return decorationStateKey.getState(editorState);
	},

	commands: {
		hoverDecoration: editorExperiment('platform_editor_block_menu', true)
			? ({ add, className }: HoverDecorationProps) => hoverDecorationCommand({ add, className })
			: undefined,
		removeDecoration: editorExperiment('platform_editor_block_menu', true)
			? () => removeDecorationCommand()
			: undefined,
	},
});
