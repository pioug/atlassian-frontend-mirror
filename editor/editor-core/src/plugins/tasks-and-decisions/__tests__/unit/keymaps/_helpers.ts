import {
  decisionItem,
  decisionList,
  taskItem,
  taskList,
} from '@atlaskit/editor-test-helpers/doc-builder';

export type TestCase = [
  string,
  typeof taskList | typeof decisionList,
  typeof taskItem | typeof decisionItem,
  object,
  { localId?: string; state?: string },
  { localId?: string; state?: string }?,
];

export const ListTypes: TestCase[] = [
  [
    'action',
    taskList,
    taskItem,
    { localId: 'local-uuid' },
    { localId: 'local-uuid', state: 'TODO' },
    { localId: 'local-uuid', state: 'TODO' },
  ],
  [
    'action',
    taskList,
    taskItem,
    { localId: 'local-uuid' },
    { localId: 'local-uuid', state: 'DONE' },
    { localId: 'local-uuid', state: 'TODO' },
  ],
  [
    'decision',
    decisionList,
    decisionItem,
    { localId: 'local-uuid' },
    { localId: 'local-uuid' },
    { localId: 'local-uuid' },
  ],
];
