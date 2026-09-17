import type { Attrs, Node as PMNode } from '@atlaskit/editor-prosemirror/model';

export interface FlattenedItem {
	depth: number;
	isSelected: boolean;
	listType: string;
	node: PMNode;
	parentListAttrs: Attrs | null;
	pos: number;
}

export interface FlattenListOptions {
	doc: PMNode;
	indentDelta: number;
	maxDepth?: number;
	rootListEnd: number;
	rootListStart: number;
	selectionFrom: number;
	selectionTo: number;
}

export interface FlattenListResult {
	endIndex: number;
	items: FlattenedItem[];
	startIndex: number;
}
