import { fg } from '@atlaskit/platform-feature-flags';

import type { EditorAppearance } from '../../types';
import { isFullPage } from '../../utils/is-full-page';

import type { ToolbarBreakPoint } from './toolbar-types';
import {
	ToolbarSize,
	ToolbarWidths,
	ToolbarWidthsFullPage,
	ToolbarWidthsFullPageNext,
	ToolbarWidthsNext,
} from './types';

// Toolbar sizes for full page editor a little bit different, because it has more buttons e.g. actions button...
const toolbarSizesFullPageNext: ToolbarBreakPoint[] = [
	{ width: ToolbarWidthsFullPageNext.XXL, size: ToolbarSize.XXL },
	{ width: ToolbarWidthsFullPageNext.XL, size: ToolbarSize.XL },
	{ width: ToolbarWidthsFullPageNext.L, size: ToolbarSize.L },
	{ width: ToolbarWidthsFullPageNext.M, size: ToolbarSize.M },
	{ width: ToolbarWidthsFullPageNext.S, size: ToolbarSize.S },
];

/** @deprecated
 * To be removed as part of ED-25129 in favour of toolbarSizesFullPageNext along with references
 * to platform_editor_toolbar_responsive_fixes feature gate
 */
const toolbarSizesFullPage: ToolbarBreakPoint[] = [
	{ width: ToolbarWidthsFullPage.XXL, size: ToolbarSize.XXL },
	{ width: ToolbarWidthsFullPage.XL, size: ToolbarSize.XL },
	{ width: ToolbarWidthsFullPage.L, size: ToolbarSize.L },
	{ width: ToolbarWidthsFullPage.M, size: ToolbarSize.M },
	{ width: ToolbarWidthsFullPage.S, size: ToolbarSize.S },
];

const toolbarSizesNext: ToolbarBreakPoint[] = [
	{ width: ToolbarWidthsNext.XXL, size: ToolbarSize.XXL },
	{ width: ToolbarWidthsNext.XL, size: ToolbarSize.XL },
	{ width: ToolbarWidthsNext.L, size: ToolbarSize.L },
	{ width: ToolbarWidthsNext.M, size: ToolbarSize.M },
	{ width: ToolbarWidthsNext.S, size: ToolbarSize.S },
];

/** @deprecated
 * To be removed as part of ED-25129 in favour of toolbarSizesNext along with references
 * to platform_editor_toolbar_responsive_fixes feature gate
 */
const toolbarSizes: ToolbarBreakPoint[] = [
	{ width: ToolbarWidths.XXL, size: ToolbarSize.XXL },
	{ width: ToolbarWidths.XL, size: ToolbarSize.XL },
	{ width: ToolbarWidths.L, size: ToolbarSize.L },
	{ width: ToolbarWidths.M, size: ToolbarSize.M },
	{ width: ToolbarWidths.S, size: ToolbarSize.S },
];

const toolbarSizesForAppearance = (appearance?: EditorAppearance) =>
	isFullPage(appearance)
		? fg('platform_editor_toolbar_responsive_fixes')
			? toolbarSizesFullPageNext
			: toolbarSizesFullPage
		: fg('platform_editor_toolbar_responsive_fixes')
			? toolbarSizesNext
			: toolbarSizes;

export const toolbarSizeToWidth = (toolbarSize: ToolbarSize, appearance?: EditorAppearance) => {
	return (
		toolbarSizesForAppearance(appearance).find(({ size }) => toolbarSize === size) || {
			width: ToolbarWidths.S,
		}
	).width;
};

export const widthToToolbarSize = (toolbarWidth: number, appearance?: EditorAppearance) => {
	return (
		toolbarSizesForAppearance(appearance).find(({ width }) => toolbarWidth > width) || {
			size: ToolbarSize.XXXS,
		}
	).size;
};
