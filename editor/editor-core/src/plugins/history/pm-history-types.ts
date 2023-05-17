import { StepMap, Step } from 'prosemirror-transform';

export interface PmHistoryItem {
  map: StepMap;
  step: Step;
}

export interface PmHistoryLeaf {
  values: PmHistoryItem[];
  length: number;
}

export interface PmHistoryBranch {
  items: PmHistoryLeaf;
  eventCount: number;
}

export interface PmHistoryPluginState {
  done: PmHistoryBranch;
  undone: PmHistoryBranch;
}
