import { defineMessages } from 'react-intl-next';
export const alignmentMessages: {
    alignment: {
        id: string;
        defaultMessage: string;
        description: string;
    }; alignLeft: {
        id: string;
        defaultMessage: string;
        description: string;
    }; alignCenter: {
        id: string;
        defaultMessage: string;
        description: string;
    }; alignRight: {
        id: string;
        defaultMessage: string;
        description: string;
    };
} = defineMessages({
	alignment: {
		id: 'fabric.editor.alignment',
		defaultMessage: 'Text alignment',
		description: 'Opens drop down menu of options to configure text alignment',
	},
	alignLeft: {
		id: 'fabric.editor.alignLeft',
		defaultMessage: 'Align left',
		description: 'label stating that text is aligned left',
	},
	alignCenter: {
		id: 'fabric.editor.alignCenter',
		defaultMessage: 'Align center',
		description: 'label stating that text is aligned center',
	},
	alignRight: {
		id: 'fabric.editor.alignRight',
		defaultMessage: 'Align right',
		description: 'label stating that text is aligned right',
	},
});
