import { ruleMessages } from '@atlaskit/editor-common/messages/rule';
import type { PaletteTooltipMessages } from '@atlaskit/editor-common/ui-color';
import { textPaletteTooltipMessages } from '@atlaskit/editor-common/ui-color';
import { token } from '@atlaskit/tokens';

// from platform/packages/editor/editor-plugin-text-color/src/pm-plugins/utils/constants.t
const defaultTextColor = '#172B4D';

// The dividerPaletteTooltipMessages mirrors the textPaletteTooltipMessages and overrides the 'Default' text color with the 'Bold gray' tooltip message.
export const dividerPaletteTooltipMessages: PaletteTooltipMessages = {
	light: {
		...textPaletteTooltipMessages.light,
		[defaultTextColor]: ruleMessages.boldGrayDividerColor,
		[token('color.border').toUpperCase()]: ruleMessages.defaultDividerColor,
	},
	dark: {
		...textPaletteTooltipMessages.dark,
		[defaultTextColor]: ruleMessages.boldGrayDividerColor,
		[token('color.border').toUpperCase()]: ruleMessages.defaultDividerColor,
	},
};
