// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { runBlockNodeSelectionTestSuite } from '@atlaskit/editor-test-helpers/integration/selection';

runBlockNodeSelectionTestSuite({
  nodeName: 'taskList',
  editorOptions: { allowLists: true, allowTasksAndDecisions: true },
  selector: '.taskItemView-content-wrap',
  adfNode: {
    type: 'taskList',
    attrs: {
      localId: 'a948637d-d242-43fe-9659-ee54f2117004',
    },
    content: [
      {
        type: 'taskItem',
        attrs: {
          localId: '25583a2e-e540-408c-b23b-78f21d99c32e',
          state: 'TODO',
        },
        content: [],
      },
    ],
  },
  skipTests: {
    'Extend a selection from end of the document to the start when [block-node] is the first node':
      ['safari', 'chrome'],
    // Firefox cannot drag-select a task list with placeholder from the end of document if task list is at beginning
    'Click and drag from the end to start of the document to select [block-node] when [block-node] is the first node':
      ['firefox'],
  },
});
