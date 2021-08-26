import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import { DecorationSet, EditorView } from 'prosemirror-view';
import { TextSelection, EditorState } from 'prosemirror-state';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import { DocBuilder, doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import { undo, redo } from 'prosemirror-history';
import typeAheadPlugin from '../..';
import { EditorPlugin } from '../../../../types/editor-plugin';
import { getPluginState } from '../../utils';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import analyticsPlugin, {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  INPUT_METHOD,
} from '../../../analytics';
import { StatsModifier } from '../../stats-modifier';
import type {
  TypeAheadStatsModifier,
  TypeAheadHandler,
  TypeAheadItem,
  TypeAheadInsert,
} from '../../types';
import { closeTypeAhead } from '../../transforms/close-type-ahead';
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
    title: 'Earth',
  },
  {
    title: 'Earth 2',
  },
  {
    title: 'Earth 42',
  },
];
describe('type-ahead', () => {
  const TRIGGER = 'X';
  const QUERY = 'Eart';
  const insertItem = (
    editorView: EditorView,
    index: number = 0,
    mode: SelectItemMode = SelectItemMode.SELECTED,
  ) => {
    const pluginState = getPluginState(editorView.state);
    insertTypeAheadItem(editorView)({
      item: items[index],
      handler: pluginState.triggerHandler!,
      mode,
      sourceListItem: items,
      query: QUERY,
    });
  };

  const createEditor = createProsemirrorEditorFactory();
  let fakeGetItems = jest.fn();
  let fakeDismiss = jest.fn();
  let fakeOnOpen = jest.fn();
  let fakeSelectItem = jest.fn();
  let typeAheadHandler: TypeAheadHandler;
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
    fakeGetItems = jest.fn().mockReturnValue(Promise.resolve([]));
    fakeDismiss = jest.fn();
    fakeOnOpen = jest.fn();
    fakeSelectItem = jest.fn(
      (state: EditorState, item: TypeAheadItem, insert: TypeAheadInsert) => {
        return insert(state.schema.text(item.title));
      },
    );
    typeAheadHandler = {
      id: TypeAheadAvailableNodes.QUICK_INSERT,
      trigger: TRIGGER,
      getItems: fakeGetItems,
      dismiss: fakeDismiss,
      onOpen: fakeOnOpen,
      selectItem: fakeSelectItem,
    };
    const fakePlugin: () => EditorPlugin = () => ({
      name: 'fakePlugin',

      pluginsOptions: {
        typeAhead: typeAheadHandler,
      },
    });

    const preset = new Preset<LightEditorPlugin>()
      .add([analyticsPlugin, { createAnalyticsEvent }])
      .add(fakePlugin)
      .add([typeAheadPlugin, { createAnalyticsEvent }]);

    return createEditor({
      doc,
      preset,
    });
  };

  describe('decorations', () => {
    describe('when editor started', () => {
      it('should create an empty decorationSet', () => {
        const { editorView } = editor(doc(p('{<>}')));
        const pluginState = getPluginState(editorView.state);

        expect(pluginState.decorationSet).toEqual(DecorationSet.empty);
      });
    });

    describe('when the handler trigger is inserted in the document', () => {
      it('should create the typeahead decoration', () => {
        const { editorView } = editor(doc(p('{<>}')));
        insertText(editorView, TRIGGER);

        const pluginState = getPluginState(editorView.state);

        expect(pluginState.decorationSet).not.toEqual(DecorationSet.empty);
      });
    });

    describe('when it closes', () => {
      it('should remove the decorationElement', () => {
        const { editorView } = editor(doc(p('{<>}')));
        insertText(editorView, TRIGGER);

        const tr = closeTypeAhead(editorView.state.tr);
        editorView.dispatch(tr);

        const pluginState = getPluginState(editorView.state);

        expect(pluginState.decorationElement).toBeNull();
      });

      it('should clean the decorationSet', () => {
        const { editorView } = editor(doc(p('{<>}')));
        insertText(editorView, TRIGGER);

        const tr = closeTypeAhead(editorView.state.tr);
        editorView.dispatch(tr);

        const pluginState = getPluginState(editorView.state);

        expect(pluginState.decorationSet).toEqual(DecorationSet.empty);
      });
    });

    describe('when the document changes', () => {
      it('should map the decorations', () => {
        const { editorView } = editor(doc(p('hello '), p('{<>}')));

        insertText(editorView, TRIGGER);

        const oldDecorationSet = getPluginState(editorView.state).decorationSet;

        editorView.dispatch(editorView.state.tr.insertText('LOL', 6));

        const nextDecorationSet = getPluginState(editorView.state)
          .decorationSet;
        expect(oldDecorationSet).not.toEqual(nextDecorationSet);
      });
    });

    describe('when the selection changes', () => {
      it('should clean the decorations', () => {
        const { editorView } = editor(doc(p('hello '), p('{<>}')));

        insertText(editorView, TRIGGER);

        const tr = editorView.state.tr;
        tr.setSelection(new TextSelection(tr.doc.resolve(1)));
        editorView.dispatch(tr);

        const nextDecorationSet = getPluginState(editorView.state)
          .decorationSet;
        expect(nextDecorationSet).toEqual(DecorationSet.empty);
      });
    });

    describe('when a pointer event changes the selection', () => {
      it('should clean the decorations', () => {
        const { editorView } = editor(doc(p('hello '), p('{<>}')));

        insertText(editorView, TRIGGER);

        const tr = editorView.state.tr;
        tr.setMeta('pointer', true);
        tr.setSelection(new TextSelection(tr.doc.resolve(1)));
        editorView.dispatch(tr);

        const nextDecorationSet = getPluginState(editorView.state)
          .decorationSet;
        expect(nextDecorationSet).toEqual(DecorationSet.empty);
      });
    });
  });

  describe('triggerHandler', () => {
    describe('when it opens', () => {
      it('should set the handler data in the state', () => {
        const { editorView } = editor(doc(p('{<>}')));
        insertText(editorView, TRIGGER);

        const pluginState = getPluginState(editorView.state);

        expect(pluginState.triggerHandler).toEqual(typeAheadHandler);
      });
    });

    describe('when it closes', () => {
      it('should remove the handler to from the plugin state', () => {
        const { editorView } = editor(doc(p('{<>}')));
        insertText(editorView, TRIGGER);

        const tr = closeTypeAhead(editorView.state.tr);
        editorView.dispatch(tr);

        const pluginState = getPluginState(editorView.state);

        expect(pluginState.triggerHandler).not.toBeDefined();
      });
    });
  });

  describe('undo/redo', () => {
    describe('when the content is inserted by space', () => {
      const rawTextWithSpace = TRIGGER.concat(QUERY).concat(' ');
      let editorView: EditorView;
      beforeEach(() => {
        ({ editorView } = editor(doc(p('opa {<>}'))));
        insertText(editorView, TRIGGER);

        insertItem(editorView, 1, SelectItemMode.SPACE);

        undo(editorView.state, editorView.dispatch);
      });

      it('should bring the raw text back', () => {
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(p(`opa ${rawTextWithSpace}{<>}`)),
        );
      });
    });

    describe('when the first undo happens', () => {
      let editorView: EditorView;
      beforeEach(() => {
        ({ editorView } = editor(doc(p('opa {<>}'))));
        insertText(editorView, TRIGGER);

        insertItem(editorView, 1);

        undo(editorView.state, editorView.dispatch);
      });

      it('should remove the item inserted', () => {
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(p('opa {<>}')),
        );
      });

      it('should re-create the plugin state to open the typeahead with the right selected index', () => {
        const pluginState = getPluginState(editorView.state);

        expect(pluginState).toEqual(
          expect.objectContaining({
            query: QUERY,
            triggerHandler: typeAheadHandler,
            decorationElement: expect.any(HTMLElement),
            selectedIndex: 1,
          }),
        );
      });

      it('should re-create the decorations', () => {
        const pluginState = getPluginState(editorView.state);
        expect(pluginState.decorationSet).not.toEqual(DecorationSet.empty);
      });

      describe('when the operation is redid', () => {
        beforeEach(() => {
          redo(editorView.state, editorView.dispatch);
        });

        it('should add the item back', () => {
          expect(editorView.state).toEqualDocumentAndSelection(
            doc(p('opa Earth 2{<>}')),
          );
        });

        it('should clean the plugin state to close the typeahead', () => {
          const pluginState = getPluginState(editorView.state);

          expect(pluginState).toEqual(
            expect.objectContaining({
              query: '',
              triggerHandler: undefined,
              decorationElement: null,
              decorationSet: DecorationSet.empty,
            }),
          );
        });
      });
    });

    describe('when the second undo happens', () => {
      let editorView: EditorView;
      beforeEach(() => {
        ({ editorView } = editor(doc(p('opa {<>}'))));
        insertText(editorView, TRIGGER);

        insertItem(editorView);

        undo(editorView.state, editorView.dispatch);
        undo(editorView.state, editorView.dispatch);
      });

      it('should add the trigger char and the query as raw text into the document', () => {
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(p(`opa ${TRIGGER}${QUERY}{<>}`)),
        );
      });

      it('should clean the plugin state to close the typeahead', () => {
        const pluginState = getPluginState(editorView.state);

        expect(pluginState).toEqual(
          expect.objectContaining({
            query: '',
            triggerHandler: undefined,
            decorationElement: null,
            decorationSet: DecorationSet.empty,
          }),
        );
      });

      describe('when the operation is redid', () => {
        beforeEach(() => {
          redo(editorView.state, editorView.dispatch);
        });

        it('should remove the raw text inserted', () => {
          expect(editorView.state).toEqualDocumentAndSelection(
            doc(p('opa {<>}')),
          );
        });

        it('should re-create the plugin state to open the typeahead', () => {
          const pluginState = getPluginState(editorView.state);

          expect(pluginState).toEqual(
            expect.objectContaining({
              query: QUERY,
              triggerHandler: typeAheadHandler,
              decorationElement: expect.any(HTMLElement),
            }),
          );
        });
      });
    });
  });

  describe('API calls', () => {
    describe('when the typeahead opens', () => {
      it('should calls the onOpen callback', () => {
        const { editorView } = editor(doc(p('{<>}')));
        insertText(editorView, TRIGGER);

        expect(fakeOnOpen).toHaveBeenCalledTimes(1);
      });

      it('should send the invoke analytics', () => {
        const { editorView } = editor(doc(p('{<>}')));
        insertText(editorView, TRIGGER);

        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          action: ACTION.INVOKED,
          actionSubject: ACTION_SUBJECT.TYPEAHEAD,
          actionSubjectId: typeAheadHandler.id,
          eventType: EVENT_TYPE.UI,
          attributes: expect.objectContaining({
            inputMethod: INPUT_METHOD.KEYBOARD,
          }),
        });
      });
    });

    describe('when the typeahead item is inserted', () => {
      it('should calls the dismiss callback', () => {
        const { editorView } = editor(doc(p('{<>}')));
        insertText(editorView, TRIGGER);

        insertItem(editorView);

        expect(fakeDismiss).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the typeahead closes', () => {
      it('should calls the dismiss callback', () => {
        const { editorView } = editor(doc(p('{<>}')));
        insertText(editorView, TRIGGER);

        const tr = closeTypeAhead(editorView.state.tr);
        editorView.dispatch(tr);

        expect(fakeDismiss).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('#TypeAheadStats', () => {
    describe('when there is no typeahead', () => {
      it('should create an stats object with the TypeAheadStatsModifier interface', () => {
        const { editorView } = editor(doc(p('opa {<>}')));

        const pluginState = getPluginState(editorView.state);
        expect(pluginState.stats).toBeNull();
      });
    });

    describe('when the typehead is created', () => {
      it('should create an stats object with the TypeAheadStatsModifier interface', () => {
        const { editorView } = editor(doc(p('opa {<>}')));
        insertText(editorView, TRIGGER);

        const pluginState = getPluginState(editorView.state);
        expect(pluginState.stats).toBeInstanceOf(StatsModifier);
      });
    });

    describe('when an item is inserted', () => {
      it('should send the TypeAheadStats to the selectItem API as meta information', () => {
        const { editorView } = editor(doc(p('opa {<>}')));
        insertText(editorView, TRIGGER);

        insertItem(editorView);
        const metaExpected = expect.objectContaining({
          stats: {
            startedAt: expect.any(Number),
            endedAt: expect.any(Number),
            keyCount: {
              arrowUp: 0,
              arrowDown: 0,
            },
          },
        });
        expect(fakeSelectItem).toHaveBeenCalledWith(
          expect.anything(),
          expect.anything(),
          expect.anything(),
          metaExpected,
        );
      });
    });

    describe('when the TypeAheadStatsModifier.increaseArrowUp is called', () => {
      it('should send the TypeAheadStats with arrowUp updated', () => {
        const { editorView } = editor(doc(p('opa {<>}')));
        insertText(editorView, TRIGGER);

        const pluginState = getPluginState(editorView.state);
        const stats = pluginState.stats! as TypeAheadStatsModifier;
        stats.increaseArrowUp();

        insertItem(editorView);

        const metaExpected = expect.objectContaining({
          stats: {
            startedAt: expect.any(Number),
            endedAt: expect.any(Number),
            keyCount: {
              arrowUp: 1,
              arrowDown: 0,
            },
          },
        });

        expect(fakeSelectItem).toHaveBeenCalledWith(
          expect.anything(),
          expect.anything(),
          expect.anything(),
          metaExpected,
        );
      });
    });

    describe('when the TypeAheadStatsModifier.increaseArrowDown is called', () => {
      it('should send the TypeAheadStats with arrowDown updated', () => {
        const { editorView } = editor(doc(p('opa {<>}')));
        insertText(editorView, TRIGGER);

        const pluginState = getPluginState(editorView.state);
        const stats = pluginState.stats! as TypeAheadStatsModifier;
        stats.increaseArrowDown();

        insertItem(editorView);

        const metaExpected = expect.objectContaining({
          stats: {
            startedAt: expect.any(Number),
            endedAt: expect.any(Number),
            keyCount: {
              arrowUp: 0,
              arrowDown: 1,
            },
          },
        });

        expect(fakeSelectItem).toHaveBeenCalledWith(
          expect.anything(),
          expect.anything(),
          expect.anything(),
          metaExpected,
        );
      });
    });
  });

  describe('when selectItem returns an invalid node', () => {
    const createEditor = createProsemirrorEditorFactory();
    const editor = (doc: DocBuilder) => {
      const fakeSelectItem = jest.fn(
        (state: EditorState, item: TypeAheadItem, insert: TypeAheadInsert) => {
          // EMpty string is an invalid node
          return insert('');
        },
      );
      const typeAheadHandler = {
        id: TypeAheadAvailableNodes.QUICK_INSERT,
        trigger: TRIGGER,
        getItems: fakeGetItems,
        selectItem: fakeSelectItem,
      };
      const fakePlugin: () => EditorPlugin = () => ({
        name: 'fakePlugin',

        pluginsOptions: {
          typeAhead: typeAheadHandler,
        },
      });

      const preset = new Preset<LightEditorPlugin>()
        .add(fakePlugin)
        .add(typeAheadPlugin);

      return createEditor({
        doc,
        preset,
      });
    };

    it('should close the typeahead', () => {
      const { editorView } = editor(doc(p('opa {<>}')));
      insertText(editorView, TRIGGER);
      insertItem(editorView);

      const pluginState = getPluginState(editorView.state);

      expect(pluginState.triggerHandler).toBeFalsy();
    });
  });
});
