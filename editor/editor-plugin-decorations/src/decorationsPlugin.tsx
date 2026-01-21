import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

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
		hoverDecoration: expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)
			? ({ add, className }: HoverDecorationProps) => hoverDecorationCommand({ add, className })
			: undefined,
		removeDecoration: expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)
			? () => removeDecorationCommand()
			: undefined,
	},
});
