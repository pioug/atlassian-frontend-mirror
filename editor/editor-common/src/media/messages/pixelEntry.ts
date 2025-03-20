import { defineMessages } from 'react-intl-next';

export const pixelEntryMessages = defineMessages({
	validationFailedMessage: {
		id: 'fabric.editor.media.pixelEntry.validationFailedMessage',
		defaultMessage: 'Validation for width failed',
		description: 'The passed in validator function returned false',
	},
	inputWidthTooltip: {
		id: 'fabric.editor.media.pixelEntry.inputWidthTooltip',
		defaultMessage: 'Max width {maxWidth}px',
		description: 'The tooltip displayed ontop of the width input',
	},
	inputWidthAriaLabel: {
		id: 'fabric.editor.media.pixelEntry.inputWidthAriaLabel',
		defaultMessage: 'Max width {maxWidth}px',
		description: 'The width input aria label',
	},
	inputWidthLabel: {
		id: 'fabric.editor.media.pixelEntry.inputWidthLabel',
		defaultMessage: 'Width',
		description: 'The label displayed next to the width input',
	},
	inputHeightTooltip: {
		id: 'fabric.editor.media.pixelEntry.inputHeightTooltip',
		defaultMessage: 'Height',
		description: 'The tooltip displayed ontop of the height input',
	},
	inputHeightAriaLabel: {
		id: 'fabric.editor.media.pixelEntry.inputHeightAriaLabel',
		defaultMessage: 'height input',
		description: 'The width input aria label',
	},
	submitButtonText: {
		id: 'fabric.editor.media.pixelEntry.submitButtonText',
		defaultMessage: 'Submit',
		description: 'The text give to the hidden submit button',
	},
	fullWidthLabel: {
		id: 'fabric.editor.image.fullWidthLabel',
		defaultMessage: 'Full-width',
		description: 'The media has reached its maximum width',
	},
	migrationButtonText: {
		id: 'fabric.editor.media.pixelEntry.migrationButtonText',
		defaultMessage: 'Convert to pixels',
		description: 'The text give to the button used to covert to pixels for legacy experience',
	},
	migrationButtonTooltip: {
		id: 'fabric.editor.media.pixelEntry.migrationButtonTooltip',
		defaultMessage: 'Migrate from percentage to fixed pixel sizing',
		description: 'The tooltip displayed on the migration button',
	},
	closePixelEntry: {
		id: 'fabric.editor.media.pixelEntry.closePixelEntry',
		defaultMessage: 'Close',
		description:
			'The text give to the close button used to close the pixel inputs and go back to main toolbar',
	},
});
