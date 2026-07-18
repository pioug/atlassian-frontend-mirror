import { defineMessages } from 'react-intl';

export const placeholderTextMessages: {
	longEmptyNodePlaceholderADFPrefix: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	longEmptyNodePlaceholderADFSlashShortcut: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	longEmptyNodePlaceholderADFSuffix: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	longEmptyNodePlaceholderText: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	multiBodiedExtensionPlaceholderText: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	placeholderTextPlaceholder: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	shortEmptyNodePlaceholderADFSlashShortcut: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	shortEmptyNodePlaceholderADFSuffix: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	shortEmptyNodePlaceholderText: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	sourceSyncBlockPlaceholderText: {
		defaultMessage: string;
		description: string;
		id: string;
	};
} = defineMessages({
	placeholderTextPlaceholder: {
		id: 'fabric.editor.placeholderTextPlaceholder',
		defaultMessage: 'Add placeholder text',
		description:
			'Placeholder text shown in the editor when a placeholder text node is inserted, prompting the user to add custom placeholder content.',
	},
	shortEmptyNodePlaceholderText: {
		id: 'fabric.editor.shortEmptyNodePlaceholderText',
		defaultMessage: '/ to insert',
		description:
			'Short placeholder text shown inside empty editor nodes, instructing users to type / to open the quick-insert menu.',
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
		description:
			'Longer placeholder text shown inside empty editor nodes, instructing users to type / to open the quick-insert menu and add elements.',
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
		defaultMessage:
			'Add content you want to reuse. Copy and paste this block to sync in other locations.',
		description:
			'Placeholder text shown inside an empty source sync block, prompting users to add reusable content that can be synced across multiple locations.',
	},
	multiBodiedExtensionPlaceholderText: {
		id: 'fabric.editor.multiBodiedExtensionPlaceholderText',
		defaultMessage: 'Type to add content or press / to insert elements',
		description:
			'Placeholder text shown inside an empty multi bodied extension frame, prompting users to type content or use slash insert.',
	},
});
