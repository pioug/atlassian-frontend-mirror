import { defineMessages } from 'react-intl-next';

export const objectSchemaSelectMessages = defineMessages({
  label: {
    id: 'linkDataSource.assets.configModal.objectSchemaSelect.label',
    description:
      'Label text for a select input where users can choose an Assets object schema to use',
    defaultMessage: 'Select schema',
  },
  placeholder: {
    id: 'linkDataSource.assets.configModal.objectSchemaSelect.placeholder',
    description:
      'Placeholder text for a select input where users can choose an Assets object schema to use',
    defaultMessage: 'Select schema',
  },
  schemaRequired: {
    id: 'linkDataSource.assets.configModal.objectSchemaSelect.schemaRequired',
    description:
      'Validation message displayed to the user when the select is blank',
    defaultMessage: 'Schema is required',
  },
});
