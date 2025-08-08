import React from 'react';

import { useIntl } from 'react-intl-next';

import { cssMap } from '@atlaskit/css';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { textColorMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ColorPalette, textPaletteTooltipMessages } from '@atlaskit/editor-common/ui-color';
import { hexToEditorTextPaletteColor } from '@atlaskit/editor-palette';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';
import { Stack, Box, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import type { TextColorPlugin } from '../textColorPluginType';

const styles = cssMap({
	container: {
		gap: token('space.100'),
	},
	colorPalette: {
		marginLeft: token('space.negative.100'),
	},
});

export function TextColorMenuItem({
	api,
}: {
	api: ExtractInjectionAPI<TextColorPlugin> | undefined;
}) {
	const { color, defaultColor, palette } = useSharedPluginStateWithSelector(
		api,
		['textColor'],
		(states) => ({
			color: states.textColorState?.color,
			defaultColor: states.textColorState?.defaultColor || null,
			palette: states.textColorState?.palette || [],
		}),
	);
	const { formatMessage } = useIntl();

	return (
		<ToolbarDropdownItemSection>
			<Stack xcss={styles.container} testId="text-color-menu-item">
				<Text weight="bold">{formatMessage(messages.textColorTooltip)}</Text>
				<Box xcss={styles.colorPalette}>
					<ColorPalette
						onClick={() => {}}
						selectedColor={color || defaultColor}
						paletteOptions={{
							palette: palette,
							hexToPaletteColor: hexToEditorTextPaletteColor,
							paletteColorTooltipMessages: textPaletteTooltipMessages,
						}}
					/>
				</Box>
			</Stack>
		</ToolbarDropdownItemSection>
	);
}
