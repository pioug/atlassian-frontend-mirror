import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import { doc, p, status } from '@atlaskit/editor-test-helpers/schema-builder';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { pluginKey } from '../../../../plugins/status/plugin';
import {
  commitStatusPicker,
  createStatus,
  setStatusPickerAt,
  updateStatus,
  updateStatusWithAnalytics,
} from '../../../../plugins/status/actions';
import { EditorView } from 'prosemirror-view';
import { INPUT_METHOD } from '../../../../plugins/analytics';

describe('status plugin: actions', () => {
  const createEditor = createEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (doc: any) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
    return createEditor({
      doc,
      editorProps: {
        allowStatus: {
          menuDisabled: false,
        },
        allowAnalyticsGASV3: true,
      },
      createAnalyticsEvent,
    });
  };

  describe('updateStatus', () => {
    it('should update node at picker location if picker is shown', () => {
      const { editorView } = editor(
        doc(
          p(
            '{<>}',
            status({
              text: 'In progress',
              color: 'blue',
              localId: '666',
            }),
          ),
        ),
      );

      const selectionFrom = editorView.state.selection.from;
      setStatusPickerAt(selectionFrom)(editorView.state, editorView.dispatch);

      updateStatus({
        color: 'green',
        text: 'Done',
        localId: '666',
      })(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            '',
            status({
              color: 'green',
              text: 'Done',
              localId: '666',
            }),
          ),
        ),
      );

      const pluginState = pluginKey.getState(editorView.state);
      expect(pluginState.showStatusPickerAt).toEqual(selectionFrom);
    });

    it('should keep picker open after updating status', () => {
      const { editorView } = editor(
        doc(
          p(
            '{<>}',
            status({
              text: 'In progress',
              color: 'blue',
              localId: '666',
            }),
          ),
        ),
      );

      const selectionFrom = editorView.state.selection.from;
      setStatusPickerAt(selectionFrom)(editorView.state, editorView.dispatch);

      updateStatus({
        color: 'green',
        text: 'Done',
        localId: '666',
      })(editorView.state, editorView.dispatch);

      const pluginState = pluginKey.getState(editorView.state);
      expect(pluginState.showStatusPickerAt).toEqual(selectionFrom);
    });

    it('should keep selection when updating status', () => {
      const { editorView } = editor(
        doc(
          p(
            '{<>}',
            status({
              text: 'In progress',
              color: 'blue',
              localId: '666',
            }),
          ),
        ),
      );
      const selectionFrom = editorView.state.selection.from;
      setStatusPickerAt(selectionFrom)(editorView.state, editorView.dispatch);

      updateStatus({
        color: 'green',
        text: 'Done',
        localId: '666',
      })(editorView.state, editorView.dispatch);

      expect(editorView.state.selection.from).toEqual(selectionFrom);
    });

    it('should insert status if picker is not shown', () => {
      const { editorView } = editor(doc(p('')));

      updateStatus({
        color: 'blue',
        text: 'In progress',
        localId: '666',
      })(editorView.state, editorView.dispatch);

      expect(editorView.state.tr.doc).toEqualDocument(
        doc(
          p(
            '',
            status({
              text: 'In progress',
              color: 'blue',
              localId: '666',
            }),
            ' ',
          ),
        ),
      );
    });
  });

  describe('updateStatusWithAnalytics', () => {
    it('should fire analytics event', () => {
      const { editorView } = editor(doc(p('')));

      updateStatusWithAnalytics(INPUT_METHOD.TOOLBAR, {
        color: 'green',
        text: 'OK',
      })(editorView.state, editorView.dispatch);

      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'status',
        eventType: 'track',
        attributes: expect.objectContaining({ inputMethod: 'toolbar' }),
      });
    });
  });

  describe('showStatusPickerAt', () => {
    it('should set showStatusPickerAt meta', () => {
      const { editorView } = editor(doc(p('Status: {<>}')));

      const selectionFrom = editorView.state.selection.from;
      setStatusPickerAt(selectionFrom)(editorView.state, editorView.dispatch);

      const pluginState = pluginKey.getState(editorView.state);
      expect(pluginState.showStatusPickerAt).toEqual(selectionFrom);
    });
  });

  describe('commitStatusPicker', () => {
    it('should set showStatusPickerAt meta to null', () => {
      const { editorView } = editor(
        doc(
          p(
            '{<>}',
            status({
              text: 'In progress',
              color: 'blue',
              localId: '666',
            }),
          ),
        ),
      );

      const selectionFrom = editorView.state.selection.from;
      setStatusPickerAt(selectionFrom)(editorView.state, editorView.dispatch);

      updateStatus({
        color: 'green',
        text: 'Done',
        localId: '666',
      })(editorView.state, editorView.dispatch);

      commitStatusPicker()(editorView);

      const pluginState = pluginKey.getState(editorView.state);
      expect(pluginState.showStatusPickerAt).toEqual(null);
    });

    it('should set focus on editor', () => {
      const { editorView } = editor(
        doc(
          p(
            '{<>}',
            status({
              text: 'In progress',
              color: 'blue',
              localId: '666',
            }),
          ),
        ),
      );
      const focusSpy = jest.spyOn(editorView, 'focus');

      const selectionFrom = editorView.state.selection.from;
      setStatusPickerAt(selectionFrom)(editorView.state, editorView.dispatch);

      updateStatus({
        color: 'green',
        text: 'Done',
        localId: '666',
      })(editorView.state, editorView.dispatch);

      commitStatusPicker()(editorView);

      expect(focusSpy).toHaveBeenCalled();
    });

    it('should remove status node when no text in status node', () => {
      const { editorView } = editor(
        doc(
          p(
            'abc {<>}',
            status({
              text: 'In progress',
              color: 'blue',
              localId: '666',
            }),
          ),
        ),
      );

      const selectionFrom = editorView.state.selection.from;
      setStatusPickerAt(selectionFrom)(editorView.state, editorView.dispatch);

      updateStatus({
        color: 'green',
        text: '',
        localId: '666',
      })(editorView.state, editorView.dispatch);

      commitStatusPicker()(editorView);

      expect(editorView.state.doc).toEqualDocument(doc(p('abc ')));
    });
    it('should keep status node when text in status node', () => {
      const { editorView } = editor(
        doc(
          p(
            'abc {<>}',
            status({
              text: 'In progress',
              color: 'blue',
              localId: '666',
            }),
          ),
        ),
      );

      const selectionFrom = editorView.state.selection.from;
      setStatusPickerAt(selectionFrom)(editorView.state, editorView.dispatch);

      updateStatus({
        color: 'green',
        text: 'cheese',
        localId: '666',
      })(editorView.state, editorView.dispatch);

      commitStatusPicker()(editorView);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            'abc ',
            status({
              text: 'cheese',
              color: 'green',
              localId: '666',
            }),
          ),
        ),
      );
    });
  });

  describe('picker autofocus', () => {
    const insert = (editorView: EditorView) => (node: any) => {
      const { tr, selection } = editorView.state;
      tr.insert(selection.from, node);
      return tr;
    };

    it('focus on input field should be set when inserted', () => {
      const { editorView } = editor(doc(p('{<>}')));

      const { dispatch } = editorView;

      let pluginState = pluginKey.getState(editorView.state);
      expect(pluginState.isNew).toEqual(false);

      // Simulate quick insert, without quick insert
      dispatch(createStatus(-1)(insert(editorView), editorView.state));

      pluginState = pluginKey.getState(editorView.state);
      expect(pluginState.isNew).toEqual(true);

      updateStatus({
        color: 'green',
        text: 'cheese',
        localId: '666',
      })(editorView.state, editorView.dispatch);

      pluginState = pluginKey.getState(editorView.state);
      expect(pluginState.isNew).toEqual(true);
    });

    it('focus on input field should not be set when updating', () => {
      const { editorView } = editor(
        doc(
          p(
            '{<>}',
            status({
              text: 'In progress',
              color: 'blue',
              localId: '666',
            }),
          ),
        ),
      );

      const selectionFrom = editorView.state.selection.from;
      setStatusPickerAt(selectionFrom)(editorView.state, editorView.dispatch);

      let pluginState = pluginKey.getState(editorView.state);
      expect(pluginState.isNew).toEqual(false);

      updateStatus({
        color: 'green',
        text: 'cheese',
        localId: '666',
      })(editorView.state, editorView.dispatch);
      pluginState = pluginKey.getState(editorView.state);
      expect(pluginState.isNew).toEqual(false);

      commitStatusPicker()(editorView);
      pluginState = pluginKey.getState(editorView.state);
      expect(pluginState.isNew).toEqual(false);
    });
  });
});
