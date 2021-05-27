import { uuid } from '@atlaskit/adf-schema';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  taskItem,
  taskList,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { testKeymap } from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { MockMentionResource } from '@atlaskit/util-data-test/mock-mention-resource';

import { ListTypes } from './_helpers';

describe('tasks and decisions - keymaps', () => {
  const createEditor = createEditorFactory();

  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  beforeEach(() => {
    uuid.setStatic('local-uuid');
  });

  afterEach(() => {
    uuid.setStatic(false);
  });

  const editorProps = {
    allowAnalyticsGASV3: true,
    allowTables: true,
    allowTasksAndDecisions: true,
    mentionProvider: Promise.resolve(new MockMentionResource({})),
    allowNestedTasks: true,
  };

  createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
  const editorFactory = (doc: DocBuilder) => {
    return createEditor({
      doc,
      editorProps,
      createAnalyticsEvent,
    });
  };

  describe.each(ListTypes)('%s', (name, list, item, listProps, itemProps) => {
    describe('Shift-Tab', () => {
      it('should do nothing on a first level list', () => {
        testKeymap(
          editorFactory,
          doc(list(listProps)(item(itemProps)('Hello{<>} World'))),
          doc(list(listProps)(item(itemProps)('Hello{<>} World'))),
          ['Shift-Tab'],
        );
      });
    });
  });

  // indentation-specific tests
  describe('action', () => {
    const listProps = { localId: 'local-uuid' };
    const itemProps = { localId: 'local-uuid', state: 'TODO' };

    describe('Shift-Tab', () => {
      it('should do not unindent past first level', () => {
        testKeymap(
          editorFactory,
          doc(
            taskList(listProps)(
              taskItem(itemProps)('Hello World'),
              taskItem(itemProps)('Say yall{<>} wanna live with the dream'),
            ),
          ),
          doc(
            taskList(listProps)(
              taskItem(itemProps)('Hello World'),
              taskItem(itemProps)('Say yall{<>} wanna live with the dream'),
            ),
          ),
          ['Shift-Tab'],
        );
      });

      it('can unindent to first level, without sibling', () => {
        testKeymap(
          editorFactory,
          doc(
            taskList(listProps)(
              taskItem(itemProps)('Level 1'),
              taskList(listProps)(taskItem(itemProps)('Level {<>}2')),
            ),
          ),
          doc(
            taskList(listProps)(
              taskItem(itemProps)('Level 1'),
              taskItem(itemProps)('Level {<>}2'),
            ),
          ),
          ['Shift-Tab'],
        );
      });

      it('can unindent to first level, even with sibling', () => {
        testKeymap(
          editorFactory,
          doc(
            taskList(listProps)(
              taskItem(itemProps)('Level 1'),
              taskList(listProps)(
                taskItem(itemProps)('Level {<>}2'),
                taskItem(itemProps)('I am indentable, however'),
              ),
            ),
          ),
          doc(
            taskList(listProps)(
              taskItem(itemProps)('Level 1'),
              taskItem(itemProps)('Level {<>}2'),
              taskList(listProps)(
                taskItem(itemProps)('I am indentable, however'),
              ),
            ),
          ),
          ['Shift-Tab'],
        );
      });

      it('can unindent to end of first level', () => {
        testKeymap(
          editorFactory,
          doc(
            taskList(listProps)(
              taskItem(itemProps)('Level 1'),
              taskList(listProps)(
                taskItem(itemProps)('Level 2'),
                taskItem(itemProps)('I am {<>}indentable, however'),
              ),
            ),
          ),
          doc(
            taskList(listProps)(
              taskItem(itemProps)('Level 1'),
              taskList(listProps)(taskItem(itemProps)('Level 2')),
              taskItem(itemProps)('I am {<>}indentable, however'),
            ),
          ),
          ['Shift-Tab'],
        );
      });

      it('can unindent multiple tasks at same level', () => {
        testKeymap(
          editorFactory,
          doc(
            taskList(listProps)(
              taskItem(itemProps)("Say ya'll wanna roll in the scene"),
              taskList(listProps)(
                taskItem(itemProps)("Ya'll wanna live in the dream"),
                taskItem(itemProps)("Ay-ya, ya'll never been {<}with the team"),
                taskItem(itemProps)('Ay-ya, ya-ya-ya{>}, ya-ya-ya'),
                taskItem(itemProps)("Say ya'll wanna roll in the scene"),
              ),
            ),
          ),
          doc(
            taskList(listProps)(
              taskItem(itemProps)("Say ya'll wanna roll in the scene"),
              taskList(listProps)(
                taskItem(itemProps)("Ya'll wanna live in the dream"),
              ),
              taskItem(itemProps)("Ay-ya, ya'll never been {<}with the team"),
              taskItem(itemProps)('Ay-ya, ya-ya-ya{>}, ya-ya-ya'),
              taskList(listProps)(
                taskItem(itemProps)("Say ya'll wanna roll in the scene"),
              ),
            ),
          ),
          ['Shift-Tab'],
        );
      });

      it('should lift all child taskLists and taskItems', () => {
        testKeymap(
          editorFactory,
          doc(
            taskList(listProps)(
              taskItem(itemProps)('Top level'),
              taskList(listProps)(
                taskItem(itemProps)('Nested{<>} first'),
                taskList(listProps)(
                  taskItem(itemProps)('Nested second'),
                  taskList(listProps)(taskItem(itemProps)('Nested third')),
                ),
              ),
            ),
          ),
          doc(
            taskList(listProps)(
              taskItem(itemProps)('Top level'),
              taskItem(itemProps)('Nested{<>} first'),
              taskList(listProps)(
                taskItem(itemProps)('Nested second'),
                taskList(listProps)(taskItem(itemProps)('Nested third')),
              ),
            ),
          ),
          ['Shift-Tab'],
        );
      });

      it('should lift only selected taskItems maintaining children', () => {
        testKeymap(
          editorFactory,
          doc(
            taskList(listProps)(
              taskItem(itemProps)('Top level'),
              taskList(listProps)(
                taskItem(itemProps)('Nested{<>} first'),
                taskItem(itemProps)('Nested first but also second'),
                taskList(listProps)(
                  taskItem(itemProps)('Nested second'),
                  taskList(listProps)(taskItem(itemProps)('Nested third')),
                ),
              ),
            ),
          ),
          doc(
            taskList(listProps)(
              taskItem(itemProps)('Top level'),
              taskItem(itemProps)('Nested{<>} first'),
              taskList(listProps)(
                taskItem(itemProps)('Nested first but also second'),
                taskList(listProps)(
                  taskItem(itemProps)('Nested second'),
                  taskList(listProps)(taskItem(itemProps)('Nested third')),
                ),
              ),
            ),
          ),
          ['Shift-Tab'],
        );
      });

      it('should lift only selected taskItems lifting children', () => {
        testKeymap(
          editorFactory,
          doc(
            taskList(listProps)(
              taskItem(itemProps)('Top level'),
              taskList(listProps)(
                taskItem(itemProps)('Nested first'),
                taskItem(itemProps)('Nested{<>} first but also second'),
                taskList(listProps)(
                  taskItem(itemProps)('Nested second'),
                  taskList(listProps)(taskItem(itemProps)('Nested third')),
                ),
              ),
            ),
          ),
          doc(
            taskList(listProps)(
              taskItem(itemProps)('Top level'),
              taskList(listProps)(taskItem(itemProps)('Nested first')),
              taskItem(itemProps)('Nested{<>} first but also second'),
              taskList(listProps)(
                taskItem(itemProps)('Nested second'),
                taskList(listProps)(taskItem(itemProps)('Nested third')),
              ),
            ),
          ),
          ['Shift-Tab'],
        );
      });
    });
  });

  describe('allowNestedTasks', () => {
    let simpleFactory = (doc: DocBuilder) => {
      return createEditor({
        doc,
        editorProps: { ...editorProps, allowNestedTasks: false },
        createAnalyticsEvent,
      });
    };

    describe('action', () => {
      const listProps = { localId: 'local-uuid' };
      const itemProps = { localId: 'local-uuid', state: 'TODO' };

      describe('Tab', () => {
        it('does nothing without feature flag turned on', () => {
          const testDoc = doc(
            taskList(listProps)(
              taskItem(itemProps)('Hello World'),
              taskItem(itemProps)('Say yall{<>} wanna live with the dream'),
            ),
          );

          testKeymap(simpleFactory, testDoc, testDoc, ['Tab']);
        });
      });
    });
  });
});
