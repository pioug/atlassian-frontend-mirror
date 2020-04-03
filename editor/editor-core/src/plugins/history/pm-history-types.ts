import { StepMap, Step } from 'prosemirror-transform';

// prosemirror-history does not export its plugin key
export const pmHistoryPluginKey = 'history$';

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
