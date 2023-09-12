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
};
