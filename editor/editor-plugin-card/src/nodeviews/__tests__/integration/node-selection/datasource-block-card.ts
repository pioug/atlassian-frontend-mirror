import { runBlockNodeSelectionTestSuite } from '@atlaskit/editor-test-helpers/integration/selection';
import { mockDatasourceFetchRequests } from '@atlaskit/link-test-helpers/datasource';

mockDatasourceFetchRequests();
runBlockNodeSelectionTestSuite({
  nodeName: 'blockCard',
  selector: '.datasourceView-content-wrap',
  editorOptions: {
    smartLinks: {
      allowBlockCards: true,
      allowEmbeds: true,
      allowDatasource: true,
    },
  },
  adfNode: {
    type: 'blockCard',
    attrs: {
      url: 'https://some-host.atlassian.net/jira/blah?jql=project=EDM',
      datasource: {
        id: 'mock-datasource-id',
        parameters: {
          cloudId: 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b',
          jql: 'project=EDM',
        },
        views: [
          {
            type: 'table',
            properties: {
              columns: [
                { key: 'key' },
                { key: 'type' },
                { key: 'summary' },
                { key: 'assignee' },
              ],
            },
          },
        ],
      },
    },
  },

  skipTests: {
    'Click and drag from the end to start of the document to select [block-node] when [block-node] is the first node':
      ['safari'],
    'Extend a selection from end of the document to the start when [block-node] is the first node':
      ['safari'],
    'Extend selection down one line to select [block-node] with shift + arrow down':
      ['safari'],
    'Extend selection up one line to select [block-node] with shift + arrow up':
      ['safari'],
    'Extend selection right two characters to select [block-node] from line above with shift + arrow right':
      ['safari'],

    // Skipped test https://product-fabric.atlassian.net/browse/ED-17199
    'Click and drag from start to end of document and select [block-node]': [
      'firefox',
    ],
  },
  editorPackage: 'editor-plugin-card',
});
