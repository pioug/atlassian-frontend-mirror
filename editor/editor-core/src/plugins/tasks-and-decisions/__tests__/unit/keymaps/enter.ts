import { uuid } from '@atlaskit/adf-schema';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  emoji,
  p,
  taskItem,
  taskList,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { compareSelection } from '@atlaskit/editor-test-helpers/selection';
import sendKeyToPm, {
  testKeymap,
} from '@atlaskit/editor-test-helpers/send-key-to-pm';

import { MockMentionResource } from '@atlaskit/util-data-test/mock-mention-resource';
import { grinEmoji } from '@atlaskit/util-data-test/emoji-samples';

import { emojiPluginKey } from '../../../../../plugins/emoji';
import { isEmptyTaskDecision } from '../../../../../plugins/tasks-and-decisions/pm-plugins/helpers';

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

  const editorFactory = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
    return createEditor({
      doc,
      editorProps: {
        allowAnalyticsGASV3: true,
        allowTables: true,
        allowTasksAndDecisions: true,
        mentionProvider: Promise.resolve(new MockMentionResource({})),
        allowNestedTasks: true,
        emojiProvider: new Promise(() => {}),
      },
      pluginKey: emojiPluginKey,
      createAnalyticsEvent,
    });
  };

  describe.each(ListTypes)(
    '%s',
    (name, list, item, listProps, itemProps, expetedNewItemProps) => {
      describe(`Enter ${
        itemProps.state ? `(with ${itemProps.state} state)` : ''
      }`, () => {
        describe(`when ${name}List is empty`, () => {
          it('should remove decisionList and replace with paragraph', () => {
            const { editorView } = editorFactory(
              doc(list(listProps)(item(itemProps)('{<>}'))),
            );

            sendKeyToPm(editorView, 'Enter');
            const expectedDoc = doc(p('{<>}'));
            expect(editorView.state.doc).toEqualDocument(expectedDoc);
            compareSelection(editorFactory, expectedDoc, editorView);
          });
        });

        describe(`when cursor is at the end of empty ${name}Item`, () => {
          it(`should remove ${name}Item and insert a paragraph after`, () => {
            const { editorView } = editorFactory(
              doc(
                p('before'),
                list(listProps)(
                  item(itemProps)('Hello World'),
                  item(expetedNewItemProps)('{<>}'),
                ),
                p('after'),
              ),
            );

            sendKeyToPm(editorView, 'Enter');

            const expectedDoc = doc(
              p('before'),
              list(listProps)(item(itemProps)('Hello World')),
              p('{<>}'),
              p('after'),
            );

            expect(editorView.state.doc).toEqualDocument(expectedDoc);
            compareSelection(editorFactory, expectedDoc, editorView);
          });

          it(`should remove ${name}Item and insert a paragraph before`, () => {
            const { editorView } = editorFactory(
              doc(
                p('before'),
                list(listProps)(
                  item(expetedNewItemProps)('{<>}'),
                  item(itemProps)('Hello World'),
                ),
                p('after'),
              ),
            );

            sendKeyToPm(editorView, 'Enter');

            const expectedDoc = doc(
              p('before'),
              p('{<>}'),
              list(listProps)(item(itemProps)('Hello World')),
              p('after'),
            );
            expect(editorView.state.doc).toEqualDocument(expectedDoc);
            compareSelection(editorFactory, expectedDoc, editorView);
          });

          it(`should split ${name}List and insert a paragraph when in middle`, () => {
            const { editorView } = editorFactory(
              doc(
                p('before'),
                list(listProps)(
                  item(itemProps)('Hello World'),
                  item(itemProps)('{<>}'),
                  item(itemProps)('Goodbye World'),
                ),
                p('after'),
              ),
            );

            sendKeyToPm(editorView, 'Enter');

            const expectedDoc = doc(
              p('before'),
              list(listProps)(item(itemProps)('Hello World')),
              p('{<>}'),
              list(listProps)(item(itemProps)('Goodbye World')),
              p('after'),
            );
            expect(editorView.state.doc).toEqualDocument(expectedDoc);
            compareSelection(editorFactory, expectedDoc, editorView);
          });
        });

        describe(`when cursor is at the end of non-empty ${name}Item`, () => {
          it(`should insert another ${name}Item`, () => {
            const { editorView } = editorFactory(
              doc(list(listProps)(item(itemProps)('Hello World{<>}'))),
            );

            sendKeyToPm(editorView, 'Enter');

            const expectedDoc = doc(
              list(listProps)(
                item(itemProps)('Hello World'),
                item(expetedNewItemProps)('{<>}'),
              ),
            );

            expect(editorView.state.doc).toEqualDocument(expectedDoc);
            compareSelection(editorFactory, expectedDoc, editorView);
          });

          it(`should not be an empty item when item contains non-text content only`, () => {
            const grin = grinEmoji();
            const grinEmojiId = {
              shortName: grin.shortName,
              id: grin.id,
              fallback: grin.fallback,
            };

            const { editorView } = editorFactory(
              doc(
                list(listProps)(item(itemProps)(emoji(grinEmojiId)(), '{<>}')),
              ),
            );

            expect(isEmptyTaskDecision(editorView.state)).toBeFalsy();
          });

          it(`should insert another ${name}Item when in middle of list`, () => {
            const { editorView } = editorFactory(
              doc(
                list(listProps)(
                  item(itemProps)('Hello World{<>}'),
                  item(itemProps)('Goodbye World'),
                ),
              ),
            );

            sendKeyToPm(editorView, 'Enter');

            const expectedDoc = doc(
              list(listProps)(
                item(itemProps)('Hello World'),
                item(expetedNewItemProps)('{<>}'),
                item(itemProps)('Goodbye World'),
              ),
            );

            expect(editorView.state.doc).toEqualDocument(expectedDoc);
            compareSelection(editorFactory, expectedDoc, editorView);
          });
        });

        describe(`when cursor is at the start of a non-empty ${name}Item`, () => {
          it(`should insert another ${name}Item above`, () => {
            const initialDoc = doc(
              list(listProps)(item(itemProps)('{<>}Hello World')),
            );
            const { editorView } = editorFactory(initialDoc);

            sendKeyToPm(editorView, 'Enter');

            expect(editorView.state).toEqualDocumentAndSelection(
              doc(
                list(listProps)(
                  item(expetedNewItemProps)(''),
                  item(itemProps)('{<>}Hello World'),
                ),
              ),
            );
          });
        });

        it(`should fire v3 analytics event when insert ${name}`, () => {
          const { editorView } = editorFactory(
            doc(list(listProps)(item(itemProps)('Hello World{<>}'))),
          );

          sendKeyToPm(editorView, 'Enter');

          expect(createAnalyticsEvent).toBeCalledWith({
            action: 'inserted',
            actionSubject: 'document',
            actionSubjectId: name,
            attributes: expect.objectContaining({ inputMethod: 'keyboard' }),
            eventType: 'track',
          });
        });
      });
    },
  );

  // indentation-specific tests
  describe('action', () => {
    const listProps = { localId: 'local-uuid' };
    const itemProps = { localId: 'local-uuid', state: 'TODO' };

    describe('Enter (within indentation)', () => {
      it('creates another taskItem at the currently nested level', () => {
        testKeymap(
          editorFactory,
          doc(
            taskList(listProps)(
              taskItem(itemProps)('Top level'),
              taskList(listProps)(taskItem(itemProps)('Nested one level{<>}')),
            ),
          ),

          doc(
            taskList(listProps)(
              taskItem(itemProps)('Top level'),
              taskList(listProps)(
                taskItem(itemProps)('Nested one level'),
                taskItem(itemProps)('{<>}'),
              ),
            ),
          ),

          ['Enter'],
        );
      });

      it('creates new taskItem in between nested taskItems', () => {
        testKeymap(
          editorFactory,
          doc(
            taskList(listProps)(
              taskItem(itemProps)('Top level'),
              taskList(listProps)(
                taskItem(itemProps)('Nested one level{<>}'),
                taskItem(itemProps)('Nested one level'),
              ),
            ),
          ),

          doc(
            taskList(listProps)(
              taskItem(itemProps)('Top level'),
              taskList(listProps)(
                taskItem(itemProps)('Nested one level'),
                taskItem(itemProps)('{<>}'),
                taskItem(itemProps)('Nested one level'),
              ),
            ),
          ),

          ['Enter'],
        );
      });

      it('unindents when the nested taskItem is empty', () => {
        testKeymap(
          editorFactory,
          doc(
            taskList(listProps)(
              taskItem(itemProps)('Top level'),
              taskList(listProps)(
                taskItem(itemProps)('Nested one level'),
                taskItem(itemProps)('{<>}'),
              ),
            ),
          ),

          doc(
            taskList(listProps)(
              taskItem(itemProps)('Top level'),
              taskList(listProps)(taskItem(itemProps)('Nested one level')),
              taskItem(itemProps)('{<>}'),
            ),
          ),

          ['Enter'],
        );
      });

      it('unindents taskItem nested between two others', () => {
        testKeymap(
          editorFactory,
          doc(
            taskList(listProps)(
              taskItem(itemProps)('Top level'),
              taskList(listProps)(
                taskItem(itemProps)('Nested one level'),
                taskItem(itemProps)('{<>}'),
                taskItem(itemProps)('Nested one level'),
              ),
            ),
          ),

          doc(
            taskList(listProps)(
              taskItem(itemProps)('Top level'),
              taskList(listProps)(taskItem(itemProps)('Nested one level')),
              taskItem(itemProps)('{<>}'),
              taskList(listProps)(taskItem(itemProps)('Nested one level')),
            ),
          ),

          ['Enter'],
        );
      });

      it('unindents taskItem and pulls nested with it', () => {
        testKeymap(
          editorFactory,
          doc(
            taskList(listProps)(
              taskItem(itemProps)('Top level'),
              taskList(listProps)(
                taskItem(itemProps)('Second level level'),
                taskList(listProps)(taskItem(itemProps)('Nested two level')),
                taskItem(itemProps)('{<>}'),
                taskList(listProps)(taskItem(itemProps)('Nested two level')),
              ),
            ),
          ),

          doc(
            taskList(listProps)(
              taskItem(itemProps)('Top level'),
              taskList(listProps)(
                taskItem(itemProps)('Second level level'),
                taskList(listProps)(taskItem(itemProps)('Nested two level')),
              ),
              taskItem(itemProps)('{<>}'),
              taskList(listProps)(taskItem(itemProps)('Nested two level')),
            ),
          ),

          ['Enter'],
        );
      });
    });
  });
});
