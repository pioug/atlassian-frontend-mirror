import { JsonLd } from 'json-ld-types';

import * as Image from './images.json';

export const mocks = {
  unauthorized: {
    meta: {
      access: 'unauthorized',
      visibility: 'restricted',
      auth: [{}],
    },
    data: {
      '@context': {
        '@vocab': 'https://www.w3.org/ns/activitystreams#',
        atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
        schema: 'http://schema.org/',
      },
      '@type': 'Object',
      generator: {
        '@type': 'Application',
        name: 'Asana',
        icon: {
          '@type': 'Image',
          url: Image.asana,
        },
      },
      url: 'https://some.url',
    },
  } as JsonLd.Response,
  resolved: {
    meta: {
      auth: [],
      visibility: 'restricted',
      access: 'granted',
      resourceType: 'issue',
    },
    data: {
      '@context': {
        '@vocab': 'https://www.w3.org/ns/activitystreams#',
        atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
        schema: 'http://schema.org/',
      },
      generator: {
        '@type': 'Application',
        '@id': 'https://www.atlassian.com/#Jira',
        name: 'Jira',
      },
      '@type': ['atlassian:Task', 'Object'],
      name: 'EDM-5941: Implement mapping between data type and visual component',
      tag: {
        '@type': 'Object',
        name: 'In Progress',
        appearance: 'inprogress',
      },
      taskType: {
        '@type': ['Object', 'atlassian:TaskType'],
        '@id': 'https://www.atlassian.com/#JiraCustomTaskType',
        name: 'Task',
        icon: {
          '@type': 'Image',
          url: Image.task,
        },
      },
      url: 'https://product-fabric.atlassian.net/browse/EDM-5941',
    },
  } as JsonLd.Response,
  notFound: {
    meta: {
      visibility: 'not_found',
      access: 'forbidden',
      auth: [],
      definitionId: 'd1',
      key: 'object-provider',
    },
    data: {
      '@context': {
        '@vocab': 'https://www.w3.org/ns/activitystreams#',
        atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
        schema: 'http://schema.org/',
      },
      '@type': 'Object',
      name: 'I love cheese',
      url: 'https://some.url',
    },
  } as JsonLd.Response,
  forbidden: {
    meta: {
      visibility: 'restricted',
      access: 'forbidden',
      auth: [
        {
          key: 'some-flow',
          displayName: 'Flow',
          url: 'https://outbound-auth/flow',
        },
      ],
      definitionId: 'd1',
      key: 'object-provider',
    },
    data: {
      '@context': {
        '@vocab': 'https://www.w3.org/ns/activitystreams#',
        atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
        schema: 'http://schema.org/',
      },
      '@type': 'Object',
      name: 'I love cheese',
      url: 'https://some.url',
    },
  } as JsonLd.Response,
  confluenceSearchResolved: {
    meta: {
      auth: [],
      definitionId: 'confluence-object-provider',
      product: 'confluence',
      visibility: 'restricted',
      access: 'granted',
      resourceType: 'search',
      objectId: 'text=searchsomething',
      tenantId: 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5',
      category: 'object',
      key: 'confluence-object-provider',
    },
    data: {
      '@context': {
        '@vocab': 'https://www.w3.org/ns/activitystreams#',
        atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
        schema: 'http://schema.org/',
      },
      generator: {
        '@type': 'Application',
        '@id': 'https://www.atlassian.com/#Confluence',
        name: 'Confluence',
        icon: {
          '@type': 'Image',
          url: 'https://cdn.bfldr.com/K3MHR9G8/at/hcwrtqnwvz33bn73b84ncpt5/confluence-mark-contained-gradient-blue.svg?auto=webp&format=png&width=320&height=320',
        },
      },
      '@type': ['Object'],
      url: 'https://pug.jira-dev.com/wiki/search?text=searchsomething',
      name: '55 Results',
      'atlassian:titlePrefix': {
        text: '',
        '@type': 'atlassian:Emoji',
      },
    },
    datasources: [
      {
        key: 'datasource-confluence-search',
        parameters: {
          searchString: 'searchsomething',
        },
        id: '768fc736-3af4-4a8f-b27e-203602bff8ca',
        ari: 'ari:cloud:linking-platform::datasource/768fc736-3af4-4a8f-b27e-203602bff8ca',
        description: 'For extracting a list of Confluence search results',
        name: 'Confluence search',
      },
    ],
  } as JsonLd.Response,
};
