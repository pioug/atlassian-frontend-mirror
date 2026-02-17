import { defineMessages } from 'react-intl-next';

export const linkToolbarMessages = defineMessages({
	addLink: {
		id: 'fabric.editor.mediaAddLink',
		defaultMessage: 'Add link',
		description:
			'The text is shown as a button label in the editor link toolbar when the user wants to add a hyperlink to selected content.',
	},
	unableToOpenLink: {
		id: 'fabric.editor.unableToOpenLink',
		defaultMessage: 'Unable to open this link',
		description:
			'The text is shown as an error message in the editor link toolbar when the application cannot open the selected hyperlink.',
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
		description:
			'The text is shown as placeholder text in the hyperlink toolbar input field where the user can paste a URL or search for a link.',
	},
	linkPlaceholder: {
		id: 'fabric.editor.linkPlaceholder',
		defaultMessage: 'Paste link',
		description: 'Create a new link by pasting a URL.',
	},
	linkAddress: {
		id: 'fabric.editor.linkAddress',
		defaultMessage: 'Link address',
		description:
			'Label for the link address input field. Prompts users to enter or paste the URL address for the hyperlink.',
	},
	invalidLink: {
		id: 'fabric.editor.invalidLink',
		defaultMessage: 'Please enter a valid link.',
		description:
			'The text is shown as an error message in the editor link toolbar when the user enters a URL that is not valid or properly formatted.',
	},
	emptyLink: {
		id: 'fabric.editor.emptyLink',
		defaultMessage: 'Please enter a link.',
		description:
			'The text is shown as an error message in the editor link toolbar when the user submits the link field without entering any URL.',
	},
	settingsLink: {
		id: 'fabric.editor.settingsLinks',
		defaultMessage: 'Go to Link Preferences',
		description:
			'The text is shown as a link in the editor link toolbar that navigates the user to the link preferences settings page.',
	},
	preferencesLink: {
		id: 'fabric.editor.preferencesLink',
		defaultMessage: 'Link preferences',
		description:
			'The text is shown as a link label in the editor toolbar that opens the link preferences settings for the user.',
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
