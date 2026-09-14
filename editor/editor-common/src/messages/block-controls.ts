import { defineMessages } from 'react-intl';

export const messages: {
	collapseSection: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	delete: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	dragToMove: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	dragToMoveClickToOpen: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	dragToRearrange: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	expandSection: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	insert: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	movedDown: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	moveDown: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	movedup: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	moveLeft: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	moveRight: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	moveUp: {
		defaultMessage: string;
		description: string;
		id: string;
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
	collapseSection: {
		id: 'editor-common.messages.block-controls.collapseSection',
		defaultMessage: 'Collapse section',
		description: 'Accessible label for the button that collapses a heading section.',
	},
	expandSection: {
		id: 'editor-common.messages.block-controls.expandSection',
		defaultMessage: 'Expand section',
		description: 'Accessible label for the button that expands a heading section.',
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
