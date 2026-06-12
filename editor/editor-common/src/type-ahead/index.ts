// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

export enum TypeAheadAvailableNodes {
	EMOJI = 'emojiTypeAhead',
	MENTION = 'mentionTypeAhead',
	QUICK_INSERT = 'quickInsertTypeAhead',
}

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export enum SelectItemMode {
	SHIFT_ENTER = 'shift-enter',
	ENTER = 'enter',
	SPACE = 'space',
	SELECTED = 'selected',
}

export { typeAheadListMessages } from './messages';
