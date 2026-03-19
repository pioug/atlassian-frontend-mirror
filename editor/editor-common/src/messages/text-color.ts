import { defineMessages } from 'react-intl-next';

export const textColorMessages: {
    textColor: {
        id: string;
        defaultMessage: string;
        description: string;
    }; textColorTooltip: {
        id: string;
        defaultMessage: string;
        description: string;
    }; textColorHighlightTooltip: {
        id: string;
        defaultMessage: string;
        description: string;
    };
} = defineMessages({
	textColor: {
		id: 'fabric.editor.textColor',
		defaultMessage: '{selectedColorName} Text color',
		description:
			'Label of menu that provides access to various colors of text. For example: green Text color, dark blue Text color',
	},
	textColorTooltip: {
		id: 'fabric.editor.textColorTooltip',
		defaultMessage: 'Text color',
		description: 'Toolip of menu that provides access to various colors of text.',
	},
	textColorHighlightTooltip: {
		id: 'fabric.editor.textColorHighlightTooltip',
		defaultMessage: 'Text and highlight color',
		description: 'Tooltip of menu that provides access to various colors of highlight.',
	},
});
