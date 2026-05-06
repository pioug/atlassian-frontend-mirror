import { defineMessages } from 'react-intl';

export const messages: {
	dragToMove: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	dragToMoveClickToOpen: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	dragToRearrange: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	insert: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	moveUp: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	moveDown: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	movedup: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	movedDown: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	moveLeft: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	moveRight: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	delete: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	dragToMove: {
		id: 'fabric.editor.blockControlDragHandleMove',
		defaultMessage: 'Drag to move',
		description:
			'Tooltip shown on the drag handle of a content block in the editor, indicating the user can drag this handle to reposition the block.',
	},
	dragToMoveClickToOpen: {
		id: 'fabric.editor.blockControlDragHandleMoveOrOpen',
		defaultMessage: 'Drag to move {br} Click to open menu',
		description: 'Use drag handle to move content or click to open the menu',
	},
	dragToRearrange: {
		id: 'fabric.editor.blockControlDragHandleRearrange',
		defaultMessage: 'Drag to rearrange',
		description:
			'Tooltip shown on the drag handle of a layout column in the editor, indicating the user can drag this handle to reorder columns.',
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
		description:
			'Assistive announcement read by screen readers to confirm the selected content block has been successfully moved up in the editor.',
	},
	movedDown: {
		id: 'fabric.editor.blockControlMovedDown',
		defaultMessage: 'Content has been moved down',
		description:
			'Assistive announcement read by screen readers to confirm the selected content block has been successfully moved down in the editor.',
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
