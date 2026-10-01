import { ruleMessages } from '@atlaskit/editor-common/messages/rule';
import type { PaletteColor } from '@atlaskit/editor-common/ui-color';
import { textColorPaletteNew } from '@atlaskit/editor-common/ui-color';
import { token } from '@atlaskit/tokens';

/**
 * The dividerColorPalette mirrors the textColorPalette, with the following minor changes –
 */
export const dividerColorPalette: Array<PaletteColor> = [
	// 1. the textColorPalette does not have the "bold gray" color. it is added separately
	// in `platform/packages/editor/editor-plugin-text-color/src/pm-plugins/utils/constants.ts`
	// by editor-plugin-text-color so we need to do the same for the dividerColorPalette
	{
		border: token('color.border'),
		label: ruleMessages.boldGrayDividerColor.defaultMessage,
		message: ruleMessages.boldGrayDividerColor,
		value: '#172B4D',
	},
	// 2. the dividerColorPalette replaces textColorPalette's white with the divider's default color.
	...textColorPaletteNew.map((swatch) =>
		swatch.value.toUpperCase() === '#FFFFFF'
			? {
					...swatch,
					label: ruleMessages.defaultDividerColor.defaultMessage,
					message: undefined,
					value: token('color.border'),
				}
			: swatch,
	),
];
