import { defineMessages } from 'react-intl-next';

export const modalMessages = defineMessages({
  cancelButtonText: {
    id: 'linkDataSource.assets.configmodal.cancelButtonText',
    description: 'Button text to close the modal with no changes being made',
    defaultMessage: 'Cancel',
  },
  insertIssuesButtonText: {
    id: 'linkDataSource.assets.configmodal.insertIssuesButtonText',
    description: 'Button text to insert the displayed content',
    defaultMessage:
      'Insert {objectsCount, plural, one {object} other {objects}}',
  },
  insertObjectsTitle: {
    id: 'linkDataSource.assets.configmodal.insertObjectsTitle',
    description:
      'Title for the Assets Objects Datasource config modal which prefixes a select picker',
    defaultMessage: 'Insert objects from',
  },
});
