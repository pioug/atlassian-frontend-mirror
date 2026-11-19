import { defineMessages } from 'react-intl';

export const trackChangesMessages: {
	diffDeleteEnd: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	diffDeleteStart: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	diffInsertEnd: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	diffInsertStart: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	removed: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	toolbarIconLabel: {
		defaultMessage: string;
		description: string;
		id: string;
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
	diffInsertStart: {
		id: 'editor.trackChanges.diffInsertStart',
		defaultMessage: 'Newly updated text',
		description: 'Screen reader cue before inserted text in a document comparison.',
	},
	diffInsertEnd: {
		id: 'editor.trackChanges.diffInsertEnd',
		defaultMessage: 'End of newly updated text',
		description: 'Screen reader cue after inserted text in a document comparison.',
	},
	diffDeleteStart: {
		id: 'editor.trackChanges.diffDeleteStart',
		defaultMessage: 'Deleted text',
		description: 'Screen reader cue before deleted text in a document comparison.',
	},
	diffDeleteEnd: {
		id: 'editor.trackChanges.diffDeleteEnd',
		defaultMessage: 'End of deleted text',
		description: 'Screen reader cue after deleted text in a document comparison.',
	},
});
