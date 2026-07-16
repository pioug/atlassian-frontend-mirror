import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { getHighlightColorInNonActiveTheme } from '@atlaskit/editor-common/ui-color';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import {
	getActiveColor,
	isMultiHighlightColorSelection,
	MULTIPLE_HIGHLIGHT_COLORS_SELECTED,
} from '../editor-commands/color';
import { getDisabledState } from '../editor-commands/disabled';
import type { HighlightPlugin } from '../highlightPluginType';

export const highlightPluginKey: PluginKey<HighlightPluginState> =
	new PluginKey<HighlightPluginState>('highlight');

export type HighlightPluginState = {
	activeColor: string | null; // Hex value color, lowercase
	activeColorInNonActiveTheme?: string;
	disabled: boolean;
	/**
	 * True when the current selection spans more than one highlight color. Only
	 * populated behind the lovability text/bg color patch gate + experiment.
	 */
	isMultiHighlightColor?: boolean;
	isPaletteOpen: boolean;
};

export enum HighlightPluginAction {
	CHANGE_COLOR,
	SET_PALETTE,
}

const DEFAULT_BACKGROUND_COLOR = '#FFFFFF';

const getActiveColorInNonActiveTheme = (color: string | null): string =>
	getHighlightColorInNonActiveTheme(color, {
		defaultBackgroundColor: DEFAULT_BACKGROUND_COLOR,
	});

const getColorAccessibilityState = (
	activeColor: string | null,
	tr: ReadonlyTransaction,
): Pick<HighlightPluginState, 'activeColorInNonActiveTheme' | 'isMultiHighlightColor'> => {
	const isMultiHighlightColor =
		activeColor === MULTIPLE_HIGHLIGHT_COLORS_SELECTED || isMultiHighlightColorSelection(tr);

	return {
		// When the selection spans multiple highlight colors, `activeColor` is the
		// `MULTIPLE_HIGHLIGHT_COLORS_SELECTED` sentinel rather than a real hex value.
		// Passing it through would resolve the literal sentinel as a color, so fall
		// back to the neutral default instead.
		activeColorInNonActiveTheme: getActiveColorInNonActiveTheme(
			isMultiHighlightColor ? null : activeColor,
		),
		isMultiHighlightColor,
	};
};

export const createPlugin = ({
	api,
}: {
	api: ExtractInjectionAPI<HighlightPlugin> | undefined;
}): SafePlugin<HighlightPluginState> => {
	return new SafePlugin({
		key: highlightPluginKey,
		state: {
			init: (_: unknown, editorState: EditorState): HighlightPluginState => ({
				activeColor: null,
				disabled: getDisabledState(editorState),
				isPaletteOpen: false,
				// eslint-disable-next-line @atlaskit/platform/no-preconditioning
				...(fg('platform_editor_lovability_text_bg_color_patch_1') &&
					expValEqualsNoExposure('platform_editor_lovability_text_bg_color', 'isEnabled', true) && {
						activeColorInNonActiveTheme: getActiveColorInNonActiveTheme(null),
						isMultiHighlightColor: isMultiHighlightColorSelection(editorState),
					}),
			}),
			apply: (
				tr: ReadonlyTransaction,
				pluginState: HighlightPluginState,
				_oldState: EditorState,
				newState: EditorState,
			): HighlightPluginState => {
				const action = tr.getMeta(highlightPluginKey)?.type;

				switch (action) {
					case HighlightPluginAction.CHANGE_COLOR:
						const { color } = tr.getMeta(highlightPluginKey);

						return {
							...pluginState,
							activeColor: color,
							// eslint-disable-next-line @atlaskit/platform/no-preconditioning
							...(fg('platform_editor_lovability_text_bg_color_patch_1') &&
								expValEqualsNoExposure(
									'platform_editor_lovability_text_bg_color',
									'isEnabled',
									true,
								) && {
									activeColorInNonActiveTheme: getActiveColorInNonActiveTheme(color),
									isMultiHighlightColor: false,
								}),
						};

					case HighlightPluginAction.SET_PALETTE:
						const { isPaletteOpen } = tr.getMeta(highlightPluginKey);

						return {
							...pluginState,
							isPaletteOpen,
						};

					default:
						const activeColor = getActiveColor(tr);
						const colorAccessibilityState =
							// eslint-disable-next-line @atlaskit/platform/no-preconditioning
							fg('platform_editor_lovability_text_bg_color_patch_1') &&
							expValEqualsNoExposure(
								'platform_editor_lovability_text_bg_color',
								'isEnabled',
								true,
							) &&
							(activeColor !== pluginState.activeColor ||
								tr.selectionSet ||
								(!tr.selection.empty && tr.docChanged))
								? getColorAccessibilityState(activeColor, tr)
								: {};

						return {
							...pluginState,
							activeColor,
							disabled: getDisabledState(newState),
							...colorAccessibilityState,
						};
				}
			},
		},
	});
};
