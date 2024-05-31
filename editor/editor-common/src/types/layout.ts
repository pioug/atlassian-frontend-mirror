import type { LongPressSelectionPluginOptions } from './selection';

export interface LayoutPluginOptions extends LongPressSelectionPluginOptions {
	allowBreakout?: boolean;
	UNSAFE_addSidebarLayouts?: boolean;
	UNSAFE_allowSingleColumnLayout?: boolean;
}
