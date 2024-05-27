import { type ERROR_NODE, type SELECTED_NODE } from './constants';

export type RichInlineNodeDecoration = typeof SELECTED_NODE | typeof ERROR_NODE;
