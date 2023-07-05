import { EditorView } from 'prosemirror-view';

import { CSSToken } from '@atlaskit/tokens';

/*
 * When x is 0, a vertical line is displayed at the center of the editor
 * a negative value will move the line to the left,
 * a positive value will move the line to the right,
 * The range is from -width/2 to width/2, outside will be ignored.
 * Define as an object allows us add more options in the future.
 */
export type Position = { x: number };

type GuidelineConfig = {
  key: string; // will be used as the React key
  position: Position;
  active?: boolean;
  show?: boolean;
  style?: 'dashed' | 'solid'; // default solid
  color?: CSSToken;
};

type GuidelinePluginState = {
  guidelines: GuidelineConfig[];
};

interface GuidelinePluginOptions {}

type DisplayGrid = (props: Required<GuidelinePluginState>) => boolean;
type DisplayGuideline = (view: EditorView) => DisplayGrid;

export type {
  GuidelinePluginState,
  GuidelinePluginOptions,
  GuidelineConfig,
  DisplayGuideline,
};
