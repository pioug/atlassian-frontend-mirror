import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';
import { type DecorationSet } from '@atlaskit/editor-prosemirror/view';

export interface PluginState {
	decorations: DecorationSet;
	decorationState: DecorationState;
	isDragging: boolean;
	isMenuOpen?: boolean;
	editorHeight: number;
	activeNode: {
		pos: number;
		anchorName: string;
		nodeType: string;
	} | null;
}

export type ReleaseHiddenDecoration = () => boolean | undefined;

export type BlockControlsPlugin = NextEditorPlugin<
	'blockControls',
	{
		dependencies: [OptionalPlugin<WidthPlugin>];
		sharedState:
			| {
					isMenuOpen: boolean;
					activeNode: { pos: number; anchorName: string } | null;
					decorationState: DecorationState;
					isDragging: boolean;
			  }
			| undefined;
		commands: {
			moveNode: (start: number, to: number) => EditorCommand;
			showDragHandleAt: (pos: number, anchorName: string, nodeType: string) => EditorCommand;
			setNodeDragged: (posNumber: number, anchorName: string) => EditorCommand;
		};
	}
>;

export type DecorationState = {
	index: number;
	pos: number;
}[];

export type BlockControlsMeta = {
	activeNode: { pos: number; anchorName: string; nodeType: string };
	type: string;
	dom: HTMLElement;
	editorHeight: number;
	nodeMoved: boolean;
};
