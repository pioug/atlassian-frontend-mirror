import type { NodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { CSSToken } from '@atlaskit/tokens';

export type WidthTypes = 'percentage' | 'pixel';

export type LengthGuide = { left: number; right: number; length: number };

export type Range = { start: number; end: number };

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
    lineStyle?: 'dashed' | 'solid'; // default solid
    color?: CSSToken;
  };
};

export type GuidelineConfig = {
  key: string; // will be used as the React key
  position: Position;
} & GuidelineStyles;

export type GuidelinePluginState = {
  guidelines: GuidelineConfig[];
};

export interface GuidelinePluginOptions {}

export type DisplayGrid = (props: Required<GuidelinePluginState>) => boolean;
export type DisplayGuideline = (view: EditorView) => DisplayGrid;

export type GuidelineSnap = {
  guidelineKey: string;
  width: number;
};

export type GuidelineSnapsReference = {
  snaps: {
    x?: number[];
    y?: number[];
  };
  guidelineReference: GuidelineSnap[];
};

export type GuidelineTypes = 'default' | 'temporary' | 'relative' | 'none';

export type RelativeGuides = {
  width?: {
    [key: number]: NodeWithPos[];
  };
  height?: {
    [key: number]: NodeWithPos[];
  };
};
