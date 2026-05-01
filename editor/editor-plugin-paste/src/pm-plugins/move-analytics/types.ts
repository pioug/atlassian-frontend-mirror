// For an event to be considered a move content event we want to ensure that
// cut had happened and was followed by paste. So our currentActions array should
// look like this ['contentCut', 'contentPasted'];
// After removing appendTransaction we don't update currentActions with 'contentPasted'
// but leaving it as array in case we decide to change it back or add 'contentCopied'.
export type ActionType = 'contentCut' | 'contentPasted';

export type NodeName = string;

export type ContentMoved = {
	currentActions: Array<ActionType>;
	hasSelectedMultipleNodes?: boolean;
	nodeDepth?: number;
	nodeTypes?: string;
	size?: number;
};

export type MoveAnalyticsPluginState = {
	contentMoved: ContentMoved;
};

export const defaultState = {
	contentMoved: {
		size: undefined,
		nodeDepth: undefined,
		currentActions: [],
		nodeTypes: undefined,
		hasSelectedMultipleNodes: undefined,
	},
} as MoveAnalyticsPluginState;
