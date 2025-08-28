import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
	copyBlock: {
		id: 'fabric.editor.block.menu.copy.block',
		defaultMessage: 'Copy block',
		description: 'Copy the selected block to the clipboard',
	},
	moveUpBlock: {
		id: 'fabric.editor.block.menu.move.up',
		defaultMessage: 'Move up',
		description: 'Move the selected block up',
	},
	moveDownBlock: {
		id: 'fabric.editor.block.menu.move.down',
		defaultMessage: 'Move down',
		description: 'Move the selected block down',
	},
	copyLink: {
		id: 'fabric.editor.block.menu.copy.link',
		defaultMessage: 'Copy link',
		description: 'Copy link to the selected block',
	},
	paragraph: {
		id: 'fabric.editor.block.menu.paragraph',
		defaultMessage: 'Paragraph',
		description: 'Change the selected block to a paragraph',
	},
});
