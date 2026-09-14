import { defineMessages, type MessageDescriptor } from 'react-intl';

export const templateGalleryMessages: Record<string, MessageDescriptor> = defineMessages({
	blockTemplates: {
		id: 'editor-plugin-snippets.snippetsPlugin.blockTemplates',
		defaultMessage: 'Block templates',
		description: 'Label for the block templates submenu in the block menu',
	},
	browseTemplates: {
		id: 'editor-plugin-snippets.snippetsPlugin.browseTemplates',
		defaultMessage: 'Browse all templates',
		description: 'Label for the action that opens the block template gallery',
	},
	newLozenge: {
		id: 'editor-plugin-snippets.snippetsPlugin.newLozenge',
		defaultMessage: 'New',
		description: 'Lozenge label for the block templates menu item',
	},
	templateGalleryDescription: {
		id: 'editor-plugin-snippets.snippetsPlugin.templateGalleryDescription',
		defaultMessage: 'Create, discover, & insert block templates',
		description: 'Description for the block template gallery quick insert item',
	},
	templateGalleryTitle: {
		id: 'editor-plugin-snippets.snippetsPlugin.templateGalleryTitle',
		defaultMessage: 'Block Template Gallery',
		description: 'Title for the block template gallery quick insert item',
	},
});
