import { EditorView } from 'prosemirror-view';

type PositionValue = `${number}px` | `${number}%` | 0;

type PositionSide =
  | { left: PositionValue; right?: never }
  | { right: PositionValue; left?: never };

export enum GuidelineContainerArea {
  EditorLeftMargin = 'editorLeftMargin',
  EditorContent = 'editorContent',
  EditorRightMargin = 'editorRightMargin',
}

type GuidelinePosition = {
  containerArea?: GuidelineContainerArea; //default to "EditorContent"
} & PositionSide;

type GuidelineConfig = {
  key: string; // will be used as the React key
  position: GuidelinePosition;
  active?: boolean;
  show?: boolean;
  style?: 'dashed' | 'solid'; // default solid
  color?: string;
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
  GuidelinePosition,
  DisplayGuideline,
};
