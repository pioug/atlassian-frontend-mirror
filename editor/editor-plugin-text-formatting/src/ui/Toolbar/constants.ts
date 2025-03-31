import { ToolbarSize } from '@atlaskit/editor-common/types';

import { IconTypes } from './types';

export const DefaultButtonsToolbar: IconTypes[] = [IconTypes.strong, IconTypes.em];

export const DefaultFloatingToolbarButtonsNext: IconTypes[] = [IconTypes.strong];

export const DefaultButtonsToolbarNext: IconTypes[] = [
	IconTypes.strong,
	IconTypes.em,
	IconTypes.underline,
];

export const DefaultButtonsMenu: IconTypes[] = [
	IconTypes.underline,
	IconTypes.strike,
	IconTypes.code,
	IconTypes.subscript,
	IconTypes.superscript,
];

export const DefaultButtonsMenuNext: IconTypes[] = [
	IconTypes.strike,
	IconTypes.code,
	IconTypes.subscript,
	IconTypes.superscript,
];

// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
/** @deprecated
 * When tidying platform_editor_controls this is to be removed in favor of ResponsiveCustomButtonToolbarNext
 * along with references to platform_editor_controls gate
 */
export const ResponsiveCustomButtonToolbar: Record<ToolbarSize, IconTypes[]> = {
	[ToolbarSize.XXL]: DefaultButtonsToolbar,
	[ToolbarSize.XL]: DefaultButtonsToolbar,
	[ToolbarSize.L]: DefaultButtonsToolbar,
	[ToolbarSize.M]: DefaultButtonsToolbar,
	[ToolbarSize.S]: DefaultButtonsToolbar,
	[ToolbarSize.XXXS]: [],
};

export const ResponsiveCustomButtonToolbarNext: Record<ToolbarSize, IconTypes[]> = {
	[ToolbarSize.XXL]: DefaultButtonsToolbarNext,
	[ToolbarSize.XL]: DefaultButtonsToolbarNext,
	[ToolbarSize.L]: DefaultButtonsToolbarNext,
	[ToolbarSize.M]: [IconTypes.strong, IconTypes.em],
	[ToolbarSize.S]: [IconTypes.strong, IconTypes.em],
	[ToolbarSize.XXXS]: [IconTypes.strong],
};

// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
/** @deprecated
 * When tidying platform_editor_controls this is to be removed in favor of ResponsiveCustomMenuNext
 * along with references to platform_editor_controls gate
 */
export const ResponsiveCustomMenu: Record<ToolbarSize, IconTypes[]> = {
	[ToolbarSize.XXL]: DefaultButtonsMenu,
	[ToolbarSize.XL]: DefaultButtonsMenu,
	[ToolbarSize.L]: DefaultButtonsMenu,
	[ToolbarSize.M]: DefaultButtonsMenu,
	[ToolbarSize.S]: DefaultButtonsMenu,
	[ToolbarSize.XXXS]: [IconTypes.strong, IconTypes.em, ...DefaultButtonsMenu],
};

export const ResponsiveCustomMenuNext: Record<ToolbarSize, IconTypes[]> = {
	[ToolbarSize.XXL]: DefaultButtonsMenuNext,
	[ToolbarSize.XL]: DefaultButtonsMenuNext,
	[ToolbarSize.L]: DefaultButtonsMenuNext,
	[ToolbarSize.M]: [IconTypes.underline, ...DefaultButtonsMenuNext],
	[ToolbarSize.S]: [IconTypes.underline, ...DefaultButtonsMenuNext],
	[ToolbarSize.XXXS]: [IconTypes.em, IconTypes.underline, ...DefaultButtonsMenuNext],
};
