import { defineMessages } from 'react-intl-next';

export const syncBlockMessages = defineMessages({
	copySyncBlockLabel: {
		id: 'fabric.editor.copySyncBlock',
		defaultMessage: 'Copy',
		description: 'Button label for copying the reference of sync block element to your clipboard',
	},
	copySyncBlockTooltip: {
		id: 'fabric.editor.copySyncBlockTooltip',
		defaultMessage: 'Copy reference to clipboard',
		description:
			'Tooltip for the button to copy the reference of sync block element to your clipboard',
	},

	editSourceLabel: {
		id: 'fabric.editor.editSourceLabel',
		defaultMessage: 'Edit source',
		description: 'Button label for editing the source of sync block element',
	},
	editSourceTooltip: {
		id: 'fabric.editor.editSourceTooltip',
		defaultMessage: 'Navigate to source page of the sync block',
		description: 'Tooltip for the button to navigate to the source page of the sync block element',
	},
	syncBlockGroup: {
		id: 'fabric.editor.syncBlockGroup',
		defaultMessage: 'Sync Block Types',
		description: 'aria-label for group of sync block the floating toolbar',
	},
});
