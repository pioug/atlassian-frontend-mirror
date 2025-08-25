export type BasicValues = number | string | boolean | undefined | null;

export interface AdfAttrs {
	[key: string]:
		| BasicValues
		| BasicValues[]
		| Record<string, BasicValues | BasicValues[] | AdfAttrs>
		| Record<string, BasicValues | BasicValues[] | AdfAttrs>[];
}

export interface AdfMark {
	attrs?: AdfAttrs;
	type: string;
}

export interface AdfNode {
	attrs?: AdfAttrs;
	content?: AdfNode[];
	marks?: AdfMark[];
	text?: string;
	type: string;
}

export interface DocumentMetrics {
	externalDataSources: number;
	interactiveElements: number;
	leafNodes: number;
	maxDepth: number;
	nodeTypes: Map<string, number>;
	totalNodes: number;
}

export interface LeafNodeDebugInfo {
	baseWeight: number;
	count: number; // Number of similar nodes
	parentWeight: number;
	totalWeight: number; // Combined weight of all similar nodes
	type: string;
}

export type DebugNodePath = (string | LeafNodeDebugInfo)[];

export type ComplexityResult = {
	debugPaths?: DebugNodePath[];
	weight: number;
};
