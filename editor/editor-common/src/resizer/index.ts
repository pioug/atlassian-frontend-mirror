// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

export { default as ResizerNext } from './Resizer';
export type {
	HandleAlignmentMethod,
	HandleHighlight,
	HandleSize,
	HandlePositioning,
	EnabledHandles,
	HandleResize,
	Position,
	Snap,
	HandleResizeStart,
	Dimensions,
} from './types';
export { BreakoutResizer, ignoreResizerMutations } from './BreakoutResizer';
export { useBreakoutGuidelines } from './useBreakoutGuidelines';
export { ResizerBreakoutModeLabel } from './ResizerBreakoutModeLabel';
