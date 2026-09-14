import type { AlignmentValue } from '../utils/types';

export const WHITEBOARD_VIEWPORT_ALIGNMENT_FEATURE = 'whiteboard-viewport-alignment';

export const WHITEBOARD_VIEWPORT_ALIGNMENT_CHANGE_COMMAND = 'whiteboard-viewport-alignment-change';

export type WhiteboardViewportAlignment = 'left' | 'center' | 'right';

export type WhiteboardViewportAlignmentChangeCommand = {
	alignment: WhiteboardViewportAlignment;
	type: typeof WHITEBOARD_VIEWPORT_ALIGNMENT_CHANGE_COMMAND;
};

export function normalizeWhiteboardViewportAlignment(
	alignment: AlignmentValue,
): WhiteboardViewportAlignment {
	switch (alignment) {
		case 'left':
		case 'wrap-left':
			return 'left';
		case 'center':
			return 'center';
		case 'right':
		case 'wrap-right':
			return 'right';
	}
}
