import {
  EditorState,
  TextSelection,
  NodeSelection,
  Selection,
} from 'prosemirror-state';
import { findChildrenByType, NodeWithPos } from 'prosemirror-utils';
import { EditorView } from 'prosemirror-view';
import { StatusLocalIdRegex } from '@atlaskit/editor-test-helpers/constants';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  status,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  updateStatus,
  setStatusPickerAt,
} from '../../../../plugins/status/actions';
import { setNodeSelectionNearPos } from '../../../../plugins/status/utils';
import { pluginKey } from '../../../../plugins/status/plugin';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';

export const setSelectionAndPickerAt = (pos: number) => (
  editorView: EditorView,
): EditorState => {
  setStatusPickerAt(pos)(editorView.state, editorView.dispatch);
  editorView.dispatch(setNodeSelectionNearPos(editorView.state.tr, pos));
  return editorView.state;
};

export const validateSelection = (pos: number) => (state: EditorState) => {
  let statusState = pluginKey.getState(state);

  expect(state.tr.selection).toBeInstanceOf(NodeSelection);
  expect(state.tr.selection.to).toBe(pos + 1);
  expect(statusState).toMatchObject({
    isNew: false,
    showStatusPickerAt: pos, // status node start position
  });
};

export const getStatusesInDocument = (
  state: EditorState,
  expectedLength: number,
): NodeWithPos[] => {
  const nodesFound = findChildrenByType(
    state.tr.doc,
    state.schema.nodes.status,
    true,
  );
  expect(nodesFound.length).toBe(expectedLength);
  return nodesFound;
};

describe('status plugin: plugin', () => {
  const createEditor = createEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;
  let editorView: EditorView;

  const editorFactory = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
    return createEditor({
      editorProps: {
        allowStatus: true,
        allowAnalyticsGASV3: true,
        quickInsert: true,
      },
      doc,
      createAnalyticsEvent,
    });
  };

  const generateStatus = (text = '') =>
    status({
      text,
      color: 'blue',
      localId: `local-status-id-${text}`,
    });

  describe('Edge cases', () => {
    it('StatusPicker should be dismissed if cursor is outside the Status node selection', () => {
      const { editorView } = editorFactory(doc(p('Status: {<>}')));
      // insert new Status at {<>}
      updateStatus({ text: 'Yay', color: 'blue' })(
        editorView.state,
        editorView.dispatch,
      );

      let statusState = pluginKey.getState(editorView.state);

      expect(editorView.state.tr.selection).toBeInstanceOf(NodeSelection);
      expect(editorView.state.tr.selection.to).toBe(
        editorView.state.tr.selection.from + 1,
      );
      expect(statusState).toMatchObject({
        isNew: true,
        showStatusPickerAt: editorView.state.tr.selection.from, // status node start position
      });

      const statusFromPosition = editorView.state.tr.selection.from;

      // simulate the scenario where user uses left arrow to move cursor outside the status node
      const beforeStatus = editorView.state.tr.doc.resolve(
        statusFromPosition - 1,
      );
      editorView.dispatch(
        editorView.state.tr.setSelection(new TextSelection(beforeStatus)),
      );

      statusState = pluginKey.getState(editorView.state);

      // expects the showStatusPickerAt to be reset to null
      expect(editorView.state.tr.selection).toBeInstanceOf(TextSelection);
      expect(editorView.state.tr.selection.to).toBe(statusFromPosition - 1);
      expect(statusState).toMatchObject({
        showStatusPickerAt: null,
      });
    });

    it('Empty status node should be removed when another status node is selected', () => {
      const { editorView } = editorFactory(
        doc(
          p(
            'Status: ',
            '{<node>}',
            generateStatus(''),
            'And another: ',
            generateStatus('hello'),
          ),
        ),
      );

      // simulate the scenario where user selects another status
      const cursorPos = editorView.state.tr.selection.from;
      setSelectionAndPickerAt(cursorPos + 14)(editorView);

      expect(editorView.state).toEqualDocumentAndSelection(
        doc(
          p('Status: ', 'And another: ', '{<node>}', generateStatus('hello')),
        ),
      );
    });

    it('Empty status node should be removed when a text node is selected', () => {
      const { editorView } = editorFactory(
        doc(p('Status: ', '{<node>}', generateStatus())),
      );

      // simulate the scenario where user selects a text node
      editorView.dispatch(
        editorView.state.tr.setSelection(
          Selection.near(editorView.state.doc.resolve(1)),
        ),
      );

      expect(editorView.state).toEqualDocumentAndSelection(
        doc(p('{<>}Status: ')),
      );
    });
  });

  describe('Quick insert', () => {
    beforeEach(async () => {
      const { editorView: _editorView, typeAheadTool } = editorFactory(
        doc(p('{<>}')),
      );

      await typeAheadTool.searchQuickInsert('status')?.insert({ index: 0 });

      editorView = _editorView;
    });

    it('inserts default status', () => {
      const statuses = getStatusesInDocument(editorView.state, 1);

      expect(statuses[0].node.attrs).toMatchObject({
        text: '',
        color: 'neutral',
        localId: expect.stringMatching(StatusLocalIdRegex),
      });
    });

    it('fires analytics event', () => {
      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'status',
        eventType: 'track',
        attributes: expect.objectContaining({ inputMethod: 'quickInsert' }),
      });
    });
  });
});
