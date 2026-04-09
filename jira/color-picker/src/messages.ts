import { defineMessages } from 'react-intl-next';

const _default_1: {
    colorPickerAriaLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    };
    menuListAriaLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    };
} = defineMessages({
    colorPickerAriaLabel: {
        id: 'jira.color-picker.src.color-picker-aria-label',
        defaultMessage: '{color} selected, {message}',
        description: 'This text is used as aria-label text in color picker component',
    },
    menuListAriaLabel: {
        id: 'jira.color-picker.src.menu-list-aria-label',
        defaultMessage: 'Color picker list',
        description: 'This text is used as aria-label text for the listbox element in color picker component',
    },
});
export default _default_1;
