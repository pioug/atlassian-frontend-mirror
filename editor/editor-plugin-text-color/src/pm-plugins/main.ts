import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { PluginToolbarComponentConfig } from '@atlaskit/editor-common/toolbar';
import type { PaletteColor } from '@atlaskit/editor-common/ui-color';
import {
	getTextColorInNonActiveTheme,
	textColorPalette,
	textColorPaletteNew,
} from '@atlaskit/editor-common/ui-color';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { token } from '@atlaskit/tokens';

import { getActiveColor, isMultiTextColorSelection } from './utils/color';
import { DEFAULT_COLOR } from './utils/constants';
import { getDisabledState } from './utils/disabled';

export type TextColorPluginState = {
	color: string | null;
	colorInNonActiveTheme?: string;
	defaultColor: string;
	disabled?: boolean;
	/**
	 * True when the current selection spans more than one text color. Only
	 * populated behind the lovability text/bg color patch gate + experiment.
	 */
	isMultiTextColor?: boolean;
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
	const paletteColors = expValEqualsNoExposure(
		'platform_editor_lovability_text_bg_color',
		'isEnabled',
		true,
	)
		? textColorPaletteNew
		: textColorPalette;

	const palette: Array<PaletteColor> = [
		{
			value: defaultColor.color,
			label: defaultColor.label,
			border: token('color.border'),
		},
		...paletteColors,
	];

	const color = getActiveColor(editorState);
	const state = {
		color,
		disabled: getDisabledState(editorState),
		palette,
		defaultColor: defaultColor.color,
		isPaletteOpen: false,
		// eslint-disable-next-line @atlaskit/platform/no-preconditioning
		...(fg('platform_editor_lovability_text_bg_color_patch_1') &&
			expValEqualsNoExposure('platform_editor_lovability_text_bg_color', 'isEnabled', true) && {
				colorInNonActiveTheme: getTextColorInNonActiveTheme(color, defaultColor.color),
				isMultiTextColor: isMultiTextColorSelection(editorState),
			}),
	};

	return state;
}

export enum ACTIONS {
	RESET_COLOR,
	SET_COLOR,
	DISABLE,
	SET_PALETTE,
}

export const pluginKey: PluginKey<TextColorPluginState> = new PluginKey<TextColorPluginState>(
	'textColorPlugin',
);

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
						nextState = {
							...pluginState,
							color: pluginState.defaultColor,
							// eslint-disable-next-line @atlaskit/platform/no-preconditioning
							...(fg('platform_editor_lovability_text_bg_color_patch_1') &&
								expValEqualsNoExposure(
									'platform_editor_lovability_text_bg_color',
									'isEnabled',
									true,
								) && {
									colorInNonActiveTheme: getTextColorInNonActiveTheme(
										pluginState.defaultColor,
										pluginState.defaultColor,
									),
									isMultiTextColor: false,
								}),
						};
						break;

					case ACTIONS.SET_COLOR:
						nextState = {
							...pluginState,
							color: meta.color,
							disabled: false,
							isPaletteOpen: false,
							// eslint-disable-next-line @atlaskit/platform/no-preconditioning
							...(fg('platform_editor_lovability_text_bg_color_patch_1') &&
								expValEqualsNoExposure(
									'platform_editor_lovability_text_bg_color',
									'isEnabled',
									true,
								) && {
									colorInNonActiveTheme: getTextColorInNonActiveTheme(
										meta.color,
										pluginState.defaultColor,
									),
									isMultiTextColor: false,
								}),
						};
						break;

					case ACTIONS.DISABLE:
						nextState = {
							...pluginState,
							disabled: true,
						};
						break;

					case ACTIONS.SET_PALETTE:
						nextState = {
							...pluginState,
							isPaletteOpen: meta.isPaletteOpen,
						};
						break;

					default:
						const color = getActiveColor(newState);
						nextState = {
							...pluginState,
							color,
							disabled: getDisabledState(newState),
							// eslint-disable-next-line @atlaskit/platform/no-preconditioning
							...(color !== pluginState.color &&
								fg('platform_editor_lovability_text_bg_color_patch_1') &&
								expValEqualsNoExposure(
									'platform_editor_lovability_text_bg_color',
									'isEnabled',
									true,
								) && {
									colorInNonActiveTheme: getTextColorInNonActiveTheme(
										color,
										pluginState.defaultColor,
									),
									isMultiTextColor: isMultiTextColorSelection(newState),
								}),
						};
				}

				if (
					(pluginState && pluginState.color !== nextState.color) ||
					(pluginState && pluginState.colorInNonActiveTheme !== nextState.colorInNonActiveTheme) ||
					(pluginState && pluginState.disabled !== nextState.disabled) ||
					(pluginState && pluginState.isMultiTextColor !== nextState.isMultiTextColor) ||
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
