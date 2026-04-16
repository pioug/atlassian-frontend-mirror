import { defineMessages } from 'react-intl';

export const trackChangesMessages: {
	toolbarIconLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	removed: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	toolbarIconLabel: {
		id: 'editor.trackChanges.toolbarIconLabel',
		defaultMessage: 'View changes',
		description: 'Label for the track changes toolbar icon',
	},
	removed: {
		id: 'editor.trackChanges.removed',
		defaultMessage: 'Removed',
		description: 'Label for content that has been removed in track changes',
	},
	added: {
		id: 'editor.trackChanges.added',
		defaultMessage: 'Added',
		description: 'Label for content that has been added in track changes',
	},
});
