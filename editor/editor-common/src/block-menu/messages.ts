import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
	copyBlock: {
		id: 'fabric.editor.block.menu.copy.block',
		defaultMessage: 'Copy block',
		description: 'Copy the selected block to the clipboard',
	},
	deleteBlock: {
		id: 'fabric.editor.block.menu.delete.block',
		defaultMessage: 'Delete',
		description: 'Delete the selected block',
	},
	turnInto: {
		id: 'fabric.editor.block.menu.turn.into',
		defaultMessage: 'Turn into',
		description: 'Turn the selected block into another type',
	},
});
