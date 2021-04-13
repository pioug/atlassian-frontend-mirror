import {
  doc,
  p,
  typeAheadQuery,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { isQueryActive } from '../../../../../plugins/type-ahead/utils/is-query-active';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';

describe('findQueryMark', () => {
  it('should return true if typeAheadQuery mark is active', () => {
    const editorState = createEditorState(
      doc(p(typeAheadQuery({ trigger: '/' })('/query'))),
    );

    const queryMark = isQueryActive(
      editorState.schema.marks.typeAheadQuery,
      editorState.doc,
      0,
      8,
    );

    expect(queryMark).toBe(true);
  });

  it('should return false if query mark is not active', () => {
    const editorState = createEditorState(doc(p('/query')));

    const queryMark = isQueryActive(
      editorState.schema.marks.typeAheadQuery,
      editorState.doc,
      0,
      8,
    );

    expect(queryMark).toEqual(false);
  });
});
