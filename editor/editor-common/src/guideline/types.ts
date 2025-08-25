import type { NodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { CSSToken } from '@atlaskit/tokens';

export type WidthTypes = 'percentage' | 'pixel';

export type LengthGuide = {
	isFullWidth?: boolean;
	left: number;
	length: number;
	right: number;
};

export type Range = { end: number; start: number };

/*
 * When x is 0, a vertical line is displayed at the center of the editor
 * a negative value will move the line to the left,
 * a positive value will move the line to the right,
 * The range is from -width/2 to width/2, outside will be ignored.
 * Define as an object allows us add more options in the future.
 *
 * ────────────┬─────────── y=0
 *             │
 *             │
 *            x=0
 */
export type VerticalPosition = { x: number; y?: Range };
export type HorizontalPosition = { x?: Range; y: number };
export type Position = VerticalPosition | HorizontalPosition;

export type GuidelineStyles = {
	active?: boolean;
	show?: boolean;
	styles?: {
		capStyle?: 'line';
		color?: CSSToken;
		lineStyle?: 'dashed' | 'solid'; // default solid
	};
};

export type GuidelineConfig = {
	isFullWidth?: boolean;
	key: string; // will be used as the React key
	position: Position;
} & GuidelineStyles;

export type GuidelineContainerRect = {
	left: number;
	top: number;
};

export type GuidelinePluginState = {
	guidelines: GuidelineConfig[];
	rect?: GuidelineContainerRect;
};

export type GuidelinePluginOptions = Object;

export type DisplayGrid = (props: GuidelinePluginState) => boolean;
export type DisplayGuideline = (view: EditorView) => DisplayGrid;

export type GuidelineSnap = {
	guidelineKey: string;
	width: number;
};

export type GuidelineSnapsReference = {
	guidelineReference: GuidelineSnap[];
	snaps: {
		x?: number[];
		y?: number[];
	};
};

export type GuidelineTypes = 'default' | 'temporary' | 'relative' | 'none';

export type RelativeGuides = {
	height?: {
		[key: number]: NodeWithPos[];
	};
	width?: {
		[key: number]: NodeWithPos[];
	};
};
