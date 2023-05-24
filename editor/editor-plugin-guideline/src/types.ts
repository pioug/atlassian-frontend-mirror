import { EditorView } from 'prosemirror-view';

type Guideline = {
  key?: string; // will be used as the React key
  active?: boolean;
  show?: boolean;
  style?: 'dashed' | 'solid'; // default solid
  color?: string;
};

type GuidelinePluginState = {
  guidelines: Guideline[];
};

interface GuidelinePluginOptions {
  // GuidelinePluginOptions
  // TODO add options here;
}

type DisplayGuideline = (view: EditorView) => void;

export type {
  GuidelinePluginState,
  GuidelinePluginOptions,
  Guideline,
  DisplayGuideline,
};
