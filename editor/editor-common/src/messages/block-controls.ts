import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
	dragToMove: {
		id: 'fabric.editor.blockControlDragHandleMove',
		defaultMessage: 'Drag to move',
		description: 'Use drag handle to move content',
	},
	dragToMoveClickToOpen: {
		id: 'fabric.editor.blockControlDragHandleMoveOrOpen',
		defaultMessage: 'Drag to move {br} Click to open menu',
		description: 'Use drag handle to move content or click to open the menu',
	},
	dragToRearrange: {
		id: 'fabric.editor.blockControlDragHandleRearrange',
		defaultMessage: 'Drag to rearrange',
		description: 'Use drag handle to rearrange columns',
	},
	insert: {
		id: 'fabric.editor.blockControlInsert',
		defaultMessage: 'Insert',
		description: 'Label on button to insert content at the current cursor position',
	},
	moveUp: {
		id: 'fabric.editor.blockControlMoveUp',
		defaultMessage: 'Move up',
		description:
			'Label for a button in the block controls menu that moves the selected content block up in the editor.',
	},
	moveDown: {
		id: 'fabric.editor.blockControlMoveDown',
		defaultMessage: 'Move down',
		description:
			'Label for a button in the block controls menu that moves the selected content block down in the editor.',
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

	moveLeft: {
		id: 'fabric.editor.blockControlMoveLeft',
		defaultMessage: 'Move left',
		description:
			'Label for a button in the block controls menu that moves the selected content block to the left.',
	},
	moveRight: {
		id: 'fabric.editor.blockControlMoveRight',
		defaultMessage: 'Move right',
		description:
			'Label for a button in the block controls menu that moves the selected content block to the right.',
	},
	delete: {
		id: 'fabric.editor.blockControlDelete',
		defaultMessage: 'Delete',
		description:
			'Label for a button in the block controls menu that deletes the currently selected content block from the editor.',
	},
});
