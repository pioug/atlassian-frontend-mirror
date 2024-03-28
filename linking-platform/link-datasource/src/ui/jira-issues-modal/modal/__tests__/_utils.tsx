import React from 'react';

import { JQLEditor } from '@atlaskit/jql-editor';

import { setupFactory } from '../../../../common/__tests__/_utils';
import {
  JiraIssueDatasourceParameters,
  JiraIssuesDatasourceAdf,
} from '../../types';
import { JiraIssuesConfigModal } from '../index';

jest.mock('@atlaskit/jql-editor-autocomplete-rest', () => ({
  useAutocompleteProvider: jest
    .fn()
    .mockReturnValue('useAutocompleteProvider-call-result'),
}));

jest.mock('@atlaskit/jql-editor', () => ({
  JQLEditor: jest
    .fn()
    .mockReturnValue(<div data-testid={'mocked-jql-editor'}></div>),
}));

export const getDefaultParameters: () => JiraIssueDatasourceParameters =
  () => ({
    cloudId: '67899',
    jql: 'some-query',
  });

const getAdfOnInsert = (args: {
  cloudId?: string;
  jql?: string;
  properties?: JiraIssuesDatasourceAdf['attrs']['datasource']['views'][0]['properties'];
  jqlUrl?: string;
}) => {
  const adf: JiraIssuesDatasourceAdf = {
    type: 'blockCard',
    attrs: {
      url: args?.jqlUrl,
      datasource: {
        id: 'some-jira-datasource-id',
        parameters: {
          cloudId: args.cloudId || '67899',
          jql: args.jql || 'some-query',
        },
        views: [
          {
            type: 'table',
            properties: args.properties || {
              columns: [{ key: 'myColumn' }],
            },
          },
        ],
      },
    },
  };
  return adf;
};

const {
  setup,
  getAvailableSites,
  getDefaultHookState,
  getErrorHookState,
  getEmptyHookState,
  getInsertAnalyticPayload,
  getLoadingHookState,
  getSingleResponseItemHookState,
  getUnauthorisedHookState,
  IssueLikeDataTableView,
  useDatasourceTableState,
} = setupFactory(
  'jira',
  JiraIssuesConfigModal,
  getDefaultParameters,
  getAdfOnInsert,
);

export {
  setup,
  getAvailableSites,
  getDefaultHookState,
  getErrorHookState,
  getEmptyHookState,
  getInsertAnalyticPayload,
  getLoadingHookState,
  getSingleResponseItemHookState,
  getUnauthorisedHookState,
  IssueLikeDataTableView,
  useDatasourceTableState,
  JQLEditor,
};
