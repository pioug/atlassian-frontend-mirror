import { ToolbarSize } from '@atlaskit/editor-common/types';

import { IconTypes } from './types';

export const ToolbarButtonsStrongItalic: IconTypes[] = [IconTypes.strong, IconTypes.em];

export const ToolbarButtonsStrong: IconTypes[] = [IconTypes.strong];

export const ToolbarButtonsStrongItalicUnderline: IconTypes[] = [
	IconTypes.strong,
	IconTypes.em,
	IconTypes.underline,
];

export const ButtonsMenuSpacious: IconTypes[] = [
	IconTypes.strike,
	IconTypes.code,
	IconTypes.subscript,
	IconTypes.superscript,
];

/**
 * Minimal toolbar is with Bold as single button, and Italic as a dropdown button.
 */
export const ResponsiveCustomButtonToolbarMinimal: Record<ToolbarSize, IconTypes[]> = {
	[ToolbarSize.XXL]: ToolbarButtonsStrong,
	[ToolbarSize.XL]: ToolbarButtonsStrong,
	[ToolbarSize.L]: ToolbarButtonsStrong,
	[ToolbarSize.M]: ToolbarButtonsStrong,
	[ToolbarSize.S]: ToolbarButtonsStrong,
	[ToolbarSize.XXXS]: [],
};

/**
 * Spacious toolbar is with Bold, italic, underline as single buttons, and strike as a dropdown button.
 */
export const ResponsiveCustomButtonToolbarSpacious: Record<ToolbarSize, IconTypes[]> = {
	[ToolbarSize.XXL]: ToolbarButtonsStrongItalicUnderline,
	[ToolbarSize.XL]: ToolbarButtonsStrongItalicUnderline,
	[ToolbarSize.L]: ToolbarButtonsStrongItalicUnderline,
	[ToolbarSize.M]: ToolbarButtonsStrongItalic,
	[ToolbarSize.S]: ToolbarButtonsStrongItalic,
	[ToolbarSize.XXXS]: ToolbarButtonsStrong,
};

/**
 * Corresponding dropdown menu for the ResponsiveCustomButtonToolbarSpacious
 */
export const ResponsiveCustomMenuSpacious: Record<ToolbarSize, IconTypes[]> = {
	[ToolbarSize.XXL]: ButtonsMenuSpacious,
	[ToolbarSize.XL]: ButtonsMenuSpacious,
	[ToolbarSize.L]: ButtonsMenuSpacious,
	[ToolbarSize.M]: [IconTypes.underline, ...ButtonsMenuSpacious],
	[ToolbarSize.S]: [IconTypes.underline, ...ButtonsMenuSpacious],
	[ToolbarSize.XXXS]: [IconTypes.em, IconTypes.underline, ...ButtonsMenuSpacious],
};
