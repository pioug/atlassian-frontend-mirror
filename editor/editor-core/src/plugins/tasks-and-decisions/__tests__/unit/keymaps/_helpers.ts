import {
  taskList,
  taskItem,
  decisionList,
  decisionItem,
} from '@atlaskit/editor-test-helpers/schema-builder';

export type TestCase = [
  string,
  typeof taskList | typeof decisionList,
  typeof taskItem | typeof decisionItem,
  object,
  object,
];

export const ListTypes: TestCase[] = [
  [
    'action',
    taskList,
    taskItem,
    { localId: 'local-uuid' },
    { localId: 'local-uuid', state: 'TODO' },
  ],
  [
    'decision',
    decisionList,
    decisionItem,
    { localId: 'local-uuid' },
    { localId: 'local-uuid' },
  ],
];
