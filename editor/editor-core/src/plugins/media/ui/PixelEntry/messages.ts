import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
  validationFailedMessage: {
    id: 'fabric.editor.media.pixelEntry.validationFailedMessage',
    defaultMessage: 'Validation for width failed',
    description: 'The passed in validator function returned false',
  },
  inputWidthTooltip: {
    id: 'fabric.editor.media.pixelEntry.inputWidthTooltip',
    defaultMessage: 'Width',
    description: 'The tooltip displayed ontop of the width input',
  },
  inputWidthAriaLabel: {
    id: 'fabric.editor.media.pixelEntry.inputWidthAriaLabel',
    defaultMessage: 'width input',
    description: 'The width input aria label',
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
  migrationButtonText: {
    id: 'fabric.editor.media.pixelEntry.migrationButtonText',
    defaultMessage: 'Convert to pixels',
    description:
      'The text give to the button used to covert to pixels for legacy experience',
  },
  migrationButtonTooltip: {
    id: 'fabric.editor.media.pixelEntry.migrationButtonTooltip',
    defaultMessage: 'Migrate from percentage to fixed pixel sizing',
    description: 'The tooltip displayed on the migration button',
  },
});
