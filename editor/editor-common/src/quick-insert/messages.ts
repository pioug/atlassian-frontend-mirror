import { defineMessages, type MessageDescriptor } from 'react-intl';

type Messages<Keys extends string> = Record<
	Keys,
	MessageDescriptor & { defaultMessage: string; id: string }
>;

export const messages: Messages<
	| 'admin'
	| 'AI'
	| 'all'
	| 'browse'
	| 'categoryBlockTemplates'
	| 'categoryDataAndCharts'
	| 'categoryEmbed'
	| 'categoryMedia'
	| 'categoryOther'
	| 'categoryRecommended'
	| 'categoryRovo'
	| 'categoryStructure'
	| 'categoryTextFormatting'
	| 'previewAttributionBy'
	| 'previewAttributionAtlassian'
	| 'previewAttributionAssets'
	| 'previewAttributionConfluence'
	| 'previewAttributionJira'
	| 'previewAttributionMicrosoft'
	| 'close'
	| 'communication'
	| 'confluence-content'
	| 'development'
	| 'external-content'
	| 'featuredWhiteboardDescription'
	| 'formatting'
	| 'help'
	| 'insert'
	| 'media'
	| 'navigation'
	| 'reporting'
	| 'visuals'
> = defineMessages({
	help: {
		id: 'fabric.editor.elementBrowser.help',
		defaultMessage: 'Help',
		description:
			'Button label shown in the element browser or quick insert menu. Opens help documentation for the element browser feature.',
	},
	insert: {
		id: 'fabric.editor.elementbrowser.modal.insert',
		defaultMessage: 'Insert',
		description:
			'Button label shown in the element browser modal dialog. Confirms and inserts the selected element into the document.',
	},
	close: {
		id: 'fabric.editor.elementbrowser.modal.close',
		defaultMessage: 'Close',
		description:
			'Button label shown in the element browser modal dialog. Closes the element browser without inserting any elements.',
	},
	all: {
		id: 'fabric.editor.elementbrowser.categorylist.category-all',
		defaultMessage: 'All',
		description:
			'Label for a category filter button in the element browser sidebar that displays all available elements when selected.',
	},
	formatting: {
		id: 'fabric.editor.elementbrowser.categorylist.category-formatting',
		defaultMessage: 'Formatting',
		description:
			'Label for a category filter button in the element browser sidebar that filters the list to show only formatting-related elements.',
	},
	'confluence-content': {
		id: 'fabric.editor.elementbrowser.categorylist.category-confluence-content',
		defaultMessage: 'Confluence content',
		description:
			'Label for a category filter button in the element browser sidebar that filters the list to show only Confluence content elements.',
	},
	media: {
		id: 'fabric.editor.elementbrowser.categorylist.category-media',
		defaultMessage: 'Media',
		description:
			'Label for a category filter button in the element browser sidebar that filters the list to show only media-related elements.',
	},
	visuals: {
		id: 'fabric.editor.elementbrowser.categorylist.category-visuals',
		defaultMessage: 'Visuals & images',
		description:
			'Label for a category filter button in the element browser sidebar that filters the list to show only visual and image elements.',
	},
	navigation: {
		id: 'fabric.editor.elementbrowser.categorylist.category-navigation',
		defaultMessage: 'Navigation',
		description:
			'Label for a category filter button in the element browser sidebar that filters the list to show only navigation-related elements.',
	},
	'external-content': {
		id: 'fabric.editor.elementbrowser.categorylist.category-external-content',
		defaultMessage: 'External content',
		description:
			'Label for a category filter button in the element browser sidebar that filters the list to show only external content elements.',
	},
	communication: {
		id: 'fabric.editor.elementbrowser.categorylist.category-communication',
		defaultMessage: 'Communication',
		description:
			'Label for a category filter button in the element browser sidebar that filters the list to show only communication-related elements.',
	},
	reporting: {
		id: 'fabric.editor.elementbrowser.categorylist.category-reporting',
		defaultMessage: 'Reporting',
		description:
			'Label for a category filter button in the element browser sidebar that filters the list to show only reporting-related elements.',
	},
	admin: {
		id: 'fabric.editor.elementbrowser.categorylist.category-admin',
		defaultMessage: 'Administration',
		description:
			'Label for a category filter button in the element browser sidebar that filters the list to show only administration-related elements.',
	},
	development: {
		id: 'fabric.editor.elementbrowser.categorylist.category-development',
		defaultMessage: 'Development',
		description:
			'Label for a category filter button in the element browser sidebar that filters the list to show only development-related elements.',
	},
	AI: {
		id: 'fabric.editor.elementbrowser.categorylist.category-ai',
		defaultMessage: 'Rovo',
		description:
			'Label for a category filter button in the element browser sidebar that filters the list to show only Rovo AI-powered elements.',
	},
	featuredWhiteboardDescription: {
		id: 'fabric.editor.elementbrowser.featured.whiteboard.description',
		defaultMessage: 'Use a whiteboard to add visuals to your page',
		description:
			'Featured description shown in the element browser. Promotes the whiteboard feature for adding visual content to pages.',
	},
	browse: {
		id: 'fabric.editor.elementbrowser.sidebar.heading',
		defaultMessage: 'Browse',
		description:
			'Heading text displayed at the top of the element browser sidebar where users can browse and filter available elements to insert.',
	},
	categoryRecommended: {
		id: 'editor-common.quick-insert.categoryRecommended',
		defaultMessage: 'Recommended',
		description: 'Recommended items in the Quick Insert menu.',
	},
	categoryStructure: {
		id: 'editor-common.quick-insert.categoryStructure',
		defaultMessage: 'Structure',
		description: 'Structure items in the Quick Insert menu.',
	},
	categoryMedia: {
		id: 'editor-common.quick-insert.categoryMedia',
		defaultMessage: 'Media',
		description: 'Media items in the Quick Insert menu.',
	},
	categoryEmbed: {
		id: 'editor-common.quick-insert.categoryEmbed',
		defaultMessage: 'Embed',
		description: 'Embed items in the Quick Insert menu.',
	},
	categoryTextFormatting: {
		id: 'editor-common.quick-insert.categoryTextFormatting',
		defaultMessage: 'Text formatting',
		description: 'Text formatting items in the Quick Insert menu.',
	},
	categoryRovo: {
		id: 'editor-common.quick-insert.categoryRovo',
		defaultMessage: 'Rovo',
		description: 'Rovo items in the Quick Insert menu.',
	},
	categoryDataAndCharts: {
		id: 'editor-common.quick-insert.categoryDataAndCharts',
		defaultMessage: 'Data and charts',
		description: 'Data and chart items in the Quick Insert menu.',
	},
	categoryBlockTemplates: {
		id: 'editor-common.quick-insert.categoryBlockTemplates',
		defaultMessage: 'Block templates',
		description: 'Block template items in the Quick Insert menu.',
	},
	categoryOther: {
		id: 'editor-common.quick-insert.categoryOther',
		defaultMessage: 'Other',
		description: 'Other items in the Quick Insert menu.',
	},
	previewAttributionBy: {
		id: 'editor-common.quick-insert.previewAttributionBy',
		defaultMessage: 'By {name}',
		description: 'Attribution shown in a Quick Insert item preview.',
	},
	previewAttributionAtlassian: {
		id: 'editor-common.quick-insert.previewAttributionAtlassian.ai-non-final',
		defaultMessage: 'Atlassian',
		description:
			'Atlassian company name shown as the creator in a slash-command preview attribution.',
	},
	previewAttributionAssets: {
		id: 'editor-common.quick-insert.previewAttributionAssets.ai-non-final',
		defaultMessage: 'Assets',
		description: 'Assets product name shown as the creator in a slash-command preview attribution.',
	},
	previewAttributionConfluence: {
		id: 'editor-common.quick-insert.previewAttributionConfluence.ai-non-final',
		defaultMessage: 'Confluence',
		description:
			'Confluence product name shown as the creator in a slash-command preview attribution.',
	},
	previewAttributionJira: {
		id: 'editor-common.quick-insert.previewAttributionJira.ai-non-final',
		defaultMessage: 'Jira',
		description: 'Jira product name shown as the creator in a slash-command preview attribution.',
	},
	previewAttributionMicrosoft: {
		id: 'editor-common.quick-insert.previewAttributionMicrosoft.ai-non-final',
		defaultMessage: 'Microsoft',
		description:
			'Microsoft company name shown as the creator in a slash-command preview attribution.',
	},
});
