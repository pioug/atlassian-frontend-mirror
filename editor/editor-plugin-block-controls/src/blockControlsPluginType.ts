import { type IntlShape } from 'react-intl-next';

import { type INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
	DIRECTION,
} from '@atlaskit/editor-common/types';
import type { AccessibilityUtilsPlugin } from '@atlaskit/editor-plugin-accessibility-utils';
import { type AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { InteractionPlugin } from '@atlaskit/editor-plugin-interaction';
import type { LimitedModePlugin } from '@atlaskit/editor-plugin-limited-mode';
import type { MetricsPlugin } from '@atlaskit/editor-plugin-metrics';
import type { QuickInsertPlugin } from '@atlaskit/editor-plugin-quick-insert';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import type { UserIntentPlugin } from '@atlaskit/editor-plugin-user-intent';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';
import { type DecorationSet } from '@atlaskit/editor-prosemirror/view';

export type ActiveNode = {
	anchorName: string;
	handleOptions?: HandleOptions;
	nodeType: string;
	pos: number;
	rootAnchorName?: string;
	rootNodeType?: string;
	rootPos?: number;
};

export type ActiveDropTargetNode = {
	nodeTypeName: string | null;
	pos: number;
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
	activeDropTargetNode?: ActiveDropTargetNode;
	activeNode?: ActiveNode;
	blockMenuOptions?: { canMoveDown?: boolean; canMoveUp?: boolean; openedViaKeyboard?: boolean };
	decorations: DecorationSet;
	editorHeight: number;
	editorWidthLeft: number;
	editorWidthRight: number;
	/**
	 * @private
	 * @deprecated Doc size limits no longer supported
	 */
	isDocSizeLimitEnabled: boolean | null;
	isDragging: boolean;
	isMenuOpen?: boolean;
	/**
	 * is dragging the node without using drag handle, i,e, native prosemirror DnD
	 */
	isPMDragging: boolean;
	isResizerResizing: boolean;
	isSelectedViaDragHandle?: boolean;
	isShiftDown?: boolean;
	lastDragCancelled: boolean;
	menuTriggerBy?: string;
	multiSelectDnD?: MultiSelectDnD;
}

export type ReleaseHiddenDecoration = () => boolean | undefined;

export type BlockControlsSharedState =
	| {
			activeDropTargetNode?: ActiveDropTargetNode;
			activeNode?: ActiveNode;
			blockMenuOptions?: {
				canMoveDown?: boolean;
				canMoveUp?: boolean;
				openedViaKeyboard?: boolean;
			};
			isDragging: boolean;
			isEditing?: boolean;
			isMenuOpen: boolean;
			isMouseOut?: boolean;
			isPMDragging: boolean;
			isSelectedViaDragHandle?: boolean;
			isShiftDown?: boolean;
			lastDragCancelled: boolean;
			menuTriggerBy?: string;
			multiSelectDnD?: MultiSelectDnD;
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
	OptionalPlugin<LimitedModePlugin>,
	OptionalPlugin<EditorDisabledPlugin>,
	OptionalPlugin<WidthPlugin>,
	OptionalPlugin<FeatureFlagsPlugin>,
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<AccessibilityUtilsPlugin>,
	OptionalPlugin<QuickInsertPlugin>,
	OptionalPlugin<TypeAheadPlugin>,
	OptionalPlugin<SelectionPlugin>,
	// For ease of use metrics to track transactions where content was moved
	OptionalPlugin<MetricsPlugin>,
	OptionalPlugin<InteractionPlugin>,
	OptionalPlugin<UserIntentPlugin>,
];

export type BlockControlsPlugin = NextEditorPlugin<
	'blockControls',
	{
		commands: {
			moveNode: MoveNode;
			moveNodeWithBlockMenu: (direction: DIRECTION.UP | DIRECTION.DOWN) => EditorCommand;
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
				options?: { moveNodeAtCursorPos?: boolean; moveToEnd?: boolean; selectMovedNode?: boolean },
			) => EditorCommand;
			setMultiSelectPositions: (anchor?: number, head?: number) => EditorCommand;
			setNodeDragged: (
				getPos: () => number | undefined,
				anchorName: string,
				nodeType: string,
			) => EditorCommand;
			setSelectedViaDragHandle: (isSelectedViaDragHandle?: boolean) => EditorCommand;
			showDragHandleAt: (
				pos: number,
				anchorName: string,
				nodeType: string,
				handleOptions?: HandleOptions,
				rootPos?: number,
				rootAnchorName?: string,
				rootNodeType?: string,
			) => EditorCommand;
			toggleBlockMenu: (options?: {
				anchorName?: string;
				closeMenu?: boolean;
				openedViaKeyboard?: boolean;
			}) => EditorCommand;
		};
		dependencies: BlockControlsPluginDependencies;
		sharedState: BlockControlsSharedState;
	}
>;

export type BlockControlsMeta = {
	activeNode: ActiveNode;
	dom: HTMLElement;
	editorBlurred: boolean;
	editorHeight: number;
	nodeMoved: boolean;
	type: string;
};

export type MoveNodeMethod =
	| INPUT_METHOD.DRAG_AND_DROP
	| INPUT_METHOD.SHORTCUT
	| INPUT_METHOD.BLOCK_MENU;
