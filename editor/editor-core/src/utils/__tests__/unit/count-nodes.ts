import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import {
  doc,
  table,
  p,
  tr,
  th,
  td,
  unsupportedInline,
  unsupportedBlock,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { countNodes } from '../../count-nodes';

describe('#countNodes', () => {
  it('should match empty 3x3 table and a paragraph', () => {
    const editorState = createEditorState(
      doc(
        table()(
          tr(th({})(p()), th({})(p()), th({})(p())),
          tr(td({})(p()), td({})(p()), td({})(p())),
          tr(td({})(p()), td({})(p()), td({})(p())),
        ),
        p(),
      ),
    );
    const nodeCount = countNodes(editorState);
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
    const editorState = createEditorState(
      doc(p(unsupportedInline({})()), unsupportedBlock({})()),
    );
    const nodeCount = countNodes(editorState);
    const expected = {
      paragraph: 1,
      unsupportedBlock: 1,
      unsupportedInline: 1,
    };
    expect(nodeCount).toEqual(expected);
  });

  it('should match empty doc', () => {
    const editorState = createEditorState(doc(p('')));
    const nodeCount = countNodes(editorState);
    const expected = {
      paragraph: 1,
    };
    expect(nodeCount).toEqual(expected);
  });
});
