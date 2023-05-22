import type {
  DatasourceDataResponse,
  DatasourceResponse,
} from '@atlaskit/linking-types';

export const mockDatasourceDataResponse: DatasourceDataResponse = {
  totalIssues: 1234,
  data: [
    {
      id: { value: 'EDM-12' },
      description: { value: 'Design datasource feature' },
      createdAt: { value: '2023-01-22T01:30:00.000-05:00' },
      assigned: {
        displayName: 'Sasha',
      },
      status: {
        text: 'In Progress',
        status: 'inprogress',
      },
    },
    {
      id: { value: 'EDM-14' },
      description: { value: 'Implement datasource feature' },
      createdAt: { value: '2023-03-01T01:30:00.000-05:00' },
      assigned: {
        displayName: 'Hana',
      },
      status: {
        text: 'To Do',
        status: 'new',
      },
    },
    {
      id: { value: 'EDM-15' },
      description: { value: 'Add Jira Provider' },
      createdAt: { value: '2023-03-31T01:30:00.000-05:00' },
      assigned: {
        displayName: 'Princey',
      },
      status: {
        text: 'To Do',
        status: 'default',
      },
    },
    {
      id: { value: 'EDM-16' },
      description: { value: 'Plan team party' },
      createdAt: { value: '2023-05-01T01:30:00.000-05:00' },
      assigned: {
        displayName: 'Nidhin',
      },
      status: {
        text: 'Done',
        status: 'success',
      },
    },
  ],
  nextPageCursor: 'c3RhcnRBdD01',
};

export const mockDatasourceResponse: DatasourceResponse = {
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
    properties: [
      {
        key: 'id',
        title: '',
        type: 'string',
        isIdentity: true,
      },
      {
        key: 'issue',
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
    ],
    defaultProperties: [
      'type',
      'issue',
      'summary',
      'assignee',
      'priority',
      'labels',
      'status',
      'created',
    ],
  },
};
