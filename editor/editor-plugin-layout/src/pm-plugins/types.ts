import type { Slice } from '@atlaskit/editor-prosemirror/model';

import type { PresetLayout } from '../types';

export type LayoutState = {
	addSidebarLayouts: boolean;
	allowBreakout: boolean;
	allowSingleColumnLayout: boolean;
	dangerPreviewLayoutColumnPositions: number[] | undefined;
	isLayoutColumnMenuOpen: boolean;
	isResizing: boolean;
	layoutColumnMenuAnchorPos: number | undefined;
	layoutColumnMenuOpenedViaKeyboard: boolean;
	pos: number | null;
	selectedLayout: PresetLayout | undefined;
};
export type Change = { from: number; slice: Slice; to: number };
