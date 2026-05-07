import { defineMessages } from 'react-intl';

export const selectionToolbarMessages: {
	toolbarAppears: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	toolbarPositionInline: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	toolbarPositionFixedAtTop: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	toolbarPositionUnpined: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	toolbarPositionPinedAtTop: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	toolbarPositionUnpinnedConcise: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	toolbarAppears: {
		id: 'fabric.editor.toolbarAppears',
		defaultMessage: 'Toolbar appears',
		description:
			'Label for the group of radio options that control where the selection toolbar appears relative to selected text (e.g. inline or fixed at top).',
	},
	toolbarPositionInline: {
		id: 'fabric.editor.toolbarPositionInline',
		defaultMessage: 'In-line with text',
		description: 'Label for in-line toolbar position option',
	},
	toolbarPositionFixedAtTop: {
		id: 'fabric.editor.toolbarPositionFixedAtTop',
		defaultMessage: 'Fixed at top',
		description: 'Label for fixed at top toolbar position option',
	},
	toolbarPositionUnpined: {
		id: 'fabric.editor.toolbarPositionUnpined',
		defaultMessage: 'Pin the toolbar at the top',
		description: 'Label for in-line toolbar position option',
	},
	toolbarPositionPinedAtTop: {
		id: 'fabric.editor.toolbarPositionPinedAtTop',
		defaultMessage: 'Unpin the toolbar',
		description: 'Label for fixed at top toolbar position option',
	},
	toolbarPositionUnpinnedConcise: {
		id: 'fabric.editor.toolbarPositionUnpinnedConcise',
		defaultMessage: 'Pin toolbar to top',
		description: 'Label for menu item to pin the toolbar to the top of the page',
	},
});
