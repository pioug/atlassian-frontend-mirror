import fetchMock from 'fetch-mock/cjs/client';

import {
  DatasourceDataResponseItem,
  DatasourceResponseSchemaProperty,
  StatusType,
} from '@atlaskit/linking-types';

import {
  mockAutoCompleteData,
  mockJiraData,
  mockSiteData,
  mockSuggestionData,
} from './data';

export { mockAutoCompleteData, mockJiraData, mockSiteData, mockSuggestionData };

fetchMock.config.fallbackToNetwork = true;

interface FetchMockRequestDetails {
  body: string;
  credentials: string;
  headers: object;
  method: string;
}

const columns: DatasourceResponseSchemaProperty[] = [
  {
    key: 'id',
    title: '',
    type: 'string',
    isIdentity: true,
  },
  {
    key: 'key',
    title: 'Key',
    type: 'link',
  },
  {
    key: 'type',
    type: 'icon',
    title: 'Type',
  },
  {
    key: 'summary',
    title: 'Summary',
    type: 'link',
  },
  {
    key: 'assignee',
    title: 'Assignee',
    type: 'user',
  },
  {
    key: 'priority',
    title: 'P',
    type: 'icon',
  },
  {
    key: 'labels',
    title: 'Labels',
    type: 'tag',
    isList: true,
  },
  {
    key: 'status',
    title: 'Status for the each issue',
    type: 'status',
  },
  {
    key: 'created',
    title: 'Date of Creation for each issue',
    type: 'string',
  },
  {
    key: 'due',
    title: 'Due Date',
    type: 'string',
  },
  ...new Array<DatasourceResponseSchemaProperty>(100)
    .fill({
      key: 'due',
      title: 'Due Date',
      type: 'string',
    })
    .map((prop, i) => ({ ...prop, key: prop.key + i, title: prop.title + i })),
];

const initialVisibleColumnKeys: string[] = [
  // Order of actual columns is in different order is on purpose
  // To demonstrate that this list is a king
  'type',
  'key',
  'summary',
  'assignee',
  'priority',
  'labels',
  'status',
  'created',
];

const detailsResponse = {
  ari: 'ari:cloud:linking-platform:datasource/12e74246-a3f1-46c1-9fd9-8d952aa9f12f',
  id: '12e74246-a3f1-46c1-9fd9-8d952aa9f12f',
  name: 'JQL Datasource',
  description: 'Fetches Issues using JQL',
  parameters: [
    {
      key: 'cloudId',
      type: 'string',
      description: 'Cloud Id',
    },
    {
      key: 'jql',
      type: 'string',
      description: 'JQL query to retrieve list of issues',
    },
  ],
  schema: {
    properties: columns,
    defaultProperties: initialVisibleColumnKeys,
  },
};

const generateDataResponse = (
  cloudId: string = '',
  maxItems = 99,
  numberOfLoads = 0,
) => ({
  data: mockJiraData.data
    .slice(0, maxItems)
    .map((item): DatasourceDataResponseItem => {
      return {
        // Fake identifier attribute that is a primitive value.
        // Adding number of pages to make all issueNumbers unique
        id: {
          value: item.issueNumber + numberOfLoads,
        },
        type: {
          source: item.type.source,
          label: item.type.label,
        },
        key: {
          url: item.link,
          text: item.issueNumber + numberOfLoads,
          linkType: 'key',
        },
        summary: {
          url: item.link,
          text: `[${cloudId}] ${item.summary}`,
        },
        assignee: {
          displayName: item.assignee?.displayName,
          avatarSource: item.assignee?.source,
        },
        priority: {
          source: item.priority.source,
          label: item.priority.label,
        },
        status: {
          text: item.status.text,
          status: item.status.status as StatusType['value']['status'],
        },
        created: {
          value: item.created,
        },
        due: {
          value: item.due,
        },
        ...(item.labels?.length && {
          labels: item.labels?.map(label => ({ value: label })),
        }),
      };
    }),
  totalIssues: mockJiraData.totalIssues,
  nextPageCursor:
    numberOfLoads < 4 && maxItems > 1 ? 'c3RhcnRBdD01' : undefined,
});

let numberOfLoads = 0;

export const mockDatasourceFetchRequests = (datasourceId?: string | null) => {
  let datasourceMatcher = '[^/]+';
  if (datasourceId) {
    datasourceMatcher = datasourceId;
  }

  fetchMock.post(
    new RegExp(`object-resolver/datasource/${datasourceMatcher}/fetch/details`),
    async () => {
      return new Promise(resolve => resolve(detailsResponse));
    },
  );

  fetchMock.post(
    new RegExp(
      `/gateway/api/object-resolver/datasource/${datasourceMatcher}/fetch/data`,
    ),
    async (url: string, details: FetchMockRequestDetails) => {
      const requestBody = JSON.parse(details.body);
      const {
        parameters: { cloudId },
      } = requestBody;
      return new Promise(resolve => {
        const delay = numberOfLoads++ * 1000;
        setTimeout(() => {
          if (cloudId === '11111') {
            resolve(generateDataResponse(cloudId, 1, numberOfLoads));
          } else {
            resolve(generateDataResponse(cloudId, undefined, numberOfLoads));
          }
        }, delay);
      });
    },
  );

  fetchMock.post(/api\/available-sites/, async () => {
    return new Promise(resolve => {
      resolve({ sites: mockSiteData });
    });
  });

  fetchMock.get(
    /\/api\/ex\/jira\/.+\/\/rest\/api\/latest\/jql\/autocompletedata\/suggestions\?.+/,
    async () => {
      return new Promise(resolve => {
        const delay = 150;
        setTimeout(() => {
          resolve(mockSuggestionData);
        }, delay);
      });
    },
  );

  fetchMock.post(
    /\/api\/ex\/jira\/.+\/\/rest\/api\/latest\/jql\/autocompletedata/,
    async () => {
      return new Promise(resolve => {
        const delay = 150;
        setTimeout(() => {
          resolve(mockAutoCompleteData);
        }, delay);
      });
    },
  );
};
