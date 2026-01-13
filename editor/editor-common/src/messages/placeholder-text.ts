import { defineMessages } from 'react-intl-next';

export const placeholderTextMessages = defineMessages({
	placeholderTextPlaceholder: {
		id: 'fabric.editor.placeholderTextPlaceholder',
		defaultMessage: 'Add placeholder text',
		description: '',
	},
	shortEmptyNodePlaceholderText: {
		id: 'fabric.editor.shortEmptyNodePlaceholderText',
		defaultMessage: '/ to insert',
		description: 'Short placeholder text for empty nodes',
	},
	shortEmptyNodePlaceholderADFSlashShortcut: {
		id: 'fabric.editor.shortEmptyNodePlaceholderSlash',
		defaultMessage: '/',
		description: 'Slash character in short empty node placeholder',
	},
	shortEmptyNodePlaceholderADFSuffix: {
		id: 'fabric.editor.shortEmptyNodePlaceholderSuffix',
		defaultMessage: ' to insert',
		description: 'Text after slash in short empty node placeholder',
	},
	longEmptyNodePlaceholderText: {
		id: 'fabric.editor.longEmptyNodePlaceholderText',
		defaultMessage: 'Type / to insert elements',
		description: 'Long placeholder text for empty nodes',
	},
	longEmptyNodePlaceholderADFPrefix: {
		id: 'fabric.editor.longEmptyNodePlaceholderPrefix',
		defaultMessage: 'Type ',
		description: 'Text before slash in long empty node placeholder',
	},
	longEmptyNodePlaceholderADFSlashShortcut: {
		id: 'fabric.editor.longEmptyNodePlaceholderSlash',
		defaultMessage: '/',
		description: 'Slash character in long empty node placeholder',
	},
	longEmptyNodePlaceholderADFSuffix: {
		id: 'fabric.editor.longEmptyNodePlaceholderSuffix',
		defaultMessage: ' to insert elements',
		description: 'Text after slash in long empty node placeholder',
	},
	sourceSyncBlockPlaceholderText: {
		id: 'fabric.editor.sourceSyncBlockPlaceholderText',
		defaultMessage: 'Add content you want to reuse. Copy and paste this block to sync in other locations.',
		description: 'Placeholder text for source sync block',
	},
});
