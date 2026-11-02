import { defineMessages } from 'react-intl';

export const messages: {
	block: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	blockCardUnavailable: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	blockDescription: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	blockTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	card: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	datasourceAppearanceTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	datasourceAssetsObjectsDescription: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	datasourceAssetsObjectsGeneralAvailability: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	datasourceConfluenceList: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	datasourceConfluenceSearch: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	datasourceConfluenceSearchDescription: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	datasourceJiraIssue: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	datasourceJiraIssueDescription: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	datasourceJiraIssueDescriptionIssueTermRefresh: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	datasourceJiraIssueIssueTermRefresh: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	datasourceTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	displayOptionUnavailableInParentNode: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	editDropdownEditDatasourceTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	editDropdownEditLinkTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	editDropdownExpandIconLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	editDropdownTriggerTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	embed: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	embedDescription: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	embedTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	embedToBlockCardWarning: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	inline: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	inlineConfigureLink: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	inlineDescription: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	inlineGoToLink: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	inlineOverlay: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	inlineTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	link: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	openButtonTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	panelButtonTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	previewButtonTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	url: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	urlDescription: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	urlTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
} = defineMessages({
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
		description:
			'Label for a toolbar option that changes a smart link to display inline, showing only the link title as a compact inline element within the text.',
	},
	embed: {
		id: 'fabric.editor.displayEmbed',
		defaultMessage: 'Display embed',
		description:
			'Label for a toolbar option that changes a smart link to display as an embedded object, showing a rich preview of the linked content.',
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
		description:
			'Accessible label for an icon button in the smart link toolbar that expands a dropdown menu containing additional editing options for the link.',
	},
	editDropdownTriggerTitle: {
		id: 'fabric.editor.editDropdownTriggerTitle',
		defaultMessage: 'Edit',
		description: 'Text of a button to trigger opening an edit dropdown',
	},
	editDropdownEditLinkTitle: {
		id: 'fabric.editor.editDropdownEditLinkTitle',
		defaultMessage: 'Edit link',
		description:
			'Label for a button inside the smart link edit dropdown menu that opens the link editing interface to modify the URL or display text.',
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
		description:
			'Title shown as a quick insert option for adding a Jira Issues datasource table that displays live Jira issue data in the editor.',
	},
	datasourceJiraIssueDescription: {
		id: 'fabric.editor.datasource.jiraIssue.description',
		defaultMessage:
			'Insert Jira issues from Jira Cloud with enhanced search, filtering, and configuration.',
		description:
			'Description text shown beneath the Jira Issues option in the quick insert menu, explaining what data the datasource will display when inserted.',
	},
	datasourceAssetsObjectsGeneralAvailability: {
		id: 'fabric.editor.datasource.assetsObjectsGeneralAvailability',
		defaultMessage: 'Assets',
		description:
			'Text displayed when selecting the type of data to include onto the page, in this case: JSM Assets objects.',
	},
	datasourceAssetsObjectsDescription: {
		id: 'fabric.editor.datasource.assetsObjects.description',
		defaultMessage: 'Display filtered Assets objects',
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
	// Remove when cleaning up platform_editor_slash_command
	datasourceConfluenceSearch: {
		id: 'fabric.editor.datasource.confluenceSearch',
		defaultMessage: 'Insert Confluence list',
		description: 'Title shown for Confluence Search datasource on QuickInsert options',
	},
	datasourceConfluenceList: {
		id: 'fabric.editor.datasource.confluenceList',
		defaultMessage: 'Confluence list',
		description:
			'Title shown for Confluence Search datasource in the Data and charts section of the editor slash command menu',
	},
	datasourceConfluenceSearchDescription: {
		id: 'fabric.editor.datasource.confluenceSearch.description',
		defaultMessage: 'Display filtered Confluence search results',
		description:
			'Description text displayed when selecting the type of data to include onto the page, in this case: Confluence Search objects',
	},
	datasourceJiraIssueIssueTermRefresh: {
		id: 'fabric.editor.datasource.jiraIssue.issue-term-refresh',
		defaultMessage: 'Jira work items',
		description: 'Insert a jira datasource table (Issue Terminology Refresh)',
	},
	datasourceJiraIssueDescriptionIssueTermRefresh: {
		id: 'fabric.editor.datasource.jiraIssue.description.issue-term-refresh',
		defaultMessage: 'Display filtered Jira work items',
		description: 'Insert a jira datasource table (Issue Terminology Refresh)',
	},
});
