// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { runBlockNodeSelectionTestSuite } from '@atlaskit/editor-test-helpers/integration/selection';

runBlockNodeSelectionTestSuite({
  nodeName: 'blockCard',
  selector: '.blockCardView-content-wrap',
  editorOptions: {
    smartLinks: {
      allowBlockCards: true,
      allowEmbeds: true,
    },
  },
  adfNode: {
    type: 'blockCard',
    attrs: {
      url: 'https://inlineCardTestUrl',
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
