import {
  doc,
  p,
  typeAheadQuery,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  findQueryMark,
  findTypeAheadQuery,
} from '../../../../../plugins/type-ahead/utils/find-query-mark';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';

describe('findQueryMark', () => {
  it('should return positions of a typeAheadQuery mark', () => {
    const editorState = createEditorState(
      doc(p(typeAheadQuery({ trigger: '/' })('/query'))),
    );

    const queryMark = findQueryMark(
      editorState.schema.marks.typeAheadQuery,
      editorState.doc,
      0,
      8,
    );

    expect(queryMark).toEqual({ end: 7, start: 1 });
  });

  it("should return a default value if query mark doesn't exist", () => {
    const editorState = createEditorState(doc(p('/query')));

    const queryMark = findQueryMark(
      editorState.schema.marks.typeAheadQuery,
      editorState.doc,
      0,
      8,
    );

    expect(queryMark).toEqual({ end: -1, start: -1 });
  });
});

describe('findTypeAheadQuery', () => {
  it('should return positions of typeAheadQuery mark based on selection', () => {
    const editorState = createEditorState(
      doc(
        p('Foo'),
        p(typeAheadQuery({ trigger: '/' })('/query')),
        p('Bar'),
        p(typeAheadQuery({ trigger: '/' })('/query{<>}')),
      ),
    );

    const queryMark = findTypeAheadQuery(editorState);

    expect(queryMark).toEqual({ end: 25, start: 19 });
  });
});
