// Common Translations will live here
import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
	unorderedList: {
		id: 'fabric.editor.unorderedList',
		defaultMessage: 'Bullet list',
		description: 'A list with bullets. Also known as an “unordered” list',
	},
	unorderedListDescription: {
		id: 'fabric.editor.unorderedList.description',
		defaultMessage: 'Create an unordered list',
		description:
			'The text is shown as a description for the bullet list item in the quick insert menu when the user searches for formatting options.',
	},
	bulletedList: {
		id: 'fabric.editor.bulletedList',
		defaultMessage: 'Bulleted list',
		description: 'A list with bullets. Also known as an “unordered” list',
	},
	orderedList: {
		id: 'fabric.editor.orderedList',
		defaultMessage: 'Numbered list',
		description: 'A list with ordered items 1… 2… 3…',
	},
	orderedListDescription: {
		id: 'fabric.editor.orderedList.description',
		defaultMessage: 'Create an ordered list',
		description:
			'The text is shown as a description for the numbered list item in the quick insert menu when the user searches for formatting options.',
	},
	lists: {
		id: 'fabric.editor.lists',
		defaultMessage: 'Lists',
		description: 'Menu shows ordered/bullet list and unordered/numbered lists',
	},
	listsFormat: {
		id: 'fabric.editor.listsFormat',
		defaultMessage: 'List formatting',
		description: 'Aria label for the wrapper of list buttons',
	},
});
