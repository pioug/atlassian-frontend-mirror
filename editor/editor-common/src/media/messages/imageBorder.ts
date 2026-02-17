import { defineMessages } from 'react-intl-next';

export const imageBorderMessages = defineMessages({
	borderColor: {
		id: 'fabric.editor.imageBorderColor',
		defaultMessage: 'Color',
		description: 'Change the border color of an image.',
	},
	borderColorDropdownAriaLabel: {
		id: 'fabric.editor.imageBorderColor.dropdownAriaLabel',
		defaultMessage: 'Image border options Color dropdown',
		description: 'ARIA label for the dropdown to change the border color of an image.',
	},
	borderSize: {
		id: 'fabric.editor.imageBorderSize',
		defaultMessage: 'Size',
		description: 'Change the border size of an image.',
	},
	borderSizeDropdownAriaLabel: {
		id: 'fabric.editor.imageBorderSize.dropdownAriaLabel',
		defaultMessage: 'Image border options Size dropdown',
		description: 'ARIA label for the dropdown to change the border size of an image.',
	},
	addBorder: {
		id: 'fabric.editor.addImageBorder',
		defaultMessage: 'Add border',
		description:
			'Label shown on a button in the image border options toolbar to add a border around the selected image.',
	},
	removeBorder: {
		id: 'fabric.editor.removeImageBorder',
		defaultMessage: 'Remove border',
		description:
			'The text is shown as a button label in the image toolbar. Removes any border that was previously applied to the selected image.',
	},
	borderOptions: {
		id: 'fabric.editor.imageBorderOptions',
		defaultMessage: 'Border options',
		description:
			'The text is shown as a panel or menu header. Provides users access to customize image borders including size and color options.',
	},
	borderSizeSubtle: {
		id: 'fabric.editor.imageBorderSubtle',
		defaultMessage: 'Subtle',
		description:
			'Label shown as a drop-down item in the image border size selector to apply a thin, subtle border around the image.',
	},
	borderSizeMedium: {
		id: 'fabric.editor.imageBorderMedium',
		defaultMessage: 'Medium',
		description:
			'Label shown as a drop-down item in the image border size selector to apply a medium-weight border around the image.',
	},
	borderSizeBold: {
		id: 'fabric.editor.imageBorderBold',
		defaultMessage: 'Bold',
		description:
			'Label shown as a drop-down item in the image border size selector to apply a thick, bold border around the image.',
	},
});
