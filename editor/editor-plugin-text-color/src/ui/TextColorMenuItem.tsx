import React, { useCallback } from 'react';

import { useIntl } from 'react-intl-next';

import { cssMap } from '@atlaskit/css';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { textColorMessages as messages } from '@atlaskit/editor-common/messages';
import { getInputMethodFromParentKeys, useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { textPaletteTooltipMessages } from '@atlaskit/editor-common/ui-color';
import { hexToEditorTextPaletteColor } from '@atlaskit/editor-palette';
import { ColorPalette, useToolbarDropdownMenu } from '@atlaskit/editor-toolbar';
import type { ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model';
import Heading from '@atlaskit/heading';
import { Stack, Text } from '@atlaskit/primitives/compiled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

import type { TextColorPlugin } from '../textColorPluginType';

const styles = cssMap({
	container: {
		gap: token('space.075'),
	},
});

interface TextColorMenuItemProps {
	api: ExtractInjectionAPI<TextColorPlugin> | undefined;
	parents: ToolbarComponentTypes;
}

export function TextColorMenuItem({ api, parents }: TextColorMenuItemProps) {
	const { color, defaultColor, palette } = useSharedPluginStateWithSelector(
		api,
		['textColor'],
		(states) => ({
			color: states.textColorState?.color,
			defaultColor: states.textColorState?.defaultColor || null,
			palette: states.textColorState?.palette || [],
		}),
	);
	const { editorView } = useEditorToolbar();
	// Warning! Do not destructure editorView, it will become stale
	const { state, dispatch } = editorView ?? { state: null, dispatch: null };
	const context = useToolbarDropdownMenu();
	const closeMenu = context?.closeMenu;

	const handleTextColorChange = useCallback(
		(color: string) => {
			if (expValEquals('platform_editor_toolbar_aifc_fix_editor_view', 'isEnabled', true)) {
				if (!editorView?.state || !editorView?.dispatch) {
					return;
				}
				if (api?.textColor?.actions?.changeColor) {
					api.textColor.actions.changeColor(color, getInputMethodFromParentKeys(parents))(
						editorView.state,
						editorView.dispatch,
					);

					closeMenu?.();
				}
			} else {
				if (!state || !dispatch) {
					return;
				}
				if (api?.textColor?.actions?.changeColor) {
					api.textColor.actions.changeColor(color, getInputMethodFromParentKeys(parents))(
						state,
						dispatch,
					);

					closeMenu?.();
				}
			}
		},
		[
			editorView?.state,
			editorView?.dispatch,
			api?.textColor.actions,
			parents,
			closeMenu,
			state,
			dispatch,
		],
	);

	const { formatMessage } = useIntl();

	return (
		<Stack xcss={styles.container} testId="text-color-menu-item">
			{expValEquals('platform_editor_toolbar_aifc_patch_2', 'isEnabled', true) ? (
				<Heading size="xxsmall">{formatMessage(messages.textColorTooltip)}</Heading>
			) : (
				<Text weight="bold">{formatMessage(messages.textColorTooltip)}</Text>
			)}

			<ColorPalette
				onClick={(color) => {
					handleTextColorChange(color);
				}}
				selectedColor={color || defaultColor}
				paletteOptions={{
					palette: palette,
					hexToPaletteColor: hexToEditorTextPaletteColor,
					paletteColorTooltipMessages: textPaletteTooltipMessages,
				}}
			/>
		</Stack>
	);
}
