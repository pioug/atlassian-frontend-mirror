declare var global: any;
import {
  doc,
  p as paragraph,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { createProsemirrorEditorFactory } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';

describe('filter steps', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: any) => {
    return createEditor({
      doc,
    });
  };

  beforeAll(() => {
    global.fetch = () => Promise.resolve();
  });

  it('should filter out invalid steps', () => {
    const { editorView: view } = editor(doc(paragraph('hello world')));
    const { tr } = view.state;

    // The following will result in a "broken" step where prosemirror will insert create a slice
    // of the content and insert it in the beginning of the document, which results in something like:
    // doc(paragraph('hello ),paragraph('hello world')).
    //
    // We want to prevent the editor from applying such steps, so we filter them out.
    tr.replace(7, 0);

    view.dispatch(tr);

    expect(view.state.doc).toEqualDocument(doc(paragraph('hello world')));
  });
});
