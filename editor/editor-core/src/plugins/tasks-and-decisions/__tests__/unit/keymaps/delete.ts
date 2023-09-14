import { uuid } from '@atlaskit/adf-schema';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  taskItem,
  taskList,
  decisionList,
  decisionItem,
} from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { testKeymap } from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { MockMentionResource } from '@atlaskit/util-data-test/mock-mention-resource';

import { ListTypes } from './_helpers';

describe('tasks and decisions - Delete & Control + d', () => {
  const createEditor = createEditorFactory();

  beforeEach(() => {
    uuid.setStatic('local-uuid');
  });

  afterEach(() => {
    uuid.setStatic(false);
  });

  const editorFactory = (doc: DocBuilder) => {
    return createEditor({
      doc,
      editorProps: {
        allowAnalyticsGASV3: true,
        allowTables: true,
        allowTasksAndDecisions: true,
        mentionProvider: Promise.resolve(new MockMentionResource({})),
        allowNestedTasks: true,
      },
    });
  };

  describe.each(ListTypes)(
    '%s list',
    (name, list, item, listProps, itemProps) => {
      describe(`when '${name} list' exists before paragraph`, () => {
        it('should remove empty paragraph when cursor on the last position of the last item', () => {
          testKeymap(
            editorFactory,
            doc(list(listProps)(item(itemProps)('Hello{<>}')), p('')),
            doc(list(listProps)(item(itemProps)('Hello{<>}'))),
            ['Delete'],
          );

          testKeymap(
            editorFactory,
            doc(list(listProps)(item(itemProps)('Hello{<>}')), p('')),
            doc(list(listProps)(item(itemProps)('Hello{<>}'))),
            ['Ctrl-d'],
          );
        });

        it('should join text from paragraph when cursor on the last position of the last item', () => {
          testKeymap(
            editorFactory,
            doc(list(listProps)(item(itemProps)('Hello{<>}')), p('line2')),
            doc(list(listProps)(item(itemProps)('Hello{<>}line2'))),
            ['Delete'],
          );

          testKeymap(
            editorFactory,
            doc(list(listProps)(item(itemProps)('Hello{<>}')), p('line2')),
            doc(list(listProps)(item(itemProps)('Hello{<>}line2'))),
            ['Ctrl-d'],
          );
        });
      });

      describe(`when '${name} list' exists after paragraph`, () => {
        it('should remove the empty paragraph and move list up', () => {
          testKeymap(
            editorFactory,
            doc(p('{<>}'), list(listProps)(item(itemProps)('Hello'))),
            doc(list(listProps)(item(itemProps)('{<>}Hello'))),
            ['Delete'],
          );
          testKeymap(
            editorFactory,
            doc(p('{<>}'), list(listProps)(item(itemProps)('Hello'))),
            doc(list(listProps)(item(itemProps)('{<>}Hello'))),
            ['Ctrl-d'],
          );
        });

        it('should join text from list item to paragraph when there is only one list item', () => {
          testKeymap(
            editorFactory,
            doc(
              p('this is on a paragraph{<>}'),
              list(listProps)(item(itemProps)('Hello')),
            ),
            doc(p('this is on a paragraph{<>}Hello')),
            ['Delete'],
          );
        });

        it('should not change positions when cursor is at end of text and the list contains more than one list item', () => {
          testKeymap(
            editorFactory,
            doc(
              p('this is on a paragraph{<>}'),
              list(listProps)(
                item(itemProps)('Hello'),
                item(itemProps)('another hello'),
              ),
            ),
            doc(
              p('this is on a paragraph{<>}'),
              list(listProps)(
                item(itemProps)('Hello'),
                item(itemProps)('another hello'),
              ),
            ),
            ['Delete'],
          );

          testKeymap(
            editorFactory,
            doc(
              p('this is on a paragraph{<>}'),
              list(listProps)(
                item(itemProps)('Hello'),
                item(itemProps)('another hello'),
              ),
            ),
            doc(
              p('this is on a paragraph{<>}'),
              list(listProps)(
                item(itemProps)('Hello'),
                item(itemProps)('another hello'),
              ),
            ),
            ['Ctrl-d'],
          );
        });
      });

      describe(`when cursor is at the end of '${name} item'`, () => {
        it('should convert item to paragraph, splitting the list', () => {
          testKeymap(
            editorFactory,
            doc(
              list(listProps)(
                item(itemProps)('Hello{<>}'),
                item(itemProps)('World'),
                item(itemProps)('Cheese is great!'),
              ),
            ),
            doc(
              list(listProps)(item(itemProps)('Hello{<>}')),
              p('World'),
              list(listProps)(item(itemProps)('Cheese is great!')),
            ),
            ['Delete'],
          );
        });

        it('should merge two lists, when on an empty paragraph between two lists', () => {
          testKeymap(
            editorFactory,
            doc(
              list(listProps)(item(itemProps)('Hello')),
              p('{<>}'),
              list(listProps)(item(itemProps)('Cheese is great!')),
            ),
            doc(
              list(listProps)(
                item(itemProps)('Hello'),
                item(itemProps)('{<>}Cheese is great!'),
              ),
            ),
            ['Delete'],
          );
        });
      });
    },
  );

  // indentation and mixed nodes tests
  describe('action', () => {
    const listProps = { localId: 'local-uuid' };
    const itemProps = { localId: 'local-uuid', state: 'TODO' };

    it('should not touch following node if its different', () => {
      testKeymap(
        editorFactory,
        doc(
          taskList(listProps)(
            taskItem(itemProps)('Hello'),
            taskItem(itemProps)('Cheese is great!{<>}'),
          ),
          decisionList(listProps)(
            decisionItem(itemProps)('Im a decision item'),
            decisionItem(itemProps)('so am I!'),
          ),
        ),
        doc(
          taskList(listProps)(
            taskItem(itemProps)('Hello'),
            taskItem(itemProps)('Cheese is great!{<>}'),
          ),
          decisionList(listProps)(
            decisionItem(itemProps)('Im a decision item'),
            decisionItem(itemProps)('so am I!'),
          ),
        ),
        ['Delete'],
      );
    });

    it('lifts nested task one level', () => {
      testKeymap(
        editorFactory,
        doc(
          taskList(listProps)(
            taskItem(itemProps)('Top level{<>}'),
            taskList(listProps)(
              taskItem(itemProps)('Nested first'),
              taskItem(itemProps)('Nested first but also second'),
              taskList(listProps)(
                taskItem(itemProps)('Nested second'),
                taskList(listProps)(
                  taskItem(itemProps)('Nested third'),
                  taskItem(itemProps)('Nested fourth'),
                ),
              ),
            ),
          ),
        ),
        doc(
          taskList(listProps)(
            taskItem(itemProps)('Top level{<>}'),
            taskItem(itemProps)('Nested first'),
            taskItem(itemProps)('Nested first but also second'),
            taskList(listProps)(
              taskItem(itemProps)('Nested second'),
              taskList(listProps)(
                taskItem(itemProps)('Nested third'),
                taskItem(itemProps)('Nested fourth'),
              ),
            ),
          ),
        ),
        ['Delete'],
      );
    });

    it('joins to previous list after forward delete twice', () => {
      testKeymap(
        editorFactory,
        doc(
          taskList(listProps)(
            taskItem(itemProps)('Top level{<>}'),
            taskItem(itemProps)('Now doc level'),
            taskList(listProps)(
              taskItem(itemProps)('Nested first but also second'),
              taskList(listProps)(
                taskItem(itemProps)('Nested second'),
                taskList(listProps)(
                  taskItem(itemProps)('Nested third'),
                  taskItem(itemProps)('Nested fourth'),
                ),
              ),
            ),
          ),
        ),
        doc(
          taskList(listProps)(
            taskItem(itemProps)('Top level{<>}Now doc level'),
            taskItem(itemProps)('Nested first but also second'),
            taskList(listProps)(
              taskItem(itemProps)('Nested second'),
              taskList(listProps)(
                taskItem(itemProps)('Nested third'),
                taskItem(itemProps)('Nested fourth'),
              ),
            ),
          ),
        ),
        ['Delete', 'Delete'],
      );
    });

    it('unindents and lifts all nested tasks up', () => {
      testKeymap(
        editorFactory,
        doc(
          taskList(listProps)(
            taskItem(itemProps)('Top level'),
            taskItem(itemProps)('Now doc level{<>}'),
            taskList(listProps)(
              taskItem(itemProps)('Nested first but also second'),
              taskList(listProps)(
                taskItem(itemProps)('Nested second'),
                taskList(listProps)(
                  taskItem(itemProps)('Nested third'),
                  taskItem(itemProps)('Nested fourth'),
                ),
              ),
            ),
          ),
        ),
        doc(
          taskList(listProps)(
            taskItem(itemProps)('Top level'),
            taskItem(itemProps)('Now doc level{<>}'),
            taskItem(itemProps)('Nested first but also second'),
            taskList(listProps)(
              taskItem(itemProps)('Nested second'),
              taskList(listProps)(
                taskItem(itemProps)('Nested third'),
                taskItem(itemProps)('Nested fourth'),
              ),
            ),
          ),
        ),
        ['Delete'],
      );
    });

    it('unindents and merges text for deeply nested', () => {
      testKeymap(
        editorFactory,
        doc(
          taskList(listProps)(
            taskItem(itemProps)('Top level'),
            taskItem(itemProps)('Now doc level'),
            taskList(listProps)(
              taskItem(itemProps)('Nested first but also second'),
              taskList(listProps)(
                taskItem(itemProps)('Nested second'),
                taskList(listProps)(
                  taskItem(itemProps)('Nested third{<>}'),
                  taskItem(itemProps)('Nested fourth'),
                ),
              ),
            ),
          ),
        ),
        doc(
          taskList(listProps)(
            taskItem(itemProps)('Top level'),
            taskItem(itemProps)('Now doc level'),
            taskList(listProps)(
              taskItem(itemProps)('Nested first but also second'),
              taskList(listProps)(
                taskItem(itemProps)('Nested second'),
                taskList(listProps)(taskItem(itemProps)('Nested third{<>}')),
                taskItem(itemProps)('Nested fourth'),
              ),
            ),
          ),
        ),
        ['Delete'],
      );
    });
  });
});
