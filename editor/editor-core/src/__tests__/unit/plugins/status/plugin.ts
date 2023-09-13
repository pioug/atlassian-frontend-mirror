import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import {
  TextSelection,
  NodeSelection,
  Selection,
} from '@atlaskit/editor-prosemirror/state';
import type { NodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import { findChildrenByType } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { StatusLocalIdRegex } from '@atlaskit/editor-test-helpers/constants';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import { doc, p, status } from '@atlaskit/editor-test-helpers/doc-builder';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import {
  commitStatusPicker,
  updateStatus,
  setStatusPickerAt,
} from '../../../../plugins/status/actions';
import { setNodeSelectionNearPos } from '../../../../plugins/status/utils';
import { pluginKey } from '../../../../plugins/status/plugin';
import type {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';

const setSelectionAndPickerAt =
  (pos: number) =>
  (editorView: EditorView): EditorState => {
    setStatusPickerAt(pos)(editorView.state, editorView.dispatch);
    editorView.dispatch(setNodeSelectionNearPos(editorView.state.tr, pos));
    return editorView.state;
  };

const getStatusesInDocument = (
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

  describe('undo redo', () => {
    const doNTimes = (fn: Function, n: number) =>
      Array(n)
        .fill(null)
        .forEach(() => fn());

    it('should able to redo multiple statuses', async () => {
      /**
       * Undo/Redo stack depends on how quickly actions are happening.
       * We use prosemirror history plugin (from prosemirror-history)
       *  and default time to group all the actions are 500ms.
       * That means if we will create just one undo command for all actions happened within 500ms.
       * So if you type test very quickly then only one command to remove whole test word will be added.
       * But if you type test slowly one character by character, we will have 4 undo commands.
       *
       * Why we need to mock Date.now here.
       * In jest environment, we will fire transactions to create/update
       *  status very quickly.
       * So we end up with just one undo command for one status.
       * But in real world, user don't create status within 500ms.
       * So multiple undo commands for empty status, for status with few characters and then last for final status.
       * And command for empty status is causing redo not working for status issue.
       *
       * So mocking Date.now, and, returning time apart by 600ms.
       */
      let lastTime = 1683779625988;
      jest.spyOn(global.Date, 'now').mockImplementation(() => {
        lastTime = lastTime + 600;
        return lastTime;
      });

      const { editorView } = createEditor({
        doc: doc(
          p(
            ' ',
            status({
              text: 'In progress',
              color: 'blue',
              localId: '1',
            }),
            ' ',
            '{<>}',
          ),
        ),
        editorProps: {
          allowStatus: {
            menuDisabled: false,
          },
          allowAnalyticsGASV3: true,
          allowUndoRedoButtons: true,
        },
        createAnalyticsEvent,
      });
      const undo = () => sendKeyToPm(editorView, 'Ctrl-z');
      const redo = () => sendKeyToPm(editorView, 'Ctrl-y');

      updateStatus({
        color: 'green',
        text: '',
        localId: '2',
      })(editorView.state, editorView.dispatch);
      updateStatus({
        color: 'green',
        text: 'Done',
        localId: '2',
      })(editorView.state, editorView.dispatch);
      commitStatusPicker()(editorView);

      updateStatus({
        color: 'green',
        text: '',
        localId: '3',
      })(editorView.state, editorView.dispatch);
      updateStatus({
        color: 'green',
        text: 'Test',
        localId: '3',
      })(editorView.state, editorView.dispatch);
      commitStatusPicker()(editorView);

      // First check if two statuses are created properly.
      expect(editorView.state).toEqualDocumentAndSelection(
        doc(
          p(
            ' ',
            status({
              text: 'In progress',
              color: 'blue',
              localId: '1',
            }),
            ' ',
            status({
              color: 'green',
              text: 'Done',
              localId: '2',
            }),
            ' ',
            status({
              color: 'green',
              text: 'Test',
              localId: '3',
            }),
            ' ',
          ),
        ),
      );

      doNTimes(undo, 4);

      // There should be only one status left after undoing.
      expect(editorView.state).toEqualDocumentAndSelection(
        doc(
          p(
            ' ',
            status({
              text: 'In progress',
              color: 'blue',
              localId: '1',
            }),
            ' ',
          ),
        ),
      );

      doNTimes(redo, 4);

      // Redoing should be working and all three statuses should be there.
      expect(editorView.state).toEqualDocumentAndSelection(
        doc(
          p(
            ' ',
            status({
              text: 'In progress',
              color: 'blue',
              localId: '1',
            }),
            ' ',
            status({
              color: 'green',
              text: 'Done',
              localId: '2',
            }),
            ' ',
            status({
              color: 'green',
              text: 'Test',
              localId: '3',
            }),
            ' ',
          ),
        ),
      );
    });
  });
});
