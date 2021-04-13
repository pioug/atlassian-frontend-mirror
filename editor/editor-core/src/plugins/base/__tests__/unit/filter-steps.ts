import {
  createProsemirrorEditorFactory,
  DispatchAnalyticsEvent,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { doc, p as paragraph } from '@atlaskit/editor-test-helpers/doc-builder';
import { EditorView } from 'prosemirror-view';

describe('filter steps', () => {
  const createEditor = createProsemirrorEditorFactory();
  let dispatchAnalyticsEvent: DispatchAnalyticsEvent;
  let editorView: EditorView;

  beforeAll(() => {
    // @ts-ignore
    global['fetch'] = jest.fn();
  });

  beforeEach(() => {
    ({ editorView, dispatchAnalyticsEvent } = createEditor({
      doc: doc(paragraph('hello world')),
    }));
    const { tr } = editorView.state;

    // The following will result in a "broken" step where prosemirror will insert create a slice
    // of the content and insert it in the beginning of the document, which results in something like:
    // doc(paragraph('hello ),paragraph('hello world')).
    //
    // We want to prevent the editor from applying such steps, so we filter them out.
    tr.replace(7, 0);

    editorView.dispatch(tr);
  });

  it('should filter out invalid steps', () => {
    expect(editorView.state.doc).toEqualDocument(doc(paragraph('hello world')));
  });

  it('should fire analytics when filtering out invalid steps', () => {
    expect(dispatchAnalyticsEvent).toBeCalledWith(
      expect.objectContaining({
        action: 'discardedInvalidStepsFromTransaction',
        actionSubject: 'editor',
        attributes: {
          analyticsEventPayloads: [],
        },
        eventType: 'operational',
      }),
    );
  });
});
