import React from 'react';
import { ReactWrapper } from 'enzyme';
import { TextSelection, NodeSelection } from 'prosemirror-state';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import {
  doc,
  p,
  status,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { Status } from '@atlaskit/status/element';
import {
  ContainerProps,
  IntlStatusContainerView,
} from '../../../../../plugins/status/nodeviews/status';
import { messages } from '../../../../../plugins/status/nodeviews/messages';
import { pluginKey, StatusType } from '../../../../../plugins/status/plugin';
import * as Actions from '../../../../../plugins/status/actions';
// @ts-ignore
import { __serializeForClipboard } from 'prosemirror-view';
import { EditorInstance } from '../../../../../types';

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

    const wrapper = mountWithIntl(
      <IntlStatusContainerView
        view={view}
        text="In progress"
        color="blue"
        localId="666"
      />,
    );

    expect(wrapper.find(Status).length).toBe(1);
    expect(wrapper.find(Status).prop('text')).toBe('In progress');
    expect(wrapper.find(Status).prop('color')).toBe('blue');
    expect(wrapper.find(Status).prop('localId')).toBe('666');
  });

  it('should use status as placeholder when no text', () => {
    const { editorView: view } = editor(doc(p('Status: {<>}')));

    Actions.updateStatus({ ...testStatus, text: '' })(
      view.state,
      view.dispatch,
    );

    const wrapper = mountWithIntl(
      <IntlStatusContainerView view={view} color="blue" localId="666" />,
    );
    expect(wrapper.find(Status).length).toBe(1);
    expect(wrapper.find(Status).prop('text')).toBe(
      messages.placeholder.defaultMessage,
    );
    expect(wrapper.find(Status).prop('color')).toBe('blue');
    expect(wrapper.find(Status).prop('localId')).toBe('666');
  });

  it('should use status as placeholder when empty text', () => {
    const { editorView: view } = editor(doc(p('Status: {<>}')));

    Actions.updateStatus({ ...testStatus, text: '        ' })(
      view.state,
      view.dispatch,
    );

    const wrapper = mountWithIntl(
      <IntlStatusContainerView
        view={view}
        text=""
        color="blue"
        localId="666"
      />,
    );
    expect(wrapper.find(Status).length).toBe(1);
    expect(wrapper.find(Status).prop('text')).toBe(
      messages.placeholder.defaultMessage,
    );
    expect(wrapper.find(Status).prop('color')).toBe('blue');
    expect(wrapper.find(Status).prop('localId')).toBe('666');
  });

  describe('selection', () => {
    let wrapper: ReactWrapper<ContainerProps, {}>;
    let editorInstance: EditorInstance;

    const setTextSelection = (start: number, end?: number) => {
      const { editorView } = editorInstance;
      const { state, dispatch } = editorView;
      const { tr } = state;
      const $start = state.doc.resolve(start);
      const $end = end ? state.doc.resolve(end) : $start;
      dispatch(tr.setSelection(new TextSelection($start, $end)));
    };

    const setNodeSelection = (pos: number) => {
      const { editorView } = editorInstance;
      const { state, dispatch } = editorView;
      const { tr } = state;
      const $pos = state.doc.resolve(pos);
      dispatch(tr.setSelection(new NodeSelection($pos)));
    };

    const getPluginState = () => {
      return pluginKey.getState(editorInstance.editorView.state);
    };

    beforeEach(() => {
      jest.useFakeTimers();
      editorInstance = editor(doc(p('Status: {<>}')));
      const { editorView: view, eventDispatcher } = editorInstance;

      Actions.updateStatus(testStatus)(view.state, view.dispatch);

      // @ts-ignore
      wrapper = mountWithIntl(
        <IntlStatusContainerView
          view={view}
          eventDispatcher={eventDispatcher}
          text="In progress"
          color="blue"
          localId="666"
        />,
      );
      expect(wrapper.find(Status).length).toBe(1);
    });

    afterEach(() => {
      wrapper.unmount();
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
      wrapper.update();

      const { editorView } = editorInstance;
      const { state } = editorView;
      expect(state.selection instanceof NodeSelection).toBe(true);
    });

    it('selection of status', () => {
      // Set at selection start of paragraph
      setTextSelection(2);
      jest.runOnlyPendingTimers(); // WithPluginState debounces updates
      wrapper.update();

      expect(getPluginState()).toMatchObject({
        showStatusPickerAt: null,
      });

      // Select status
      setNodeSelection(9);
      jest.runOnlyPendingTimers(); // WithPluginState debounces updates
      wrapper.update();
      expect(getPluginState()).toMatchObject({
        showStatusPickerAt: 9,
        isNew: false,
      });
    });

    it('collapsed selection immediately after status', () => {
      setTextSelection(10);
      jest.runOnlyPendingTimers(); // WithPluginState debounces updates
      wrapper.update();
      expect(getPluginState()).toMatchObject({
        showStatusPickerAt: null,
      });
    });

    it('selection including status', () => {
      setTextSelection(5, 10);
      jest.runOnlyPendingTimers(); // WithPluginState debounces updates
      wrapper.update();
      expect(getPluginState()).toMatchObject({
        showStatusPickerAt: null,
      });
    });

    it('Copying/pasting a Status instance should generate a new localId', () => {
      const { editorView } = editorInstance;
      let state = editorView.state;

      setTextSelection(1, 10);
      jest.runOnlyPendingTimers(); // WithPluginState debounces updates
      wrapper.update();

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
