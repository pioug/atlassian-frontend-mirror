// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

export {
	transformNonTextNodesToText,
	applyMarkOnRange,
	filterChildrenBetween,
	toggleMark,
	removeMark,
	entireSelectionContainsMark,
} from './commands';
export { anyMarkActive, isMarkAllowedInRange, isMarkExcluded } from './text-formatting';
