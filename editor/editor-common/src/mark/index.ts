// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

export { transformNonTextNodesToText, applyMarkOnRange, toggleMark } from './commands';
export { entireSelectionContainsMark } from './entireSelectionContainsMark';
export { filterChildrenBetween } from './filterChildrenBetween';
export { removeMark } from './removeMark';
export { anyMarkActive } from './anyMarkActive';
export { isMarkAllowedInRange } from './isMarkAllowedInRange';
export { isMarkExcluded } from './isMarkExcluded';
export { wholeSelectionHasMarks } from './text-formatting';
