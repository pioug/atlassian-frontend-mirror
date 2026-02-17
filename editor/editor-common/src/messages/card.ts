import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
	url: {
		id: 'fabric.editor.url',
		defaultMessage: 'Display URL',
		description: 'Convert the card to become a regular text-based hyperlink.',
	},
	block: {
		id: 'fabric.editor.displayBlock',
		defaultMessage: 'Display card',
		description:
			'Display link as a card with a rich preview similar to in a Facebook feed with page title, description, and potentially an image.',
	},
	inline: {
		id: 'fabric.editor.displayInline',
		defaultMessage: 'Display inline',
		description: 'Display link with the title only.',
	},
	embed: {
		id: 'fabric.editor.displayEmbed',
		defaultMessage: 'Display embed',
		description: 'Display link as an embedded object',
	},
	link: {
		id: 'fabric.editor.displayLink',
		defaultMessage: 'Display as text',
		description: 'Convert the card to become a regular text-based hyperlink.',
	},
	card: {
		id: 'fabric.editor.cardFloatingControls',
		defaultMessage: 'Card options',
		description:
			'The text is shown as a title for the floating toolbar when a user selects an inline card or smart link in the editor, providing options to change the card display type.',
	},
	blockCardUnavailable: {
		id: 'fabric.editor.blockCardUnavailable',
		defaultMessage: 'The inline link is inside {node} and cannot have its view changed',
		description: 'Warning message to show the user that this node cannot change its view',
	},
	displayOptionUnavailableInParentNode: {
		id: 'fabric.editor.displayOptionUnavailableInParentNode',
		defaultMessage: "This display option isn't available inside {node}",
		description:
			'Warning message to show the user that this node option is not available inside a parent node type',
	},
	urlTitle: {
		id: 'fabric.editor.urlTitle',
		defaultMessage: 'URL',
		description: 'Title for option to convert the card to become a regular text-based hyperlink.',
	},
	blockTitle: {
		id: 'fabric.editor.blockTitle',
		defaultMessage: 'Card',
		description: 'Title for option to display link in the card view.',
	},
	inlineTitle: {
		id: 'fabric.editor.inlineTitle',
		defaultMessage: 'Inline',
		description: 'Title for option to display link in the inline view.',
	},
	openButtonTitle: {
		id: 'fabric.editor.openButtonTitle',
		defaultMessage: 'Open',
		description: 'Title for a button that opens a link when clicked.',
	},
	panelButtonTitle: {
		id: 'fabric.editor.panelButtonTitle',
		defaultMessage: 'Panel',
		description: 'Title for a button that opens side panel when clicked.',
	},
	previewButtonTitle: {
		id: 'fabric.editor.previewButtonTitle',
		defaultMessage: 'Preview',
		description: 'Title for a button that when clicked opens a preview modal or a preview panel.',
	},
	embedTitle: {
		id: 'fabric.editor.embedTitle',
		defaultMessage: 'Embed',
		description: 'Title for option to display link as an embedded object.',
	},
	urlDescription: {
		id: 'fabric.editor.urlDescription',
		defaultMessage: 'Display link as URL',
		description:
			'Description for option to convert the card to become a regular text-based hyperlink.',
	},
	blockDescription: {
		id: 'fabric.editor.blockDescription',
		defaultMessage: 'Display more information about a link, including a summary and actions',
		description: 'Description for option to display link in the card view.',
	},
	inlineDescription: {
		id: 'fabric.editor.inlineDescription',
		defaultMessage: 'Display link as inline text',
		description: 'Description for option to display link in the inline view.',
	},
	embedDescription: {
		id: 'fabric.editor.ecombedDescription',
		defaultMessage: 'Display an interactive preview of a link',
		description: 'Description for option to display link as an embedded object.',
	},
	embedToBlockCardWarning: {
		id: 'fabric.editor.embedToBlockCardWarning',
		defaultMessage: 'Displays as a card on small screens',
		description:
			'Warning message to show the user that embed card will be displayed as a block card on small screens.',
	},
	editDropdownExpandIconLabel: {
		id: 'fabric.editor.editDropdownExpandIconLabel',
		defaultMessage: 'Expand dropdown menu',
		description: 'Text of an icon to expand the dropdown',
	},
	editDropdownTriggerTitle: {
		id: 'fabric.editor.editDropdownTriggerTitle',
		defaultMessage: 'Edit',
		description: 'Text of a button to trigger opening an edit dropdown',
	},
	editDropdownEditLinkTitle: {
		id: 'fabric.editor.editDropdownEditLinkTitle',
		defaultMessage: 'Edit link',
		description: 'Edit dropdown edit link button text',
	},
	editDropdownEditDatasourceTitle: {
		id: 'fabric.editor.editDropdownEditDatasourceTitle',
		defaultMessage: 'Edit search query',
		description: 'Edit dropdown edit datasource button text',
	},
	datasourceTitle: {
		id: 'fabric.editor.datasourceTitle',
		defaultMessage: 'Edit search query',
		description: 'Tooltip of button to edit a card into a datasource',
	},
	datasourceAppearanceTitle: {
		id: 'fabric.editor.datasourceAppearanceTitle',
		defaultMessage: 'List',
		description: 'Tooltip of button to change to datasource appearance',
	},
	datasourceJiraIssue: {
		id: 'fabric.editor.datasource.jiraIssue',
		defaultMessage: 'Jira Issues',
		description: 'Insert a jira datasource table',
	},
	datasourceJiraIssueDescription: {
		id: 'fabric.editor.datasource.jiraIssue.description',
		defaultMessage:
			'Insert Jira issues from Jira Cloud with enhanced search, filtering, and configuration.',
		description: 'Insert a jira datasource table',
	},
	datasourceAssetsObjectsGeneralAvailability: {
		id: 'fabric.editor.datasource.assetsObjectsGeneralAvailability',
		defaultMessage: 'Assets',
		description:
			'Text displayed when selecting the type of data to include onto the page, in this case: JSM Assets objects.',
	},
	datasourceAssetsObjectsDescription: {
		id: 'fabric.editor.datasource.assetsObjects.description',
		defaultMessage:
			'Insert objects from Assets in Jira Service Management with search and filtering',
		description:
			'Description text displayed when selecting the type of data to include onto the page, in this case: JSM Assets objects',
	},
	inlineOverlay: {
		id: 'fabric.editor.inlineOverlay',
		defaultMessage: 'Configure',
		description:
			'An overlay shown when hover over inline smart link to inform user that they can click the link to edit the links appearance.',
	},
	inlineConfigureLink: {
		id: 'fabric.editor.inlineConfigureLink',
		defaultMessage: 'Configure link',
		description:
			'An icon shown when hovering over inline smart link to inform user they can click the icon to configure the links appearance.',
	},
	inlineGoToLink: {
		id: 'fabric.editor.inlineGoToLink',
		defaultMessage: 'Go to link',
		description:
			'An option in the configure link dropdown that informs the user they can click the option to open the link',
	},
	datasourceConfluenceSearch: {
		id: 'fabric.editor.datasource.confluenceSearch',
		defaultMessage: 'Insert Confluence list',
		description: 'Title shown for Confluence Search datasource on QuickInsert options',
	},
	datasourceConfluenceSearchDescription: {
		id: 'fabric.editor.datasource.confluenceSearch.description',
		defaultMessage:
			'Insert list of search results from Confluence with enhanced search, filtering, and configuration.',
		description:
			'Description text displayed when selecting the type of data to include onto the page, in this case: Confluence Search objects',
	},
	datasourceJiraIssueIssueTermRefresh: {
		id: 'fabric.editor.datasource.jiraIssue.issue-term-refresh',
		defaultMessage: 'Jira Work Items',
		description: 'Insert a jira datasource table (Issue Terminology Refresh)',
	},
	datasourceJiraIssueDescriptionIssueTermRefresh: {
		id: 'fabric.editor.datasource.jiraIssue.description.issue-term-refresh',
		defaultMessage:
			'Insert Jira work items from Jira Cloud with enhanced search, filtering, and configuration.',
		description: 'Insert a jira datasource table (Issue Terminology Refresh)',
	},
});
