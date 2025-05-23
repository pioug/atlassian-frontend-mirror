import type {
	EditorAppearance,
	LongPressSelectionPluginOptions,
} from '@atlaskit/editor-common/types';
import type { Slice } from '@atlaskit/editor-prosemirror/model';

export interface LayoutPluginOptions extends LongPressSelectionPluginOptions {
	allowBreakout?: boolean;
	UNSAFE_addSidebarLayouts?: boolean;
	/**
	 * @private
	 * @deprecated
	 * @see https://product-fabric.atlassian.net/browse/ED-26662
	 */
	UNSAFE_allowSingleColumnLayout?: boolean;
	editorAppearance?: EditorAppearance;
}

export type PresetLayout =
	| 'single'
	| 'two_equal'
	| 'three_equal'
	| 'two_right_sidebar'
	| 'two_left_sidebar'
	| 'three_with_sidebars'
	| 'three_left_sidebars'
	| 'three_right_sidebars'
	| 'four_equal'
	| 'five_equal';

export interface Change {
	from: number;
	to: number;
	slice: Slice;
}
