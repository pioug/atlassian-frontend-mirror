import { type IntlShape } from 'react-intl-next';

import { type INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AccessibilityUtilsPlugin } from '@atlaskit/editor-plugin-accessibility-utils';
import { type AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { QuickInsertPlugin } from '@atlaskit/editor-plugin-quick-insert';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';
import { type DecorationSet } from '@atlaskit/editor-prosemirror/view';

export type ActiveNode = {
	pos: number;
	anchorName: string;
	nodeType: string;
	handleOptions?: HandleOptions;
	rootPos?: number;
	rootAnchorName?: string;
	rootNodeType?: string;
};

export type MultiSelectDnD = {
	anchor: number;
	head: number;
	textAnchor: number;
	textHead: number;
	userAnchor: number;
	userHead: number;
};

export interface PluginState {
	decorations: DecorationSet;
	isDragging: boolean;
	isMenuOpen?: boolean;
	menuTriggerBy?: string;
	editorHeight: number;
	editorWidthLeft: number;
	editorWidthRight: number;
	activeNode?: ActiveNode;
	isResizerResizing: boolean;
	/**
	 * @private
	 * @deprecated Doc size limits no longer supported
	 */
	isDocSizeLimitEnabled: boolean | null;
	/**
	 * is dragging the node without using drag handle, i,e, native prosemirror DnD
	 */
	isPMDragging: boolean;
	multiSelectDnD?: MultiSelectDnD;
	isShiftDown?: boolean;
	lastDragCancelled: boolean;
}

export type ReleaseHiddenDecoration = () => boolean | undefined;

export type BlockControlsSharedState =
	| {
			isMenuOpen: boolean;
			menuTriggerBy?: string;
			activeNode?: ActiveNode;
			isDragging: boolean;
			isPMDragging: boolean;
			multiSelectDnD?: MultiSelectDnD;
			isShiftDown?: boolean;
	  }
	| undefined;

export type HandleOptions = { isFocused: boolean } | undefined;

export type MoveNode = (
	start: number,
	to: number,
	inputMethod?: MoveNodeMethod,
	formatMessage?: IntlShape['formatMessage'],
) => EditorCommand;

export type BlockControlsPluginDependencies = [
	OptionalPlugin<EditorDisabledPlugin>,
	OptionalPlugin<WidthPlugin>,
	OptionalPlugin<FeatureFlagsPlugin>,
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<AccessibilityUtilsPlugin>,
	/**
	 * For Typeahead - Empty line prompt experiment
	 * Clean up ticket ED-24824
	 */
	OptionalPlugin<QuickInsertPlugin>,
	OptionalPlugin<SelectionPlugin>,
];

export type BlockControlsPlugin = NextEditorPlugin<
	'blockControls',
	{
		dependencies: BlockControlsPluginDependencies;
		sharedState: BlockControlsSharedState;
		commands: {
			/**
			 * Move a node before (unless `moveToEnd` is set) another node to expand a layout or create a new layout
			 * @param from position of the node to be moved
			 * @param to position of the layout/layout column/node to move the node to
			 * @param options moveToEnd: move the node to after the layout/layout column/another node
			 * @param options selectMovedNode: select the moved node after moving it
			 */
			moveToLayout: (
				start: number,
				to: number,
				options?: { moveToEnd?: boolean; selectMovedNode?: boolean; moveNodeAtCursorPos?: boolean },
			) => EditorCommand;
			moveNode: MoveNode;
			showDragHandleAt: (
				pos: number,
				anchorName: string,
				nodeType: string,
				handleOptions?: HandleOptions,
				rootPos?: number,
				rootAnchorName?: string,
				rootNodeType?: string,
			) => EditorCommand;
			toggleBlockMenu: (options?: { closeMenu?: boolean; anchorName?: string }) => EditorCommand;
			setNodeDragged: (
				getPos: () => number | undefined,
				anchorName: string,
				nodeType: string,
			) => EditorCommand;
			setMultiSelectPositions: (anchor?: number, head?: number) => EditorCommand;
		};
	}
>;

export type BlockControlsMeta = {
	activeNode: ActiveNode;
	type: string;
	dom: HTMLElement;
	editorHeight: number;
	nodeMoved: boolean;
};

export type MoveNodeMethod = INPUT_METHOD.DRAG_AND_DROP | INPUT_METHOD.SHORTCUT;
