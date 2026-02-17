import { defineMessages } from 'react-intl-next';

export const altTextMessages = defineMessages({
	altText: {
		id: 'fabric.editor.addAltText',
		defaultMessage: 'Alt text',
		description: 'Add an alt text for this image',
	},
	addAltText: {
		id: 'fabric.editor.addUpdatedAltText',
		defaultMessage: 'Add alt text',
		description: 'Add an alt text for this image',
	},
	editAltText: {
		id: 'fabric.editor.editAltText',
		defaultMessage: 'Edit alt text',
		description: 'Edit an alt text for this image',
	},
	back: {
		id: 'fabric.editor.closeAltTextEdit',
		defaultMessage: 'Back',
		description:
			'The text is shown on a button in the alt text editing toolbar for an image. When clicked, it closes the alt text editor and navigates the user back to the main media toolbar.',
	},
	clear: {
		id: 'fabric.editor.clearAltTextEdit',
		defaultMessage: 'Clear alt text',
		description:
			'The text is shown on a button in the alt text editing toolbar for an image. When clicked, it clears the current alt text value from the input field.',
	},
	placeholder: {
		id: 'fabric.editor.placeholderAltText',
		defaultMessage: 'Describe this image with alt text',
		description:
			'The text is shown as placeholder text inside the alt text input field for an image. It prompts the user to enter a description of the image for accessibility purposes.',
	},
	supportText: {
		id: 'fabric.editor.supportAltText',
		defaultMessage:
			'Alt text is useful for people using screen readers because of visual limitations.',
		description:
			'The text is shown as a help message below the alt text input field for an image. It informs users why providing alt text is important for accessibility and screen reader support.',
	},
	validationMessage: {
		id: 'fabric.editor.alttext.validation',
		defaultMessage: 'Please remove any special characters in alt text.',
		description: 'Please remove any special characters in alt text. ',
	},
});
