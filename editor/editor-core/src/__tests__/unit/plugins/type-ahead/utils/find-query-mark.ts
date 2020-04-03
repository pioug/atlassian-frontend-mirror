import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  typeAheadQuery,
} from '@atlaskit/editor-test-helpers/schema-builder';
import {
  findQueryMark,
  findTypeAheadQuery,
} from '../../../../../plugins/type-ahead/utils/find-query-mark';

describe('findQueryMark', () => {
  const createEditor = createEditorFactory();

  it('should return positions of a typeAheadQuery mark', () => {
    const { editorView } = createEditor({
      doc: doc(p(typeAheadQuery({ trigger: '/' })('/query'))),
    });

    const queryMark = findQueryMark(
      editorView.state.schema.marks.typeAheadQuery,
      editorView.state.doc,
      0,
      8,
    );

    expect(queryMark).toEqual({ end: 7, start: 1 });
  });

  it("should return a default value if query mark doesn't exist", () => {
    const { editorView } = createEditor({
      doc: doc(p('/query')),
    });

    const queryMark = findQueryMark(
      editorView.state.schema.marks.typeAheadQuery,
      editorView.state.doc,
      0,
      8,
    );

    expect(queryMark).toEqual({ end: -1, start: -1 });
  });
});

describe('findTypeAheadQuery', () => {
  const createEditor = createEditorFactory();

  it('should return positions of typeAheadQuery mark based on selection', () => {
    const { editorView } = createEditor({
      doc: doc(
        p('Foo'),
        p(typeAheadQuery({ trigger: '/' })('/query')),
        p('Bar'),
        p(typeAheadQuery({ trigger: '/' })('/query{<>}')),
      ),
    });

    const queryMark = findTypeAheadQuery(editorView.state);

    expect(queryMark).toEqual({ end: 25, start: 19 });
  });
});
