import { defineMessages } from 'react-intl';

export const companyHubTextColorMessages: {
	colorPickerTitle: {
		id: string;
		description: string;
		defaultMessage: string;
	};
} = defineMessages({
	colorPickerTitle: {
		id: 'company-hub-text-color.color-picker-dropdown.picker-title',
		description: 'Header of color picker dropdown for customizing text color of Company Hub',
		defaultMessage: 'Text Color',
	},
});
