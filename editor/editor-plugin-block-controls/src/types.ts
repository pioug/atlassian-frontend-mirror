import { type INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import { type AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';
import { type DecorationSet } from '@atlaskit/editor-prosemirror/view';

export interface PluginState {
	decorations: DecorationSet;
	decorationState: DecorationState;
	isDragging: boolean;
	isMenuOpen?: boolean;
	editorHeight: number;
	editorWidthLeft: number;
	editorWidthRight: number;
	activeNode: {
		pos: number;
		anchorName: string;
		nodeType: string;
		handleOptions?: HandleOptions;
	} | null;
	isResizerResizing: boolean;
	isDocSizeLimitEnabled: boolean | null;
	/**
	 * is dragging the node without using drag handle, i,e, native prosemirror DnD
	 */
	isPMDragging: boolean;
}

export type ReleaseHiddenDecoration = () => boolean | undefined;

export type BlockControlsSharedState =
	| {
			isMenuOpen: boolean;
			activeNode: { pos: number; anchorName: string } | null;
			decorationState: DecorationState;
			isDragging: boolean;
			isPMDragging: boolean;
	  }
	| undefined;

export type HandleOptions = { isFocused: boolean } | undefined;

export type BlockControlsPlugin = NextEditorPlugin<
	'blockControls',
	{
		dependencies: [
			OptionalPlugin<EditorDisabledPlugin>,
			OptionalPlugin<WidthPlugin>,
			OptionalPlugin<FeatureFlagsPlugin>,
			OptionalPlugin<AnalyticsPlugin>,
		];
		sharedState: BlockControlsSharedState;
		commands: {
			moveNode: (start: number, to: number, inputMethod?: MoveNodeMethod) => EditorCommand;
			showDragHandleAt: (
				pos: number,
				anchorName: string,
				nodeType: string,
				handleOptions?: HandleOptions,
			) => EditorCommand;
			setNodeDragged: (posNumber: number, anchorName: string, nodeType: string) => EditorCommand;
		};
	}
>;

export type DecorationState = {
	id: number;
	pos: number;
}[];

export type BlockControlsMeta = {
	activeNode: { pos: number; anchorName: string; nodeType: string };
	type: string;
	dom: HTMLElement;
	editorHeight: number;
	nodeMoved: boolean;
};

export type MoveNodeMethod = INPUT_METHOD.DRAG_AND_DROP | INPUT_METHOD.SHORTCUT;
