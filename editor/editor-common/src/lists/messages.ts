// Common Translations will live here
import { defineMessages } from 'react-intl-next';

export const messages: {
    unorderedList: {
        id: string;
        defaultMessage: string;
        description: string;
    }; unorderedListDescription: {
        id: string;
        defaultMessage: string;
        description: string;
    }; orderedList: {
        id: string;
        defaultMessage: string;
        description: string;
    }; orderedListDescription: {
        id: string;
        defaultMessage: string;
        description: string;
    }; lists: {
        id: string;
        defaultMessage: string;
        description: string;
    };
} = defineMessages({
	unorderedList: {
		id: 'fabric.editor.unorderedList',
		defaultMessage: 'Bullet list',
		description: 'A list with bullets. Also known as an “unordered” list',
	},
	unorderedListDescription: {
		id: 'fabric.editor.unorderedList.description',
		defaultMessage: 'Create an unordered list',
		description:
			'The text is shown as a description for the bullet list option in the quick insert menu when the user searches for list formatting options.',
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
			'The text is shown as a description for the numbered list option in the quick insert menu when the user searches for list formatting options.',
	},
	lists: {
		id: 'fabric.editor.lists',
		defaultMessage: 'Lists',
		description: 'Menu shows ordered/bullet list and unordered/numbered lists',
	},
});
