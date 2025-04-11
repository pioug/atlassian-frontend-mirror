import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { PaletteColor } from '@atlaskit/editor-common/ui-color';
import { textColorPalette } from '@atlaskit/editor-common/ui-color';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { token } from '@atlaskit/tokens';

import { getActiveColor } from './utils/color';
import { DEFAULT_COLOR } from './utils/constants';
import { getDisabledState } from './utils/disabled';

export type TextColorPluginState = {
	palette: Array<PaletteColor>;
	defaultColor: string;
	disabled?: boolean;
	color: string | null;
};

type TextColorDefaultColor = {
	color: string;
	label: string;
};

export interface TextColorPluginOptions {
	defaultColor?: TextColorDefaultColor;
}

/**
 * @private
 * @deprecated Use {@link TextColorPluginOptions} instead.
 * @see https://product-fabric.atlassian.net/browse/ED-27496
 */
export type TextColorPluginConfig = TextColorPluginOptions;

function createInitialPluginState(
	editorState: EditorState,
	pluginConfig?: TextColorPluginOptions,
): TextColorPluginState {
	const defaultColor = pluginConfig?.defaultColor || DEFAULT_COLOR;

	const palette: Array<PaletteColor> = [
		{
			value: defaultColor.color,
			label: defaultColor.label,
			border: token('color.border', '#091E4224'),
		},
		...textColorPalette,
	];

	const state = {
		color: getActiveColor(editorState),
		disabled: getDisabledState(editorState),
		palette,
		defaultColor: defaultColor.color,
	};

	return state;
}

export enum ACTIONS {
	RESET_COLOR,
	SET_COLOR,
	DISABLE,
}

export const pluginKey = new PluginKey<TextColorPluginState>('textColorPlugin');

export function createPlugin(dispatch: Dispatch, pluginConfig?: TextColorPluginConfig): SafePlugin {
	return new SafePlugin({
		key: pluginKey,
		state: {
			init(_config, editorState) {
				return createInitialPluginState(editorState, pluginConfig);
			},
			apply(tr, pluginState, _, newState) {
				const meta = tr.getMeta(pluginKey) || {};

				let nextState;
				switch (meta.action) {
					case ACTIONS.RESET_COLOR:
						nextState = { ...pluginState, color: pluginState.defaultColor };
						break;

					case ACTIONS.SET_COLOR:
						nextState = { ...pluginState, color: meta.color, disabled: false };
						break;

					case ACTIONS.DISABLE:
						nextState = { ...pluginState, disabled: true };
						break;

					default:
						nextState = {
							...pluginState,
							color: getActiveColor(newState),
							disabled: getDisabledState(newState),
						};
				}

				if (
					(pluginState && pluginState.color !== nextState.color) ||
					(pluginState && pluginState.disabled !== nextState.disabled)
				) {
					dispatch(pluginKey, nextState);
					return nextState;
				}

				return pluginState;
			},
		},
	});
}
