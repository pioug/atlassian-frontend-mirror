import fetchMock from 'fetch-mock/cjs/client';

import {
  DatasourceDataResponseItem,
  DatasourceResponseSchemaProperty,
  IconType,
  LinkType,
  StatusType,
  StringType,
  TagType,
  UserType,
} from '@atlaskit/linking-types';

import { mockJiraData } from './mockJiraData';

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
    title: 'Status',
    type: 'status',
  },
  {
    key: 'created',
    title: 'Created',
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

export const MOCK_DATASOURCE_ID = 'some-datasource-id';

interface FetchMockRequestDetails {
  body: string;
  credentials: string;
  headers: object;
  method: string;
}

export const setupDatasourcesMocks = (
  datasourceId: string = MOCK_DATASOURCE_ID,
) => {
  fetchMock.post(
    `/gateway/api/object-resolver/datasource/${datasourceId}/fetch/details`,
    async () =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve({
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
          });
        }, 300);
      }),
  );

  let numberOfLoads = 0;
  const getItems = (cloudId: string = '', maxItems = 99) => ({
    data: mockJiraData.data
      .slice(0, maxItems)
      .map((item): DatasourceDataResponseItem => {
        return {
          // Fake identifier attribute that needs to be flat primitive value.
          // Adding number of pages to make all issueNumbers unique
          id: (item.issueNumber + numberOfLoads) as StringType['value'],
          type: {
            source: item.type.source,
            label: item.type.label,
          } as IconType['value'],
          key: {
            url: item.link,
            text: item.issueNumber + numberOfLoads,
            linkType: 'key',
          } as LinkType['value'],
          summary: {
            url: item.link,
            text: `[${cloudId}] ${item.summary}`,
          } as LinkType['value'],
          assignee: {
            displayName: item.assignee?.displayName,
            avatarSource: item.assignee?.source,
          } as UserType['value'],
          priority: {
            source: item.priority.source,
            label: item.priority.label,
          } as IconType['value'],
          status: {
            text: item.status.text,
            status: item.status.status,
          } as StatusType['value'],
          created: item.created as StringType['value'],
          due: item.due as StringType['value'],
          labels: item.labels as TagType['value'][],
        };
      }),
    totalIssues: mockJiraData.totalIssues,
    nextPageCursor:
      numberOfLoads < 4 && maxItems > 1 ? 'c3RhcnRBdD01' : undefined,
  });

  fetchMock.post(
    `/gateway/api/object-resolver/datasource/${datasourceId}/fetch/data`,
    async (url: string, details: FetchMockRequestDetails) => {
      const requestBody = JSON.parse(details.body);
      const {
        parameters: { cloudId },
      } = requestBody;
      return new Promise(resolve => {
        setTimeout(() => {
          // special case to return only one item to show smart-card rendering path
          if (cloudId === '11111') {
            resolve(getItems(cloudId, 1));
            return;
          }
          resolve(getItems(cloudId));
        }, numberOfLoads++ * 1000);
      });
    },
  );
};

setupDatasourcesMocks();
