import {
  alignment as alignmentMark,
  doc,
  p,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { removeBlockMarks } from '../../../../utils/mark';
import alignmentPlugin from '../../';

const alignmentPreset = new Preset<LightEditorPlugin>().add(alignmentPlugin);

describe('alignment utils', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset: alignmentPreset,
    });

  it('removes alignment', () => {
    const { editorView } = editor(
      doc(alignmentMark({ align: 'end' })(p('{<}hello{>}'))),
    );
    const { state, dispatch } = editorView;
    const tr = removeBlockMarks(state, [state.schema.marks.alignment]);
    expect(tr).toBeDefined();
    if (tr) {
      dispatch(tr);
      expect(editorView.state.doc).toEqualDocument(doc(p('hello')));
    }
    expect(true).toBeTruthy();
  });
});
