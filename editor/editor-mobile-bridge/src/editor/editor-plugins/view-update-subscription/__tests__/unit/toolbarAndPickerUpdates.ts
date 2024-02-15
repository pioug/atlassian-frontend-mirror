// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  panel,
  date,
  status,
  table,
  td as cell,
  tdEmpty as cellEmpty,
  tr as row,
} from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { setDatePickerAt } from '@atlaskit/editor-plugin-date/src/actions';
import { subscribeToToolbarAndPickerUpdates } from '../../subscribe/toolbarAndPickerUpdates';
import {
  setNodeSelection,
  setTextSelection,
} from '@atlaskit/editor-common/utils';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';

import viewUpdateSubscriptionPlugin from '../../';
import { copyButtonPlugin } from '@atlaskit/editor-plugin-copy-button';
import { floatingToolbarPlugin } from '@atlaskit/editor-plugin-floating-toolbar';
import { typeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { selectionPlugin } from '@atlaskit/editor-plugin-selection';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import { editorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { panelPlugin } from '@atlaskit/editor-plugin-panel';
import { statusPlugin } from '@atlaskit/editor-plugin-status';
import { datePlugin } from '@atlaskit/editor-plugin-date';
import { tablesPlugin } from '@atlaskit/editor-plugin-table';

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
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) => {
    const preset = new Preset()
      .add([analyticsPlugin, { createAnalyticsEvent: jest.fn() }])
      .add(contentInsertionPlugin)
      .add(widthPlugin)
      .add(guidelinePlugin)
      .add(selectionPlugin)
      .add(editorDisabledPlugin)
      .add(decorationsPlugin)
      .add(panelPlugin)
      .add(statusPlugin)
      .add(datePlugin)
      .add(tablesPlugin)
      .add(typeAheadPlugin)
      .add(copyButtonPlugin)
      .add(floatingToolbarPlugin)
      .add(viewUpdateSubscriptionPlugin);

    return createEditor({
      doc,
      preset,
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
      const { editorView, typeAheadTool } = editor(
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

      typeAheadTool.openQuickInsert(INPUT_METHOD.KEYBOARD);

      expect(mock).not.toHaveBeenCalled();
    });
  });
});
