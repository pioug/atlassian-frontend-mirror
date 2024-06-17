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
	activeNode: {
		pos: number;
		anchorName: string;
		nodeType: string;
	} | null;
	isResizerResizing: boolean;
	isDocSizeLimitEnabled: boolean;
}

export type ReleaseHiddenDecoration = () => boolean | undefined;

export type BlockControlsSharedState =
	| {
			isMenuOpen: boolean;
			activeNode: { pos: number; anchorName: string } | null;
			decorationState: DecorationState;
			isDragging: boolean;
	  }
	| undefined;

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
			moveNode: (start: number, to: number) => EditorCommand;
			showDragHandleAt: (pos: number, anchorName: string, nodeType: string) => EditorCommand;
			setNodeDragged: (posNumber: number, anchorName: string, nodeType: string) => EditorCommand;
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
