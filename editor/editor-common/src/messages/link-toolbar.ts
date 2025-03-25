import { defineMessages } from 'react-intl-next';

export const linkToolbarMessages = defineMessages({
	addLink: {
		id: 'fabric.editor.mediaAddLink',
		defaultMessage: 'Add link',
		description: 'Add link',
	},
	unableToOpenLink: {
		id: 'fabric.editor.unableToOpenLink',
		defaultMessage: 'Unable to open this link',
		description: 'Unable to open this link',
	},
	unlink: {
		id: 'fabric.editor.unlink',
		defaultMessage: 'Unlink',
		description: 'Removes the hyperlink but keeps your text.',
	},
	editDatasourceStandalone: {
		id: 'fabric.editor.editDatasourceStandalone',
		defaultMessage: 'Edit',
		description: 'A standalone edit button to edit the datasource via a config modal',
	},
	editDatasourceStandaloneTooltip: {
		id: 'fabric.editor.editDatasourceStandaloneTooltip',
		defaultMessage: 'Edit search query',
		description:
			'A standalone edit button tooltip to hint at editing the datasource via a config modal',
	},
	editLink: {
		id: 'fabric.editor.editLink',
		defaultMessage: 'Edit link',
		description: 'Edit the link, update display text',
	},
	placeholder: {
		id: 'fabric.editor.hyperlinkToolbarPlaceholder',
		defaultMessage: 'Paste or search for link',
		description: 'Paste or search for link',
	},
	linkPlaceholder: {
		id: 'fabric.editor.linkPlaceholder',
		defaultMessage: 'Paste link',
		description: 'Create a new link by pasting a URL.',
	},
	linkAddress: {
		id: 'fabric.editor.linkAddress',
		defaultMessage: 'Link address',
		description: 'Insert the address of the link',
	},
	invalidLink: {
		id: 'fabric.editor.invalidLink',
		defaultMessage: 'Please enter a valid link.',
		description: 'Please enter a valid link.',
	},
	emptyLink: {
		id: 'fabric.editor.emptyLink',
		defaultMessage: 'Please enter a link.',
		description: 'Please enter a link.',
	},
	settingsLink: {
		id: 'fabric.editor.settingsLinks',
		defaultMessage: 'Go to Link Preferences',
		description: 'Go to Link Preferences',
	},
	preferencesLink: {
		id: 'fabric.editor.preferencesLink',
		defaultMessage: 'Link preferences',
		description: 'Go to link preferences',
	},
	editDatasource: {
		id: 'fabric.editor.edit.datasource',
		defaultMessage: 'Edit search query',
		description: 'Datasource toolbar edit button',
	},
	searchInput: {
		id: 'fabric.editor.edit.searchInput',
		defaultMessage: 'Add a link',
		description: 'Label for the search media input',
	},
});
