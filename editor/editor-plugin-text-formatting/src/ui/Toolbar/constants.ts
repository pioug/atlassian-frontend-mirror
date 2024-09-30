import { ToolbarSize } from '@atlaskit/editor-common/types';

import { IconTypes } from './types';

export const DefaultButtonsToolbar: IconTypes[] = [IconTypes.strong, IconTypes.em];

export const DefaultButtonsMenu: IconTypes[] = [
	IconTypes.underline,
	IconTypes.strike,
	IconTypes.code,
	IconTypes.subscript,
	IconTypes.superscript,
];

/** @deprecated
 * To be removed as part of ED-25129 in favour of ResponsiveCustomButtonToolbarNext along with references
 * to platform_editor_toolbar_responsive_fixes feature gate
 */
export const ResponsiveCustomButtonToolbar: Record<ToolbarSize, IconTypes[]> = {
	[ToolbarSize.XXL]: DefaultButtonsToolbar,
	[ToolbarSize.XL]: DefaultButtonsToolbar,
	[ToolbarSize.L]: DefaultButtonsToolbar,
	[ToolbarSize.M]: [],
	[ToolbarSize.S]: [],
	[ToolbarSize.XXXS]: [],
};

/** @deprecated
 * To be removed as part of ED-25129 in favour of ResponsiveCustomButtonToolbarNext along with references
 * to platform_editor_toolbar_responsive_fixes feature gate
 */
export const ResponsiveCustomMenu: Record<ToolbarSize, IconTypes[]> = {
	[ToolbarSize.XXL]: DefaultButtonsMenu,
	[ToolbarSize.XL]: DefaultButtonsMenu,
	[ToolbarSize.L]: DefaultButtonsMenu,
	[ToolbarSize.M]: [IconTypes.strong, IconTypes.em, ...DefaultButtonsMenu],
	[ToolbarSize.S]: [IconTypes.strong, IconTypes.em, ...DefaultButtonsMenu],
	[ToolbarSize.XXXS]: [IconTypes.strong, IconTypes.em, ...DefaultButtonsMenu],
};

export const ResponsiveCustomButtonToolbarNext: Record<ToolbarSize, IconTypes[]> = {
	[ToolbarSize.XXL]: DefaultButtonsToolbar,
	[ToolbarSize.XL]: DefaultButtonsToolbar,
	[ToolbarSize.L]: DefaultButtonsToolbar,
	[ToolbarSize.M]: DefaultButtonsToolbar,
	[ToolbarSize.S]: DefaultButtonsToolbar,
	[ToolbarSize.XXXS]: [],
};

export const ResponsiveCustomMenuNext: Record<ToolbarSize, IconTypes[]> = {
	[ToolbarSize.XXL]: DefaultButtonsMenu,
	[ToolbarSize.XL]: DefaultButtonsMenu,
	[ToolbarSize.L]: DefaultButtonsMenu,
	[ToolbarSize.M]: DefaultButtonsMenu,
	[ToolbarSize.S]: DefaultButtonsMenu,
	[ToolbarSize.XXXS]: [IconTypes.strong, IconTypes.em, ...DefaultButtonsMenu],
};
