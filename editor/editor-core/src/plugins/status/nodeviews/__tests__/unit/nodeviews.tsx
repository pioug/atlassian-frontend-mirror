import {
  TextSelection,
  NodeSelection,
} from '@atlaskit/editor-prosemirror/state';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import { screen } from '@testing-library/react';

import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p, status } from '@atlaskit/editor-test-helpers/doc-builder';
import { statusMessages as messages } from '@atlaskit/editor-common/messages';
import type { StatusType } from '../../../plugin';
import { pluginKey } from '../../../plugin';
import * as Actions from '../../../actions';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { __serializeForClipboard } from '@atlaskit/editor-prosemirror/view';

describe('Status - NodeView', () => {
  const testStatus: StatusType = {
    text: 'In progress',
    color: 'blue',
    localId: '666',
  };

  const createEditor = createEditorFactory();

  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      editorProps: {
        allowStatus: {
          menuDisabled: false,
        },
      },
    });
  };

  it('should use status component', () => {
    const { editorView: view } = editor(doc(p('Status: {<>}')));

    Actions.updateStatus(testStatus)(view.state, view.dispatch);

    const statusTextElement = screen.getByText('In progress');
    expect(statusTextElement).toBeInTheDocument();
    const statusContainer = screen.getByTestId('statusContainerView');
    expect(statusContainer).toBeInTheDocument();
    expect(statusContainer.children[0].getAttribute('data-color')).toBe('blue');
  });

  it('should use status as placeholder when no text', () => {
    const { editorView: view } = editor(doc(p('Status: {<>}')));

    Actions.updateStatus({ ...testStatus, text: '' })(
      view.state,
      view.dispatch,
    );

    const statusTextElement = screen.getByText(
      messages.placeholder.defaultMessage,
    );
    expect(statusTextElement).toBeInTheDocument();
    const statusContainer = screen.getByTestId('statusContainerView');
    expect(statusContainer).toBeInTheDocument();
    expect(statusContainer.children[0].getAttribute('data-color')).toBe('blue');
  });

  it('should use status as placeholder when empty text', () => {
    const { editorView: view } = editor(doc(p('Status: {<>}')));

    Actions.updateStatus({ ...testStatus, text: '        ' })(
      view.state,
      view.dispatch,
    );

    const statusTextElement = screen.getByText(
      messages.placeholder.defaultMessage,
    );
    expect(statusTextElement).toBeInTheDocument();
    const statusContainer = screen.getByTestId('statusContainerView');
    expect(statusContainer).toBeInTheDocument();
    expect(statusContainer.children[0].getAttribute('data-color')).toBe('blue');
  });

  describe('selection', () => {
    let editorView: EditorView;

    const setTextSelection = (start: number, end?: number) => {
      const { state, dispatch } = editorView;
      const { tr } = state;
      const $start = state.doc.resolve(start);
      const $end = end ? state.doc.resolve(end) : $start;
      dispatch(tr.setSelection(new TextSelection($start, $end)));
    };

    const setNodeSelection = (pos: number) => {
      const { state, dispatch } = editorView;
      const { tr } = state;
      const $pos = state.doc.resolve(pos);
      dispatch(tr.setSelection(new NodeSelection($pos)));
    };

    const getPluginState = () => {
      return pluginKey.getState(editorView.state);
    };

    beforeEach(() => {
      jest.useFakeTimers();
      ({ editorView } = editor(doc(p('Status: {<>}'))));

      Actions.updateStatus(testStatus)(editorView.state, editorView.dispatch);

      const statusContainer = screen.getByTestId('statusContainerView');
      expect(statusContainer).toBeInTheDocument();
    });

    it('selected after insert', () => {
      expect(getPluginState()).toMatchObject({
        showStatusPickerAt: 9,
        isNew: true,
      });
    });

    it('prevents automatic transaction that changes node selection to text selection when status is inserted', () => {
      const showStatusPickerAt = 9;
      expect(getPluginState()).toMatchObject({
        showStatusPickerAt,
        isNew: true,
      });

      // this transaction is dispatched by prosemirror-view on dom change when status is inserted
      // since we're using jsdom and selection is mocked need to trigger this manually
      setTextSelection(showStatusPickerAt);

      jest.runOnlyPendingTimers(); // WithPluginState debounces updates

      const { state } = editorView;
      expect(state.selection instanceof NodeSelection).toBe(true);
    });

    it('selection of status', () => {
      // Set at selection start of paragraph
      setTextSelection(2);
      jest.runOnlyPendingTimers(); // WithPluginState debounces updates

      expect(getPluginState()).toMatchObject({
        showStatusPickerAt: null,
      });

      // Select status
      setNodeSelection(9);
      jest.runOnlyPendingTimers(); // WithPluginState debounces updates
      expect(getPluginState()).toMatchObject({
        showStatusPickerAt: 9,
        isNew: false,
      });
    });

    it('collapsed selection immediately after status', () => {
      setTextSelection(10);
      jest.runOnlyPendingTimers(); // WithPluginState debounces updates
      expect(getPluginState()).toMatchObject({
        showStatusPickerAt: null,
      });
    });

    it('selection including status', () => {
      setTextSelection(5, 10);
      jest.runOnlyPendingTimers(); // WithPluginState debounces updates
      expect(getPluginState()).toMatchObject({
        showStatusPickerAt: null,
      });
    });

    it('Copying/pasting a Status instance should generate a new localId', () => {
      let state = editorView.state;

      setTextSelection(1, 10);
      jest.runOnlyPendingTimers(); // WithPluginState debounces updates

      const { dom, text } = __serializeForClipboard(
        editorView,
        state.selection.content(),
      );

      // move cursor to the position to paste a new status
      setTextSelection(12);

      // paste Status
      dispatchPasteEvent(editorView, { html: dom.innerHTML, plain: text });

      expect(getPluginState()).toMatchObject({
        showStatusPickerAt: null,
      });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            'Status: ',
            status({
              text: 'In progress',
              color: 'blue',
              localId: '666',
            }),
            ' ',
          ),
          p(
            status({
              text: 'In progress',
              color: 'blue',
              localId: expect.stringMatching(
                /[a-f0-9]{8}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{12}/,
              ),
            }),
          ),
        ),
      );
    });
  });
});
