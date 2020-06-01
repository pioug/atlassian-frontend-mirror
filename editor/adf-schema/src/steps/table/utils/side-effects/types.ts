import { Node as ProseMirrorNode } from 'prosemirror-model';

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
  node: { [key: string]: any }; // ToJson type of ProseMirrorNode.toJson()
}

export interface RowSideEffectJSON {
  from: number;
  to: number;
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
