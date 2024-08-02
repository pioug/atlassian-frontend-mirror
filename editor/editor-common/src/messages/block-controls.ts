import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
	dragToMove: {
		id: 'fabric.editor.blockControlDragHandleUsageInfo',
		defaultMessage: 'Drag to move',
		description: 'Use drag handle to move content',
	},
	moveUp: {
		id: 'fabric.editor.blockControlMoveUp',
		defaultMessage: 'Move up',
		description: 'Moves selected content up',
	},
	moveDown: {
		id: 'fabric.editor.blockControlMoveDown',
		defaultMessage: 'Move down',
		description: 'Moves selected content down',
	},
	movedup: {
		id: 'fabric.editor.blockControlMovedUp',
		defaultMessage: 'Content has been moved up',
		description: 'Selected content has been moved down',
	},
	movedDown: {
		id: 'fabric.editor.blockControlMovedDown',
		defaultMessage: 'Content has been moved down',
		description: 'Selected content has been moved down',
	},
});
