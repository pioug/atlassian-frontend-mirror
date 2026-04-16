import { defineMessages } from 'react-intl';

export const messages: {
	undo: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	redo: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	undo: {
		id: 'fabric.editor.undo',
		defaultMessage: 'Undo',
		description: 'Undo the previously performed action.',
	},
	redo: {
		id: 'fabric.editor.redo',
		defaultMessage: 'Redo',
		description: 'Redo the previously undone action.',
	},
});
