import { uuid } from '@atlaskit/adf-schema';
import { uuid as uuidTable } from '@atlaskit/editor-tables';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { Node as PMNode } from 'prosemirror-model';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import {
  DocBuilder,
  doc,
  p,
  taskItem,
  taskList,
  panel,
  table,
  tr,
  thCursor,
  thEmpty,
  tdEmpty,
  expand,
  layoutSection,
  layoutColumn,
  decisionList,
  decisionItem,
  code_block,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import typeAheadPlugin from '../..';
import { EditorPlugin } from '../../../../types/editor-plugin';
import { getPluginState } from '../../utils';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import analyticsPlugin from '../../../analytics';
import tasksAndDecisionsPlugin from '../../../tasks-and-decisions';
import panelPlugin from '../../../panel';
import tablePlugin from '../../../table';
import expandPlugin from '../../../expand';
import layoutPlugin from '../../../layout';
import codeBlockPlugin from '../../../code-block';
import { createTable } from '@atlaskit/editor-tables/utils';
import type {
  TypeAheadHandler,
  TypeAheadItem,
  TypeAheadInsert,
} from '../../types';
import { insertTypeAheadItem } from '../../commands/insert-type-ahead-item';

let _queueMicrotask: any;
beforeAll(() => {
  _queueMicrotask = window.queueMicrotask;
  window.queueMicrotask = () => {};
});
afterAll(() => {
  window.queueMicrotask = _queueMicrotask;
});

const items: TypeAheadItem[] = [
  {
    title: 'Action item',
    createNode: (state: EditorState): PMNode => {
      return state.schema.nodes.taskList.createAndFill();
    },
  },
  {
    title: 'Decision',
    createNode: (state: EditorState): PMNode => {
      return state.schema.nodes.decisionList.createAndFill();
    },
  },
  {
    title: 'Panel',
    createNode: (state: EditorState): PMNode => {
      return state.schema.nodes.panel.createAndFill();
    },
  },
  {
    title: 'Expand',
    createNode: (state: EditorState): PMNode => {
      return state.schema.nodes.expand.createAndFill();
    },
  },
  {
    title: 'Code snippet',
    createNode: (state: EditorState): PMNode => {
      return state.schema.nodes.codeBlock.createAndFill();
    },
  },
  {
    title: 'Table',
    createNode: (state: EditorState): PMNode => {
      // table.createAndFill() only creates a 1x1 table
      return createTable({
        schema: state.schema,
      });
    },
  },
];
beforeAll(() => {
  uuid.setStatic('local-uuid');
  uuidTable.setStatic('local-uuid');
});

afterAll(() => {
  uuid.setStatic(false);
  uuidTable.setStatic(false);
});

describe('type-ahead', () => {
  const TRIGGER = '/';
  const QUERY = '';
  const insertItem = (editorView: EditorView, index: number = 0) => {
    const pluginState = getPluginState(editorView.state);
    insertTypeAheadItem(editorView)({
      item: items[index],
      handler: pluginState.triggerHandler!,
      mode: SelectItemMode.SELECTED,
      sourceListItem: items,
      query: QUERY,
    });
  };

  const createEditor = createProsemirrorEditorFactory();
  let typeAheadHandler: TypeAheadHandler;

  const editor = (doc: DocBuilder) => {
    const createAnalyticsEvent = jest.fn(
      () => ({ fire() {} } as UIAnalyticsEvent),
    );
    typeAheadHandler = {
      id: TypeAheadAvailableNodes.QUICK_INSERT,
      trigger: TRIGGER,
      getItems: jest.fn().mockReturnValue(Promise.resolve([])),
      selectItem: (
        state: EditorState,
        item: TypeAheadItem,
        insert: TypeAheadInsert,
      ) => {
        return insert(item.createNode(state));
      },
    };

    const fakeQuickInsertPlugin: () => EditorPlugin = () => ({
      name: 'fakePlugin',

      pluginsOptions: {
        typeAhead: typeAheadHandler,
      },
    });

    const preset = new Preset<LightEditorPlugin>()
      .add([analyticsPlugin, { createAnalyticsEvent }])
      .add([typeAheadPlugin, { createAnalyticsEvent }])
      .add(fakeQuickInsertPlugin)
      .add(tasksAndDecisionsPlugin)
      .add(panelPlugin)
      .add(expandPlugin)
      .add(codeBlockPlugin)
      .add(tablePlugin)
      .add(layoutPlugin);

    return createEditor({
      doc,
      preset,
    });
  };

  describe('when the typeahead item is inserted', () => {
    type TestCase = [
      string,
      {
        itemToInsert: string;
        scenario: DocBuilder;
        expectedResult: DocBuilder;
      },
    ];
    const case01: TestCase = [
      'inserting an action at the end of a paragraph with text',
      {
        itemToInsert: 'Action item',
        scenario: doc(
          // prettier-ignore
          p('text before {<>}'),
        ),
        expectedResult: doc(
          // prettier-ignore
          p('text before '),
          taskList({ localId: '' })(taskItem({ localId: '' })('{<>}')),
        ),
      },
    ];

    const case02: TestCase = [
      'inserting an action at the start of an empty paragraph following a paragraph with text',
      {
        itemToInsert: 'Action item',
        scenario: doc(
          // prettier-ignore
          p('text before'),
          p('{<>}'),
        ),
        expectedResult: doc(
          // prettier-ignore
          p('text before'),
          taskList({ localId: '' })(taskItem({ localId: '' })('{<>}')),
        ),
      },
    ];

    const case03: TestCase = [
      'inserting an action at the start of an empty paragraph following a paragraph with text inside a panel',
      {
        itemToInsert: 'Action item',
        scenario: doc(
          // prettier-ignore
          panel()(
            p('text before'),
            p('{<>}'),
          ),
        ),
        expectedResult: doc(
          // prettier-ignore
          panel()(
            p('text before'),
            p(''),
          ),
          taskList({ localId: '' })(taskItem({ localId: '' })('{<>}')),
        ),
      },
    ];

    const case04: TestCase = [
      'inserting an action at the start of an empty paragraph preceding a paragraph with text inside a panel',
      {
        itemToInsert: 'Action item',
        scenario: doc(
          // prettier-ignore
          panel()(
            p('{<>}'),
            p('text before'),
          ),
        ),
        expectedResult: doc(
          // prettier-ignore
          panel()(
            p(''),
            p('text before'),
          ),
          taskList({ localId: '' })(taskItem({ localId: '' })('{<>}')),
        ),
      },
    ];

    const case05: TestCase = [
      'inserting a table at the start of the document',
      {
        itemToInsert: 'Table',
        scenario: doc(
          // prettier-ignore
          p('{<>}'),
        ),
        expectedResult: doc(
          // prettier-ignore
          table({ localId: 'local-uuid' })(
            tr(thCursor, thEmpty, thEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
          ),
        ),
      },
    ];

    const case06: TestCase = [
      'inserting an action item inside another action item',
      {
        itemToInsert: 'Action item',
        scenario: doc(
          taskList({ localId: 'existing-task-list' })(
            taskItem({ localId: 'existing-task-item' })('{<>}'),
          ),
        ),
        expectedResult: doc(
          taskList({ localId: 'existing-task-list' })(
            taskItem({ localId: 'existing-task-item' })(),
            taskList({ localId: '' })(taskItem({ localId: '' })('{<>}')),
          ),
        ),
      },
    ];

    const case07: TestCase = [
      'inserting an action item at the start of an empty paragraph after an action list',
      {
        itemToInsert: 'Action item',
        scenario: doc(
          taskList({ localId: 'existing-task-list' })(
            taskItem({ localId: 'existing-task-item' })(),
          ),
          p('{<>}'),
        ),
        expectedResult: doc(
          taskList({ localId: 'existing-task-list' })(
            taskItem({ localId: 'existing-task-item' })(),
          ),
          taskList({ localId: '' })(taskItem({ localId: '' })('{<>}')),
        ),
      },
    ];

    const case08: TestCase = [
      'inserting a table inside an expand',
      {
        itemToInsert: 'Table',
        scenario: doc(expand({})(p('{<>}'))),
        expectedResult: doc(
          expand({})(
            table({ localId: 'local-uuid' })(
              tr(thCursor, thEmpty, thEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
            ),
          ),
        ),
      },
    ];

    const case09: TestCase = [
      'inserting a table inside a layout (first column)',
      {
        itemToInsert: 'Table',
        scenario: doc(
          layoutSection(
            layoutColumn({ width: 50 })(p('{<>}')),
            layoutColumn({ width: 50 })(p()),
          ),
        ),
        expectedResult: doc(
          layoutSection(
            layoutColumn({ width: 50 })(
              table({ localId: 'local-uuid' })(
                tr(thCursor, thEmpty, thEmpty),
                tr(tdEmpty, tdEmpty, tdEmpty),
                tr(tdEmpty, tdEmpty, tdEmpty),
              ),
            ),
            layoutColumn({ width: 50 })(p()),
          ),
        ),
      },
    ];

    const case10: TestCase = [
      'inserting a panel at the start of an empty paragraph following a paragraph with text',
      {
        itemToInsert: 'Panel',
        scenario: doc(
          // prettier-ignore
          p('text before'),
          p('{<>}'),
        ),
        expectedResult: doc(
          // prettier-ignore
          p('text before'),
          panel()(p('{<>}')),
        ),
      },
    ];

    const case11: TestCase = [
      'inserting a panel inside a layout (second column)',
      {
        itemToInsert: 'Panel',
        scenario: doc(
          layoutSection(
            layoutColumn({ width: 50 })(p()),
            layoutColumn({ width: 50 })(p('{<>}')),
          ),
        ),
        expectedResult: doc(
          layoutSection(
            layoutColumn({ width: 50 })(p()),
            layoutColumn({ width: 50 })(panel()(p('{<>}'))),
          ),
        ),
      },
    ];
    const case12: TestCase = [
      'inserting an action inside a layout (second column)',
      {
        itemToInsert: 'Action item',
        scenario: doc(
          layoutSection(
            layoutColumn({ width: 50 })(p()),
            layoutColumn({ width: 50 })(p('{<>}')),
          ),
        ),
        expectedResult: doc(
          layoutSection(
            layoutColumn({ width: 50 })(p()),
            layoutColumn({ width: 50 })(
              taskList({ localId: '' })(taskItem({ localId: '' })('{<>}')),
            ),
          ),
        ),
      },
    ];

    const case13: TestCase = [
      'inserting an expand at the start of an empty paragraph following a paragraph with text',
      {
        itemToInsert: 'Expand',
        scenario: doc(p('text before'), p('{<>}')),
        expectedResult: doc(p('text before'), expand()(p('{<>}'))),
      },
    ];

    const case14: TestCase = [
      'inserting a code snippet at the start of an empty paragraph following a paragraph with text',
      {
        itemToInsert: 'Code snippet',
        scenario: doc(p('text before'), p('{<>}')),
        expectedResult: doc(p('text before'), code_block({})('{<>}')),
      },
    ];

    const case15: TestCase = [
      'inserting a decision at the start of an empty paragraph following a paragraph with text',
      {
        itemToInsert: 'Decision',
        scenario: doc(p('text before'), p('{<>}')),
        expectedResult: doc(
          p('text before'),
          decisionList({ localId: '' })(decisionItem({ localId: '' })('{<>}')),
        ),
      },
    ];

    describe.each<TestCase>([
      // prettier-ignore
      case01,
      case02,
      case03,
      case04,
      case05,
      case06,
      case07,
      case08,
      case09,
      case10,
      case11,
      case12,
      case13,
      case14,
      case15,
    ])('[case%#] %s', (_description, testCase) => {
      it('should set the selection inside of the new node', () => {
        const { editorView } = editor(testCase.scenario);
        insertText(editorView, TRIGGER);

        const itemIndex = items.findIndex(
          (item) => item.title === testCase.itemToInsert,
        );
        insertItem(editorView, itemIndex);

        expect(editorView.state).toEqualDocumentAndSelection(
          testCase.expectedResult,
        );
      });
    });
  });
});
