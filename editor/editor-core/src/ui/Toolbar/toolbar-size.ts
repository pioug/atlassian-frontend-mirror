import {
	ToolbarSize,
	ToolbarWidthsFullPageNext,
	ToolbarWidthsNext,
} from '@atlaskit/editor-common/types';
import type { EditorAppearance } from '@atlaskit/editor-common/types/editor-appearance';

import { isFullPage } from '../../utils/is-full-page';
import type { ToolbarBreakPoint } from './toolbar-types';

// Toolbar sizes for full page editor a little bit different, because it has more buttons e.g. actions button...
const toolbarSizesFullPageNext: ToolbarBreakPoint[] = [
	{ width: ToolbarWidthsFullPageNext.XXL, size: ToolbarSize.XXL },
	{ width: ToolbarWidthsFullPageNext.XL, size: ToolbarSize.XL },
	{ width: ToolbarWidthsFullPageNext.L, size: ToolbarSize.L },
	{ width: ToolbarWidthsFullPageNext.M, size: ToolbarSize.M },
	{ width: ToolbarWidthsFullPageNext.S, size: ToolbarSize.S },
];

const toolbarSizesNext: ToolbarBreakPoint[] = [
	{ width: ToolbarWidthsNext.XXL, size: ToolbarSize.XXL },
	{ width: ToolbarWidthsNext.XL, size: ToolbarSize.XL },
	{ width: ToolbarWidthsNext.L, size: ToolbarSize.L },
	{ width: ToolbarWidthsNext.M, size: ToolbarSize.M },
	{ width: ToolbarWidthsNext.S, size: ToolbarSize.S },
];

const toolbarSizesForAppearance = (appearance?: EditorAppearance) =>
	isFullPage(appearance) ? toolbarSizesFullPageNext : toolbarSizesNext;

export const toolbarSizeToWidth = (
	toolbarSize: ToolbarSize,
	appearance?: EditorAppearance,
): number => {
	return (
		toolbarSizesForAppearance(appearance).find(({ size }) => toolbarSize === size) || {
			width: ToolbarWidthsNext.S,
		}
	).width;
};

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const widthToToolbarSize = (
	toolbarWidth: number,
	appearance?: EditorAppearance,
): ToolbarSize => {
	return (
		toolbarSizesForAppearance(appearance).find(({ width }) => toolbarWidth > width) || {
			size: ToolbarSize.XXXS,
		}
	).size;
};
