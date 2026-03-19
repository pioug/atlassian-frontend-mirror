import { defineMessages } from 'react-intl-next';

export const messages: {
    indent: {
        id: string;
        defaultMessage: string;
        description: string;
    }; outdent: {
        id: string;
        defaultMessage: string;
        description: string;
    };
} = defineMessages({
	indent: {
		id: 'fabric.editor.indent',
		defaultMessage: 'Indent',
		description: 'Indent a list item, paragraph or heading',
	},
	outdent: {
		id: 'fabric.editor.outdent',
		defaultMessage: 'Outdent',
		description: 'Outdent a list item, paragraph or heading',
	},
});
