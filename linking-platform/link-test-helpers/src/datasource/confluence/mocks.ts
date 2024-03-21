import {
  DatasourceDataResponseItem,
  DatasourceDetailsResponse,
} from '@atlaskit/linking-types';

import { GenerateDataResponse } from '../types';

import { mockConfluenceData } from './data';

const defaultDetailsResponse: DatasourceDetailsResponse = {
  meta: {
    destinationObjectTypes: [
      'page',
      'attachment',
      'blogpost',
      'space',
      'comment',
      'whiteboard',
      'database',
    ],
    auth: [],
    product: 'confluence',
    extensionKey: 'confluence-object-provider',
    visibility: 'restricted',
    access: 'granted',
  },
  data: {
    ari: 'ari:cloud:linking-platform::datasource/768fc736-3af4-4a8f-b27e-203602bff8ca',
    id: '768fc736-3af4-4a8f-b27e-203602bff8ca',
    name: 'Confluence Search',
    description: 'For extracting a list of Confluence search Objects',
    parameters: [
      {
        key: 'searchString',
        type: 'string',
        description: 'Query to search confluence objects',
      },
      {
        key: 'cloudId',
        type: 'string',
        description: 'CloudId of the site to search in',
      },
      {
        key: 'entityTypes',
        type: 'string',
        description: 'List of entitiy types to search for',
        isList: true,
      },
      {
        key: 'contentARIs',
        type: 'string',
        description: 'List of ARI of Confluence Object',
        isList: true,
      },
      {
        key: 'spaceKeys',
        type: 'string',
        description: 'Space keys from which the results are desired',
        isList: true,
      },
      {
        key: 'contributorAccountIds',
        type: 'string',
        description: 'AccountIds of the users',
        isList: true,
      },
      {
        key: 'labels',
        type: 'string',
        description: 'Labels which must be present on the result object',
        isList: true,
      },
      {
        key: 'ancestorPageIds',
        type: 'string',
        description: 'Ids of the pages which must be parent of the result',
        isList: true,
      },
      {
        key: 'containerStatus',
        type: 'string',
        description: 'Confluence object status',
      },
      {
        key: 'contentStatuses',
        type: 'string',
        description: 'Confluence document status',
        isList: true,
      },
      {
        key: 'creatorAccountIds',
        type: 'string',
        description: 'AccountIds of the users',
        isList: true,
      },
      {
        key: 'lastModified',
        type: 'string',
        description:
          'Represents a point in time, one of: today, yesterday, past7Days, past30Days, pastYear, custom',
      },
      {
        key: 'lastModifiedFrom',
        type: 'string',
        description: 'Date that a custom lastModified should be greater than',
      },
      {
        key: 'lastModifiedTo',
        type: 'string',
        description: 'Date that a custom lastModified should be less than',
      },
      {
        key: 'shouldMatchTitleOnly',
        type: 'boolean',
        description:
          'Search for only entities that have a title that contains the given query',
      },
    ],
    schema: {
      defaultProperties: [
        'type',
        'title',
        'description',
        'space',
        'status',
        'updatedBy',
      ],
      properties: [
        {
          key: 'type',
          title: 'Type',
          type: 'icon',
        },
        {
          key: 'title',
          title: 'Title',
          type: 'link',
        },
        {
          key: 'description',
          title: 'Description',
          type: 'string',
        },
        {
          key: 'space',
          title: 'Space',
          type: 'link',
        },
        {
          key: 'status',
          title: 'Status',
          type: 'status',
        },
        {
          key: 'updatedBy',
          title: 'Updated by',
          type: 'user',
        },
        {
          key: 'updatedAt',
          title: 'Updated at',
          type: 'datetime',
        },
        {
          key: 'createdBy',
          title: 'Created by',
          type: 'user',
        },
        {
          key: 'ownedBy',
          title: 'Owned by',
          type: 'user',
        },
        {
          key: 'versionNumber',
          title: 'Version number',
          type: 'number',
        },
        {
          key: 'createdAt',
          title: 'Created at',
          type: 'datetime',
        },
        {
          key: 'labels',
          title: 'Labels',
          type: 'tag',
          isList: true,
        },
      ],
    },
  },
};

export const generateDetailsResponse = (
  initialColumnKeys: string[],
): DatasourceDetailsResponse => ({
  ...defaultDetailsResponse,
  meta: {
    ...defaultDetailsResponse.meta,
    schema: {
      ...defaultDetailsResponse.meta.schema,
      defaultProperties: initialColumnKeys,
    },
  },
});

const maxItems = 99;

export const generateDataResponse: GenerateDataResponse = ({
  cloudId = '',
  numberOfLoads = 0,
  includeSchema,
  initialVisibleColumnKeys,
}) => {
  const schema = {
    properties: defaultDetailsResponse.data.schema.properties.filter(
      ({ key }) => initialVisibleColumnKeys.includes(key),
    ),
  };

  return {
    meta: {
      access: 'granted',
      auth: [],
      definitionId: 'object-resolver-service',
      destinationObjectTypes: [
        'page',
        'attachment',
        'blogpost',
        'space',
        'comment',
        'whiteboard',
        'database',
      ],
      key: 'confluence-object-provider',
      product: 'confluence',
      visibility: 'restricted',
    },
    data: {
      items: mockConfluenceData.data.slice(0, maxItems).map(
        (item, idx): DatasourceDataResponseItem => ({
          ...item,
          // Fake identifier attribute that is a primitive value.
          // Adding number of pages to make all issueNumbers unique
          id: {
            data: `${item.id.data}` + numberOfLoads,
          },
        }),
      ),
      totalCount: maxItems,
      nextPageCursor:
        numberOfLoads < 4 && maxItems > 1 ? 'c3RhcnRBdD01' : undefined,
      ...(includeSchema && { schema }),
    },
  };
};

const resolveConfluenceSearch = {
  body: {
    meta: {
      auth: [],
      definitionId: 'confluence-object-provider',
      product: 'confluence',
      visibility: 'granted',
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
      name: 'Confluence search with 0 results',
      'atlassian:titlePrefix': {
        text: '',
        '@type': 'atlassian:Emoji',
      },
    },
    datasources: [
      {
        key: 'datasource-confluence-search',
        parameters: {
          searchTerm: 'searchsomething',
        },
        id: '768fc736-3af4-4a8f-b27e-203602bff8ca',
        ari: 'ari:cloud:linking-platform::datasource/768fc736-3af4-4a8f-b27e-203602bff8ca',
        description: 'For extracting a list of Confluence search results',
        name: 'Confluence search',
      },
    ],
  },
  status: 200,
};

export const generateResolveResponse = (resourceUrl: string) => {
  const url = new URL(resourceUrl);
  if (url.search.includes('wiki/search?text=')) {
    return resolveConfluenceSearch;
  }
};

export const defaultInitialVisibleColumnKeys = [
  'createdBy',
  'id',
  'space',
  'status',
];
