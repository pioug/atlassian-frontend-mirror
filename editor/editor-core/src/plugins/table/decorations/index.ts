import { DecorationSet } from 'prosemirror-view';
import { findColumnControlSelectedDecoration } from '../utils/decoration';

export { buildTableDecorationSet } from './build-table-decoration-set';
export { buildColumnResizingDecorationSet } from './build-column-resizing-decoration-set';

export const hasColumnSelectedDecorations = (
  decorationSet: DecorationSet,
): boolean => !!findColumnControlSelectedDecoration(decorationSet).length;

export const removeColumnControlsSelected = (
  decorationSet: DecorationSet,
): DecorationSet =>
  decorationSet.remove(findColumnControlSelectedDecoration(decorationSet));
