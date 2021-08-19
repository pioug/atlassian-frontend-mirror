import { uuid } from '@atlaskit/adf-schema';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  layoutColumn,
  layoutSection,
  p,
  table,
  taskItem,
  taskList,
  td,
  tr,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  buildKeyEvent,
  testKeymap,
} from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { MockMentionResource } from '@atlaskit/util-data-test/mock-mention-resource';

import { keymapPlugin } from '../../../../../plugins/tasks-and-decisions/pm-plugins/keymaps';

import { ListTypes } from './_helpers';

describe('tasks and decisions - keymaps', () => {
  const createEditor = createEditorFactory();
  const editorProps = {
    allowAnalyticsGASV3: true,
    allowTables: true,
    allowTasksAndDecisions: true,
    mentionProvider: Promise.resolve(new MockMentionResource({})),
    allowNestedTasks: true,

    allowLayouts: true,
  };

  let createAnalyticsEvent: CreateUIAnalyticsEvent = jest.fn(
    () => ({ fire() {} } as UIAnalyticsEvent),
  );

  beforeEach(() => {
    uuid.setStatic('local-uuid');
  });

  afterEach(() => {
    uuid.setStatic(false);
  });

  const editorFactory = (doc: DocBuilder) => {
    return createEditor({
      doc,
      editorProps,
      createAnalyticsEvent,
    });
  };

  describe.each(ListTypes)('%s', (name, list, item, listProps, itemProps) => {
    describe('Tab', () => {
      it('should do nothing on a first level list', () => {
        testKeymap(
          editorFactory,
          doc(list(listProps)(item(itemProps)('Hello{<>} World'))),
          doc(list(listProps)(item(itemProps)('Hello{<>} World'))),
          ['Tab'],
        );
      });
    });
  });

  // indentation-specific tests
  describe('action', () => {
    const listProps = { localId: 'local-uuid' };
    const itemProps = { localId: 'local-uuid', state: 'TODO' };

    describe('Tab', () => {
      it('should indent top level items following the first', () => {
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
              taskList(listProps)(
                taskItem(itemProps)('Say yall{<>} wanna live with the dream'),
              ),
            ),
          ),
          ['Tab'],
        );
      });

      it('can indent in a table', () => {
        testKeymap(
          editorFactory,
          doc(
            table({})(
              tr(
                td()(
                  taskList(listProps)(
                    taskItem(itemProps)('Hello World'),
                    taskItem(itemProps)(
                      'Say yall{<>} wanna live with the dream',
                    ),
                  ),
                ),
              ),
            ),
          ),
          doc(
            table({ localId: 'local-uuid' })(
              tr(
                td()(
                  taskList(listProps)(
                    taskItem(itemProps)('Hello World'),
                    taskList(listProps)(
                      taskItem(itemProps)(
                        'Say yall{<>} wanna live with the dream',
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),

          ['Tab'],
        );
      });

      it('can indent in a layout', () => {
        testKeymap(
          editorFactory,
          doc(
            layoutSection(
              layoutColumn({ width: 50 })(
                taskList(listProps)(
                  taskItem(itemProps)('Hello World'),
                  taskItem(itemProps)('Say yall{<>} wanna live with the dream'),
                ),
              ),
              layoutColumn({ width: 50 })(p()),
            ),
          ),
          doc(
            layoutSection(
              layoutColumn({ width: 50 })(
                taskList(listProps)(
                  taskItem(itemProps)('Hello World'),
                  taskList(listProps)(
                    taskItem(itemProps)(
                      'Say yall{<>} wanna live with the dream',
                    ),
                  ),
                ),
              ),
              layoutColumn({ width: 50 })(p()),
            ),
          ),

          ['Tab'],
        );
      });

      it('should not indent past parent', () => {
        const nestedDoc = doc(
          taskList(listProps)(
            taskItem(itemProps)('Level 1'),
            taskList(listProps)(taskItem(itemProps)('Level {<>}2')),
          ),
        );

        testKeymap(editorFactory, nestedDoc, nestedDoc, ['Tab']);
      });

      it('should not indent past parent, even with sibling', () => {
        const nestedDoc = doc(
          taskList(listProps)(
            taskItem(itemProps)('Level 1'),
            taskList(listProps)(
              taskItem(itemProps)('Level {<>}2'),
              taskItem(itemProps)('I am indentable, however'),
            ),
          ),
        );

        testKeymap(editorFactory, nestedDoc, nestedDoc, ['Tab']);
      });

      it('should not indent items past 6 levels', () => {
        const nestedDoc = doc(
          taskList(listProps)(
            taskItem(itemProps)('Level 1'),
            taskList(listProps)(
              taskItem(itemProps)('Level 2'),
              taskList(listProps)(
                taskItem(itemProps)('Level 3'),
                taskList(listProps)(
                  taskItem(itemProps)('Level 4'),
                  taskList(listProps)(
                    taskItem(itemProps)('Level 5'),
                    taskItem(itemProps)(
                      'See, my nose is wide, my blood is honey and my',
                    ),
                    taskList(listProps)(
                      taskItem(itemProps)(
                        'Say yall{<>} wanna live with the dream',
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        );

        testKeymap(editorFactory, nestedDoc, nestedDoc, ['Tab']);
      });

      it('cannot wrap children past 6 levels', () => {
        const nestedDoc = doc(
          taskList(listProps)(
            taskItem(itemProps)('The first item in the list'),
            taskItem(itemProps)('{<>}Level 1'),
            taskList(listProps)(
              taskItem(itemProps)('Level 2'),
              taskList(listProps)(
                taskItem(itemProps)('Level 3'),
                taskList(listProps)(
                  taskItem(itemProps)('Level 4'),
                  taskList(listProps)(
                    taskItem(itemProps)('Level 5'),
                    taskItem(itemProps)(
                      'See, my nose is wide, my blood is honey and my',
                    ),
                    taskList(listProps)(
                      taskItem(itemProps)('Say yall wanna live with the dream'),
                    ),
                  ),
                ),
              ),
            ),
          ),
        );

        testKeymap(editorFactory, nestedDoc, nestedDoc, ['Tab']);
      });

      it('will not indent a range that includes a max-indented task', () => {
        const nestedDoc = doc(
          taskList(listProps)(
            taskItem(itemProps)('The first item in the list'),
            taskItem(itemProps)('Level 1'),
            taskList(listProps)(
              taskItem(itemProps)('Level 2'),
              taskList(listProps)(
                taskItem(itemProps)('Level 3'),
                taskList(listProps)(
                  taskItem(itemProps)('Level 4'),
                  taskList(listProps)(
                    taskItem(itemProps)('Level{<} 5'),
                    taskItem(itemProps)(
                      'See, my nose is wide, my blood is honey and my',
                    ),
                    taskList(listProps)(taskItem(itemProps)('Level{>} 6')),
                  ),
                ),
              ),
            ),
          ),
        );

        testKeymap(editorFactory, nestedDoc, nestedDoc, ['Tab']);
      });

      it('will indent even if siblings have subtree nested fully', () => {
        const nestedListFollowing = [
          taskItem(itemProps)('Level 1'),
          taskList(listProps)(
            taskItem(itemProps)('Level 2'),
            taskList(listProps)(
              taskItem(itemProps)('Level 3'),
              taskList(listProps)(
                taskItem(itemProps)('Level 4'),
                taskList(listProps)(
                  taskItem(itemProps)('Level 5'),
                  taskItem(itemProps)(
                    'See, my nose is wide, my blood is honey and my',
                  ),
                  taskList(listProps)(taskItem(itemProps)('Level 6')),
                ),
              ),
            ),
          ),
        ];

        testKeymap(
          editorFactory,
          doc(
            taskList(listProps)(
              taskItem(itemProps)('The first item in the list'),
              taskItem(itemProps)('I should be able to be indented{<>}'),
              ...nestedListFollowing,
            ),
          ),
          doc(
            taskList(listProps)(
              taskItem(itemProps)('The first item in the list'),
              taskList(listProps)(
                taskItem(itemProps)('I should be able to be indented{<>}'),
              ),
              ...nestedListFollowing,
            ),
          ),
          ['Tab'],
        );
      });

      it('can indent multiple tasks at same level', () => {
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
                taskList(listProps)(
                  taskItem(itemProps)(
                    "Ay-ya, ya'll never been {<}with the team",
                  ),
                  taskItem(itemProps)('Ay-ya, ya-ya-ya{>}, ya-ya-ya'),
                ),
                taskItem(itemProps)("Say ya'll wanna roll in the scene"),
              ),
            ),
          ),
          ['Tab'],
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

  describe('consumeTabs', () => {
    const tab = buildKeyEvent('Tab');
    const shiftTab = buildKeyEvent('Shift-Tab');

    const insideAction = doc(
      taskList({ localId: 'local-uuid' })(
        taskItem({ localId: 'local-uuid', state: 'TODO' })('yum{<>}'),
      ),

      p('hello'),
    );

    const outsideAction = doc(
      taskList({ localId: 'local-uuid' })(
        taskItem({ localId: 'local-uuid', state: 'TODO' })('yum'),
      ),

      p('hello{<>}'),
    );

    it('eats tabs inside actions', () => {
      const { editorView } = createEditor({
        doc: insideAction,
        editorProps,
      });

      const plugin = keymapPlugin(editorView.state.schema, undefined, true)!;
      expect(plugin.props.handleKeyDown!(editorView, tab)).toBe(true);
    });

    it('eats shift-tabs inside actions', () => {
      const { editorView } = createEditor({
        doc: insideAction,
        editorProps,
      });

      const plugin = keymapPlugin(editorView.state.schema, undefined, true)!;
      expect(plugin.props.handleKeyDown!(editorView, shiftTab)).toBe(true);
    });

    it('does nothing with tab outside actions', () => {
      const { editorView } = createEditor({
        doc: outsideAction,
        editorProps,
      });

      const plugin = keymapPlugin(editorView.state.schema, undefined, true)!;
      expect(plugin.props.handleKeyDown!(editorView, tab)).toBe(false);
    });

    it('does nothing with shift-tab outside actions', () => {
      const { editorView } = createEditor({
        doc: outsideAction,
        editorProps,
      });

      const plugin = keymapPlugin(editorView.state.schema, undefined, true)!;
      expect(plugin.props.handleKeyDown!(editorView, shiftTab)).toBe(false);
    });
  });
});
