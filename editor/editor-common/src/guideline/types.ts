import { EditorView } from '@atlaskit/editor-prosemirror/view';
import { CSSToken } from '@atlaskit/tokens';

export enum WidthTypes {
  PERCENTAGE = 'percentage',
  PIXEL = 'pixel',
}

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

export type GuidelineConfig = {
  key: string; // will be used as the React key
  position: Position;
  active?: boolean;
  show?: boolean;
  styles?: {
    capStyle?: 'line';
    lineStyle?: 'dashed' | 'solid'; // default solid
    color?: CSSToken;
  };
};

export type GuidelinePluginState = {
  guidelines: GuidelineConfig[];
};

export interface GuidelinePluginOptions {}

export type DisplayGrid = (props: Required<GuidelinePluginState>) => boolean;
export type DisplayGuideline = (view: EditorView) => DisplayGrid;
