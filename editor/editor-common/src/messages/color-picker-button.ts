import { defineMessages } from 'react-intl-next';

export const colorPickerButtonMessages: {
    colorPickerMenuLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    };
} = defineMessages({
	colorPickerMenuLabel: {
		id: 'fabric.editor.colorPicker.menuLabel',
		defaultMessage: 'Color picker menu',
		description: 'The label for the color picker menu popup window',
	},
});
