export interface SelectionDataState {
  rect: RectData;
  selection: SelectionData;
  nodeTypes: string[];
  markTypes: string[];
}

export type SelectionData =
  | AllSelectionData
  | NodeSelectionData
  | TextSelectionData
  | GapSelectionData
  | CellSelectionData;

export interface RectData {
  top: number;
  left: number;
}

export interface AllSelectionData {
  type: 'all';
}

export interface NodeSelectionData {
  type: 'node';
  anchor: number;
}

export interface TextSelectionData {
  type: 'text';
  anchor: number;
  head: number;
}

export interface GapSelectionData {
  type: 'gapcursor';
  pos: number;
}

export interface CellSelectionData {
  type: 'cell';
  anchor: number;
  head: number;
}
