import type { Step, StepMap } from '@atlaskit/editor-prosemirror/transform';

export interface PmHistoryItem {
	map: StepMap;
	step: Step;
}

export interface PmHistoryLeaf {
	length: number;
	values: PmHistoryItem[];
}

export interface PmHistoryBranch {
	eventCount: number;
	items: PmHistoryLeaf;
}

export interface PmHistoryPluginState {
	done: PmHistoryBranch;
	undone: PmHistoryBranch;
}
