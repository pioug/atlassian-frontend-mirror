export default {
  data: {
    '@context': {
      '@vocab': 'https://www.w3.org/ns/activitystreams#',
      atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
      schema: 'http://schema.org/',
    },
    '@type': ['Document', 'atlassian:Template'],
    generator: {
      '@id': 'https://www.atlassian.com/#Confluence',
      '@type': 'Application',
      name: 'Confluence',
    },
    icon: undefined,
    name: 'templateName_4815162342',
    summary: 'Description for templateName_4815162342',
    'atlassian:titlePrefix': {
      '@type': 'atlassian:Emoji',
      text: '',
    },
    url: 'https://confluence-url/wiki/spaces/space-id/pages/page-id',
  },
  meta: {
    access: 'granted',
    auth: [],
    definitionId: 'confluence-object-provider',
    resourceType: 'template',
    visibility: 'restricted',
  },
};
