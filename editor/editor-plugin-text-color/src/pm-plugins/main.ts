import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { PluginToolbarComponentConfig } from '@atlaskit/editor-common/toolbar';
import type { PaletteColor } from '@atlaskit/editor-common/ui-color';
import { textColorPalette } from '@atlaskit/editor-common/ui-color';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { token } from '@atlaskit/tokens';

import { getActiveColor } from './utils/color';
import { DEFAULT_COLOR } from './utils/constants';
import { getDisabledState } from './utils/disabled';

export type TextColorPluginState = {
	color: string | null;
	defaultColor: string;
	disabled?: boolean;
	isPaletteOpen?: boolean;
	palette: Array<PaletteColor>;
};

type TextColorDefaultColor = {
	color: string;
	label: string;
};

export interface TextColorPluginConfig {
	defaultColor?: TextColorDefaultColor;
	/**
	 * Optional configuration to control this plugin's toolbar components.
	 * @default { enabled: true }
	 * @example
	 * To hide toolbar component, set `enabled` to `false`.
	 * ```ts
	 * toolbarConfig: {
	 *   enabled: false,
	 * },
	 * ```
	 */
	toolbarConfig?: Exclude<PluginToolbarComponentConfig, 'showAt'>;
}

function createInitialPluginState(
	editorState: EditorState,
	pluginConfig?: TextColorPluginConfig,
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
		isPaletteOpen: false,
	};

	return state;
}

export enum ACTIONS {
	RESET_COLOR,
	SET_COLOR,
	DISABLE,
	SET_PALETTE,
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
						nextState = {
							...pluginState,
							color: meta.color,
							disabled: false,
							isPaletteOpen: false,
						};
						break;

					case ACTIONS.DISABLE:
						nextState = { ...pluginState, disabled: true };
						break;

					case ACTIONS.SET_PALETTE:
						nextState = { ...pluginState, isPaletteOpen: meta.isPaletteOpen };
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
					(pluginState && pluginState.disabled !== nextState.disabled) ||
					(pluginState && pluginState.isPaletteOpen !== nextState.isPaletteOpen)
				) {
					dispatch(pluginKey, nextState);
					return nextState;
				}

				return pluginState;
			},
		},
	});
}
