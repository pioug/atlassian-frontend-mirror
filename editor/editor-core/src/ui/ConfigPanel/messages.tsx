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
});
