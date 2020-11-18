import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  submit: {
    id: 'fabric.editor.configPanel.submit',
    defaultMessage: 'Submit',
    description: 'Submit button label',
  },
  cancel: {
    id: 'fabric.editor.configPanel.cancel',
    defaultMessage: 'Cancel',
    description: 'Cancel button label',
  },
  close: {
    id: 'fabric.editor.configPanel.close',
    defaultMessage: 'Close',
    description: 'Close button label',
  },
  required: {
    id: 'fabric.editor.configPanel.required',
    defaultMessage: 'Required field',
    description: 'Validation message for required field',
  },
  invalid: {
    id: 'fabric.editor.configPanel.invalid',
    defaultMessage: 'Invalid field',
    description: 'Validation message when a field value is not acceptable',
  },
  isMultipleAndRadio: {
    id: 'fabric.editor.configPanel.fieldTypeError.isMultipleAndRadio',
    defaultMessage: 'Can not combine isMultiple with style: radio',
    description: 'Configuration error',
  },
  addField: {
    id: 'fabric.editor.configPanel.formType.addField',
    defaultMessage: 'Add field',
    description: 'Button to add a new field in nested forms',
  },
  removeField: {
    id: 'fabric.editor.configPanel.formType.removeField',
    defaultMessage: 'Remove field',
    description: 'Button to remove a field in nested forms',
  },
  createOption: {
    id: 'fabric.editor.configPanel.customSelect.createOption',
    defaultMessage: 'Create',
    description: 'Create a new option for a select field',
  },
  documentation: {
    id: 'fabric.editor.configPanel.documentation',
    defaultMessage: 'Documentation',
    description: 'Label for the documentation link',
  },
  custom: {
    id: 'fabric.editor.configPanel.dateRange.option.custom',
    defaultMessage: 'Custom',
    description: 'Label for the option "Custom" in the date range UI element',
  },
  from: {
    id: 'fabric.editor.configPanel.dateRange.custom.from',
    defaultMessage: 'From',
    description:
      'Label for the initial date when the option "Custom" is selected in the date range UI element',
  },
  to: {
    id: 'fabric.editor.configPanel.dateRange.custom.to',
    defaultMessage: 'To',
    description:
      'Label for the end date when the option "Custom" is selected in the date range UI element',
  },
});
