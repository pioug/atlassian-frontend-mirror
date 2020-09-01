import { defineMessages, InjectedIntl, Messages } from 'react-intl';

export function getCategories(intl: InjectedIntl) {
  return [
    {
      title: intl.formatMessage(messages.all),
      name: 'all',
    },
    { title: intl.formatMessage(messages.formatting), name: 'formatting' },
    {
      title: intl.formatMessage(messages['confluence-content']),
      name: 'confluence-content',
    },
    { title: intl.formatMessage(messages.media), name: 'media' },
    { title: intl.formatMessage(messages.visuals), name: 'visuals' },
    { title: intl.formatMessage(messages.navigation), name: 'navigation' },
    {
      title: intl.formatMessage(messages['external-content']),
      name: 'external-content',
    },
    {
      title: intl.formatMessage(messages.communication),
      name: 'communication',
    },
    { title: intl.formatMessage(messages.reporting), name: 'reporting' },
    { title: intl.formatMessage(messages.admin), name: 'admin' },
    {
      title: intl.formatMessage(messages.development),
      name: 'development',
    },
  ];
}

const messages: Messages = defineMessages({
  all: {
    id: 'fabric.editor.elementbrowser.categorylist.category-all',
    defaultMessage: 'All',
    description: 'all',
  },
  formatting: {
    id: 'fabric.editor.elementbrowser.categorylist.category-formatting',
    defaultMessage: 'Formatting',
    description: 'formatting',
  },
  'confluence-content': {
    id: 'fabric.editor.elementbrowser.categorylist.category-confluence-content',
    defaultMessage: 'Confluence content',
    description: 'confluence-content',
  },
  media: {
    id: 'fabric.editor.elementbrowser.categorylist.category-media',
    defaultMessage: 'Media',
    description: 'media',
  },
  visuals: {
    id: 'fabric.editor.elementbrowser.categorylist.category-visuals',
    defaultMessage: 'Visuals & images',
    description: 'visuals',
  },
  navigation: {
    id: 'fabric.editor.elementbrowser.categorylist.category-navigation',
    defaultMessage: 'Navigation',
    description: 'navigation',
  },
  'external-content': {
    id: 'fabric.editor.elementbrowser.categorylist.category-external-content',
    defaultMessage: 'External content',
    description: 'external-content',
  },
  communication: {
    id: 'fabric.editor.elementbrowser.categorylist.category-communication',
    defaultMessage: 'Communication',
    description: 'communication',
  },
  reporting: {
    id: 'fabric.editor.elementbrowser.categorylist.category-reporting',
    defaultMessage: 'Reporting',
    description: 'reporting',
  },
  admin: {
    id: 'fabric.editor.elementbrowser.categorylist.category-admin',
    defaultMessage: 'Administration',
    description: 'admin',
  },
  development: {
    id: 'fabric.editor.elementbrowser.categorylist.category-development',
    defaultMessage: 'Development',
    description: 'development',
  },
});
