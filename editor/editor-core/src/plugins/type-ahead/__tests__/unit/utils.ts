import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { EditorState } from 'prosemirror-state';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import { DocBuilder, doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import typeAheadPlugin from '../..';
import { EditorPlugin } from '../../../../types/editor-plugin';
import { isTypeAheadAllowed } from '../../utils';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import type {
  TypeAheadHandler,
  TypeAheadItem,
  TypeAheadInsert,
} from '../../types';

let _queueMicrotask: any;
beforeAll(() => {
  _queueMicrotask = window.queueMicrotask;
  window.queueMicrotask = () => {};
});
afterAll(() => {
  window.queueMicrotask = _queueMicrotask;
});

describe('type-ahead: utils', () => {
  const TRIGGER = 'X';

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
      .add(fakePlugin)
      .add([typeAheadPlugin, { createAnalyticsEvent }]);

    return createEditor({
      doc,
      preset,
    });
  };

  describe('isTypeAheadAllowed', () => {
    describe('when it opens', () => {
      it('should returns false', () => {
        const { editorView } = editor(doc(p('{<>}')));
        insertText(editorView, TRIGGER);

        expect(isTypeAheadAllowed(editorView.state)).toBeFalsy();
      });
    });

    describe('when it closes', () => {
      it('should returns true', () => {
        const { editorView } = editor(doc(p('{<>}')));

        expect(isTypeAheadAllowed(editorView.state)).toBeTruthy();
      });
    });
  });
});
