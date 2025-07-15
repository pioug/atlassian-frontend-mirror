export type BasicValues = number | string | boolean | undefined | null;

export interface AdfAttrs {
	[key: string]:
		| BasicValues
		| BasicValues[]
		| Record<string, BasicValues | BasicValues[] | AdfAttrs>
		| Record<string, BasicValues | BasicValues[] | AdfAttrs>[];
}

export interface AdfMark {
	type: string;
	attrs?: AdfAttrs;
}

export interface AdfNode {
	type: string;
	content?: AdfNode[];
	text?: string;
	attrs?: AdfAttrs;
	marks?: AdfMark[];
}

export interface DocumentMetrics {
	totalNodes: number;
	leafNodes: number;
	maxDepth: number;
	nodeTypes: Map<string, number>;
	interactiveElements: number;
	externalDataSources: number;
}

export interface LeafNodeDebugInfo {
	type: string;
	baseWeight: number;
	parentWeight: number;
	count: number; // Number of similar nodes
	totalWeight: number; // Combined weight of all similar nodes
}

export type DebugNodePath = (string | LeafNodeDebugInfo)[];

export type ComplexityResult = {
	weight: number;
	debugPaths?: DebugNodePath[];
};
