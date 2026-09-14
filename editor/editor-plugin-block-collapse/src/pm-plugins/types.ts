import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';

export type ToggleAction = {
	headingPos: number;
	type: 'toggle';
};

type ExpandAction = {
	headingPos: number;
	type: 'expand';
};

type ExpandContainingRangeAction = {
	from: number;
	to: number;
	type: 'expandContainingRange';
};

type CollapsePositionsAction = {
	positions: number[];
	type: 'collapsePositions';
};

export type BlockCollapseAction =
	| CollapsePositionsAction
	| ExpandAction
	| ExpandContainingRangeAction
	| ToggleAction;

export type BlockCollapsePluginState = {
	collapsedHeadingAtSectionEnd: ReadonlyMap<number, number>;
	collapsedHeadingPositions: ReadonlySet<number>;
	collapsedSectionEnds: ReadonlyMap<number, number>;
	decorations: DecorationSet;
};
