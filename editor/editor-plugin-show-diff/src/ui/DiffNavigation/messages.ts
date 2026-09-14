import { defineMessages, type MessageDescriptor } from 'react-intl';

export const diffNavigationMessages: {
	activeChange: MessageDescriptor;
	activeChangeWithContributor: MessageDescriptor;
} = defineMessages({
	activeChange: {
		id: 'editor-plugin-show-diff.DiffNavigation.activeChange',
		defaultMessage: 'Change {index} of {total}',
		description:
			'Announced to screen readers when the reader steps to the next or previous change in the version-history diff. The index placeholder is the position of the change stepped to, counting from 1; total is how many changes the diff has.',
	},
	activeChangeWithContributor: {
		id: 'editor-plugin-show-diff.DiffNavigation.activeChangeWithContributor',
		defaultMessage: 'Change {index} of {total}. {contributor}',
		description:
			'Announced to screen readers when the reader steps to the next or previous change in the version-history diff and that change is credited to someone. The index and total placeholders are as in activeChange. The contributor placeholder is an already-translated sentence (changedBy, changedByAgent or changedByConnected), so it must be kept whole and only repositioned.',
	},
});
