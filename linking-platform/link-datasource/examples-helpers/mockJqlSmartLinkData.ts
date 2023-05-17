import { JsonLd } from 'json-ld-types';

import * as Image from './images.json';

export const mockJqlSmartLinkData = {
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
    data: {
      '@context': {
        '@vocab': 'https://www.w3.org/ns/activitystreams#',
        atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
        schema: 'http://schema.org/',
      },
      '@type': ['Document', 'Object'],
      generator: {
        '@id': 'https://www.atlassian.com/#Jira',
        '@type': 'Application',
        name: 'Jira',
      },
      name: `55 Issues`,
      summary: `JQL Query: '(text ~ "test*" OR summary ~ "test*") order by created DESC'`,
      url: `https://product-fabric.atlassian.net/issues/?jql=${encodeURI(
        '(text ~ "test*" OR summary ~ "test*") order by created DESC',
      )}`,
    },
    meta: {
      access: 'granted',
      auth: [],
      definitionId: 'jira-object-provider',
      category: 'object',
      product: 'jira',
      resourceType: 'jql',
      tenantId: `someCloudId-for-hello`,
      visibility: 'restricted',
      // ...(subproduct && { subproduct: subproduct }),
    },
    datasources: [
      {
        key: 'datasource-jira-issues',
        parameters: {
          cloudId: `someCloudId-for-hello`,
          jql: decodeURIComponent(
            '(text ~ "test*" OR summary ~ "test*") order by created DESC',
          ),
        },
      },
    ],
  } as JsonLd.Response,
};
