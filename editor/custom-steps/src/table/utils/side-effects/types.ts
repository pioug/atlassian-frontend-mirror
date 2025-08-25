import type { Node as ProseMirrorNode } from '@atlaskit/editor-prosemirror/model';

export interface TableSideEffect {
	from: number;
	node: ProseMirrorNode;
	to: number;
}

export interface RowSideEffect {
	from: number;
	rowNode: ProseMirrorNode;
	to: number;
}

export interface TableSideEffectJSON {
	from: number;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	node: { [key: string]: any }; // ToJson type of ProseMirrorNode.toJson()
	to: number;
}

export interface RowSideEffectJSON {
	from: number;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	rowNode: { [key: string]: any }; // ToJson type of ProseMirrorNode.toJson()
	to: number;
}

export type SideEffects = {
	rows?: RowSideEffect[];
	table?: TableSideEffect;
};
export type SideEffectsJSON = {
	rows?: RowSideEffectJSON[];
	table?: TableSideEffectJSON;
};
