import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
	copyBlock: {
		id: 'fabric.editor.block.menu.copy.block',
		defaultMessage: 'Copy block',
		description: 'Copy the selected block to the clipboard',
	},
	copyContent: {
		id: 'fabric.editor.block.menu.copy.content',
		defaultMessage: 'Copy content',
		description: 'Copy the selected content to the clipboard',
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
	copyLinkToBlock: {
		id: 'fabric.editor.block.menu.copy.link.to.block',
		defaultMessage: 'Copy link to block',
		description: 'Copy link to the selected block',
	},
	linkCopiedToClipboard: {
		id: 'fabric.editor.block.menu.link.copied.to.clipboard',
		defaultMessage: 'Link copied to clipboard',
		description: 'Confirmation message shown when link is copied to clipboard',
	},
	paragraph: {
		id: 'fabric.editor.block.menu.paragraph',
		defaultMessage: 'Paragraph',
		description: 'Change the selected block to a paragraph',
	},
	codeBlock: {
		id: 'fabric.editor.block.menu.codeblock',
		defaultMessage: 'Code block',
		description: 'Convert to a code block',
	},
	layout: {
		id: 'fabric.editor.block.menu.layout',
		defaultMessage: 'Layout',
		description: 'Convert to a layout node',
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
	createSyncedBlock: {
		id: 'fabric.editor.block.menu.create.synced.block',
		defaultMessage: 'Create synced block',
		description:
			'Create a synced block at this line, converting the selection to a synced block if applicable',
	},
	copySyncedBlock: {
		id: 'fabric.editor.block.menu.copy.synced.block',
		defaultMessage: 'Copy synced block',
		description: 'Copy the selected synced block to the clipboard',
	},
	newLozenge: {
		id: 'fabric.editor.block.menu.new.lozenge',
		defaultMessage: 'New',
		description: 'Text in lozenge which appears next to newly added menu items',
	},
	decisionList: {
		id: 'fabric.editor.block.menu.decision',
		defaultMessage: 'Decision',
		description: 'Label for the decision option in the block menu transformation menu',
	},
	wrapIcon: {
		id: 'fabric.editor.block.menu.wrap.icon',
		defaultMessage: 'Wrap',
		description: 'Aria label for the wrap icon in code block toolbar',
	},
	create: {
		id: 'fabric.editor.block.menu.create',
		defaultMessage: 'Create',
		description: 'Menu section title',
	},
	headings: {
		id: 'fabric.editor.block.menu.headings',
		defaultMessage: 'Headings',
		description: 'Menu section title',
	},
	suggested: {
		id: 'fabric.editor.block.menu.suggested',
		defaultMessage: 'Suggested',
		description: 'Menu section title',
	},
	structure: {
		id: 'fabric.editor.block.menu.structure',
		defaultMessage: 'Structure',
		description: 'Menu section title',
	},
});
