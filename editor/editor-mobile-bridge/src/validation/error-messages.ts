import { IS_DEV } from '../utils';

export const PAYLOAD_OBJECT = IS_DEV
  ? 'SelectionPayload expected to be object'
  : '1';
export const SELECTION_SHAPE = IS_DEV
  ? 'SelectionPayload needs to be of shape { selection, rect }'
  : '2';
export const RECT_OBJECT = IS_DEV
  ? 'SelectionPayload.rect expected to be object'
  : '3';
export const RECT_SHAPE = IS_DEV
  ? 'SelectionPayload.rect needs to be of shape { top: number, left: number }'
  : '4';
export const SELECTION_BASE = IS_DEV
  ? 'SelectionPayload.selection needs to be of shape { type: string }'
  : '5';
export const SELECTION_ENUM = IS_DEV
  ? 'SelectionPayload.selection.type needs to be one of all, node, text, gapcursor, cell)'
  : '6';
export const NODE_SELECTION = IS_DEV
  ? 'SelectionPayload.selection.anchor needs to be number for type node'
  : '7';
export const TEXT_CELL_SELECTION = IS_DEV
  ? 'SelectionPayload.selection needs to be of shape { anchor: number, head: number } for type text or cell'
  : '8';
export const GAPCURSOR_SELECTION = IS_DEV
  ? 'SelectionPayload.selection needs to be of shape { pos: number } for type gapcursor'
  : '9';
