import { defineMessages } from 'react-intl-next';

export const messages: {
	help: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	insert: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	close: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	all: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	formatting: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	'confluence-content': {
		id: string;
		defaultMessage: string;
		description: string;
	};
	media: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	visuals: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	navigation: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	'external-content': {
		id: string;
		defaultMessage: string;
		description: string;
	};
	communication: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	reporting: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	admin: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	development: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	AI: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	featuredWhiteboardDescription: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	browse: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
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
});
