import { defineMessages } from 'react-intl-next';

export default defineMessages({
	colorPickerAriaLabel: {
		id: 'jira.color-picker.src.color-picker-aria-label',
		defaultMessage: '{color} selected, {message}',
		description: 'This text is used as aria-label text in color picker component',
	},
	colorCardRadioItemLabel: {
		id: 'jira.color-picker.src.color-card-radio-item-label',
		defaultMessage: 'color option',
		description: 'This text is used as aria-label text in color card component for radio item',
	},
});
