export { RelativeSelectionPos } from './types';
export type { SelectionPluginState, EditorSelectionAPI } from './types';

export {
  GapCursorSelection,
  Side,
  JSON_ID,
  GapBookmark,
} from './gap-cursor/selection';

export { isIgnored, isValidTargetNode } from './gap-cursor/utils';
export { setGapCursorSelection } from './gap-cursor/utils/setGapCursorSelection';

export {
  atTheBeginningOfBlock,
  atTheBeginningOfDoc,
  atTheEndOfBlock,
  atTheEndOfDoc,
  endPositionOfParent,
  isSelectionAtEndOfNode,
  isSelectionAtStartOfNode,
  startPositionOfParent,
} from './utils';
