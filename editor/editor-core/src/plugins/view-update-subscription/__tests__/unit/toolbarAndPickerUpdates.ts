import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { TextSelection } from 'prosemirror-state';
import {
  doc,
  DocBuilder,
  p,
  panel,
  date,
  status,
  table,
  td as cell,
  tdEmpty as cellEmpty,
  tr as row,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { openTypeAheadAtCursor } from '../../../type-ahead/transforms/open-typeahead-at-cursor';
import { pluginKey as typeAheadPluginKey } from '../../../type-ahead/pm-plugins/key';
import { setDatePickerAt } from '../../../date/actions';
import { subscribeToToolbarAndPickerUpdates } from '../../subscribe/toolbarAndPickerUpdates';
import { setNodeSelection, setTextSelection } from '../../../../utils';
import { INPUT_METHOD } from '../../../analytics/types/enums';

// window.queueMicrotask not defined in jest globals
let oldQueueMicrotask: any;

beforeAll(() => {
  oldQueueMicrotask = window.queueMicrotask;
  window.queueMicrotask = (fn) => fn();
});

afterAll(() => {
  window.queueMicrotask = oldQueueMicrotask;
});

describe('subscribe to toolbar and picker updates', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      editorProps: {
        allowPanel: true,
        allowStatus: true,
        allowDate: true,
        allowTables: true,
        featureFlags: {
          enableViewUpdateSubscription: true,
        },
      },
    });
  };

  it('calls callback on floating toolbar update', () => {
    const { editorView } = editor(doc(p('text{<>}'), panel()(p('panel'))));
    const mock = jest.fn();
    subscribeToToolbarAndPickerUpdates(editorView, mock);

    setTextSelection(editorView, 10);
    expect(mock).toHaveBeenCalledTimes(1);

    editorView.dispatch(editorView.state.tr.insertText('asdf'));
    expect(mock).toHaveBeenCalledTimes(1);

    setTextSelection(editorView, 2);
    expect(mock).toHaveBeenCalledTimes(2);
  });

  it('calls callback on date update', () => {
    const { editorView } = editor(doc(p('te{<>}xt', date({ timestamp: 0 }))));
    const mock = jest.fn();
    subscribeToToolbarAndPickerUpdates(editorView, mock);

    setDatePickerAt(5)(editorView.state, editorView.dispatch);
    expect(mock).toHaveBeenCalledTimes(1);

    setTextSelection(editorView, 2);
    expect(mock).toHaveBeenCalledTimes(2);
  });

  it('calls callback on status update', () => {
    const { editorView } = editor(
      doc(
        p(
          'te{<>}xt',
          status({ text: 'status', color: 'neutral', localId: '' }),
        ),
      ),
    );
    const mock = jest.fn();
    subscribeToToolbarAndPickerUpdates(editorView, mock);

    setNodeSelection(editorView, 5);
    expect(mock).toHaveBeenCalledTimes(1);

    setTextSelection(editorView, 2);
    expect(mock).toHaveBeenCalledTimes(2);
  });

  it('doesnt call callback on inserting text', () => {
    const { editorView } = editor(doc(p('text{<>}'), panel()(p('panel'))));
    const mock = jest.fn();
    subscribeToToolbarAndPickerUpdates(editorView, mock);

    editorView.dispatch(editorView.state.tr.insertText('a'));
    editorView.dispatch(editorView.state.tr.insertText('b'));
    editorView.dispatch(editorView.state.tr.insertText('c'));

    expect(mock).toHaveBeenCalledTimes(1);
  });

  describe('when typeahead menu is open', () => {
    it('should not call the subscribeToToolbarAndPickerUpdates callback', () => {
      const { editorView, refs } = editor(
        // prettier-ignore
        doc(
          table()(
            row(
              cell()(p('{next}')),
              cellEmpty,
              cellEmpty,
            ),
          ),
        ),
      );

      const mock = jest.fn();
      subscribeToToolbarAndPickerUpdates(editorView, mock);

      // The code below will force the typeahead to open
      // at the sametime we set the selection in the table
      const { typeAheadHandlers } = typeAheadPluginKey.getState(
        editorView.state,
      );
      const { tr } = editorView.state;
      openTypeAheadAtCursor({
        triggerHandler: typeAheadHandlers[0],
        inputMethod: INPUT_METHOD.KEYBOARD,
      })(tr);

      tr.setSelection(TextSelection.create(tr.doc, refs['next']));

      editorView.dispatch(tr);

      expect(mock).not.toHaveBeenCalled();
    });
  });
});
