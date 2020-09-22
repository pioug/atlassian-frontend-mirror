import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  table,
  p,
  tr,
  th,
  td,
  unsupportedInline,
  unsupportedBlock,
  RefsNode,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { countNodes } from '../../count-nodes';
import { Schema } from 'prosemirror-model';

type DocBuilder = (schema: Schema) => RefsNode;

describe('#countNodes', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      editorProps: { allowTables: true },
    });

  it('should match empty 3x3 table and a paragraph', () => {
    const { editorView } = editor(
      doc(
        table()(
          tr(th({})(p()), th({})(p()), th({})(p())),
          tr(td({})(p()), td({})(p()), td({})(p())),
          tr(td({})(p()), td({})(p()), td({})(p())),
        ),
        p(),
      ),
    );
    const nodeCount = countNodes(editorView.state);
    const expected = {
      paragraph: 10,
      table: 1,
      tableCell: 6,
      tableHeader: 3,
      tableRow: 3,
    };
    expect(nodeCount).toEqual(expected);
  });

  it('should match unsupported contents', () => {
    const { editorView } = editor(
      doc(p(unsupportedInline({})()), unsupportedBlock({})()),
    );
    const nodeCount = countNodes(editorView.state);
    const expected = {
      paragraph: 1,
      unsupportedBlock: 1,
      unsupportedInline: 1,
    };
    expect(nodeCount).toEqual(expected);
  });

  it('should match empty doc', () => {
    const { editorView } = editor(doc(p('')));
    const nodeCount = countNodes(editorView.state);
    const expected = {
      paragraph: 1,
    };
    expect(nodeCount).toEqual(expected);
  });
});
