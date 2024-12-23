import type { Node as ProseMirrorNode } from '@atlaskit/editor-prosemirror/model';

export interface TableSideEffect {
	from: number;
	to: number;
	node: ProseMirrorNode;
}

export interface RowSideEffect {
	from: number;
	to: number;
	rowNode: ProseMirrorNode;
}

export interface TableSideEffectJSON {
	from: number;
	to: number;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	node: { [key: string]: any }; // ToJson type of ProseMirrorNode.toJson()
}

export interface RowSideEffectJSON {
	from: number;
	to: number;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	rowNode: { [key: string]: any }; // ToJson type of ProseMirrorNode.toJson()
}

export type SideEffects = {
	table?: TableSideEffect;
	rows?: RowSideEffect[];
};
export type SideEffectsJSON = {
	table?: TableSideEffectJSON;
	rows?: RowSideEffectJSON[];
};
