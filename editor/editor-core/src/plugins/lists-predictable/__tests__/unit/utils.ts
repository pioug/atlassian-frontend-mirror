import { EditorState } from 'prosemirror-state';
import sampleSchema from '@atlaskit/editor-test-helpers/schema';
import { setSelectionTransform } from '@atlaskit/editor-test-helpers/set-selection-transform';
import {
  p,
  ul,
  ol,
  li,
  doc,
  RefsNode,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { countListItemsInSelection } from '../../utils/analytics';
import { hasValidListIndentationLevel } from '../../utils/indentation';

function createEditorState(documentNode: RefsNode) {
  const editorState = EditorState.create({
    doc: documentNode,
  });
  const { tr } = editorState;
  setSelectionTransform(documentNode, tr);
  return editorState.apply(tr);
}

describe('utils', () => {
  describe('selection', () => {
    // prettier-ignore
    const documentWithSelectionOutsideList = doc(
      ul(
        li(
          p('a1'),
        ),
      ),
      p('{<>}')
    )(sampleSchema);

    // prettier-ignore
    const documentWithCursorSelection = doc(
      ul(
        li(
          p('a1{<>}'),
        ),
      ),
    )(sampleSchema);

    // prettier-ignore
    const rangeSelectionAcrossTwoLevelsOfNestedLists = doc(
      ul(
        li(
          p('a1'),
        ),
        li(
          p('a2'),
          ul(
            li(
              p('b1'),
            ),
            li(
              p('b2'),
            ),
            li(
              p('b3'),
              ul(
                li(
                  p('c1'),
                ),
                li(
                  p('c{<}2'),
                  ul(
                    li(
                      p('d{>}1'),
                    ),
                  )
                ),
                li(
                  p('c3'),
                ),
              )
            ),
            li(
              p('b4'),
            ),
            li(
              p('b5'),
            ),
          ),
        ),
        li(
          p('a3'),
        ),
        li(
          p('a4'),
        ),
      ),
    )(sampleSchema);

    // prettier-ignore
    const rangeSelectionAcrossThreeLevelsOfNestedLists = doc(
      ul(
        li(
          p('a1'),
        ),
        li(
          p('a2'),
          ul(
            li(
              p('b1'),
            ),
            li(
              p('b{<}2'),
            ),
            li(
              p('b3'),
              ul(
                li(
                  p('c1'),
                ),
                li(
                  p('c2'),
                  ul(
                    li(
                      p('d1'),
                    ),
                  )
                ),
                li(
                  p('c3'),
                ),
              )
            ),
            li(
              p('b{>}4'),
            ),
            li(
              p('b5'),
            ),
          ),
        ),
        li(
          p('a3'),
        ),
        li(
          p('a4'),
        ),
      ),
    )(sampleSchema);

    // prettier-ignore
    const rangeSelectionFromDeepestLiToLastTopLevelLiOfNestedLists = doc(
      ul(
        li(p('A'),
        ul(
          li(p('A1'),
          ul(
            li(p('{<}A1.1'))),
          ),
          li(p('A2'))),
        ),
        li(p('B{>}')),
      ),
    )(sampleSchema);

    // prettier-ignore
    const rangeSelectionAcrossTwoLists = doc(
      ul(
        li(p('A'),
        ul(
          li(p('A1'),
          ul(
            li(p('{<}A1.1'))),
          ),
          li(p('A2'))),
        ),
        li(p('B')),
      ),
      p('--'),
      ol(
        li(p('Z1')),
        li(
          p('Z2'),
          ol(
            li(p('Y1')),
          )
        ),
        li(p('Z3{>}')),
      )
    )(sampleSchema);

    describe('when there is no selection', () => {
      describe('#countListItemsInSelection', () => {
        it('should count how many list items are in the selection', () => {
          const editorState = createEditorState(
            documentWithSelectionOutsideList,
          );
          const result = countListItemsInSelection(editorState);

          expect(result).toEqual(1);
        });
      });
    });

    describe('when the cursor is in the last nested item', () => {
      describe('#countListItemsInSelection', () => {
        it('should count how many list items are in the selection', () => {
          const editorState = createEditorState(documentWithCursorSelection);
          const result = countListItemsInSelection(editorState);

          expect(result).toEqual(1);
        });
      });
    });

    describe('when its range selection is across two levels of nested lists', () => {
      describe('#countListItemsInSelection', () => {
        it('should count how many list items are in the selection', () => {
          const editorState = createEditorState(
            rangeSelectionAcrossTwoLevelsOfNestedLists,
          );
          const result = countListItemsInSelection(editorState);

          expect(result).toEqual(2);
        });
      });
    });

    describe('when its range selection is across three levels of nested lists', () => {
      describe('#countListItemsInSelection', () => {
        it('should count how many list items are in the selection', () => {
          const editorState = createEditorState(
            rangeSelectionAcrossThreeLevelsOfNestedLists,
          );
          const result = countListItemsInSelection(editorState);

          expect(result).toEqual(7);
        });
      });
    });

    describe('when it is ranged with nested ascending selection', () => {
      describe('#countListItemsInSelection', () => {
        it('should count how many list items are in the selection', () => {
          const editorState = createEditorState(
            rangeSelectionFromDeepestLiToLastTopLevelLiOfNestedLists,
          );
          const result = countListItemsInSelection(editorState);

          expect(result).toEqual(3);
        });
      });
    });

    describe('when the selection is over two lists', () => {
      describe('#countListItemsInSelection', () => {
        it('should count how many list items are in the selection', () => {
          const editorState = createEditorState(rangeSelectionAcrossTwoLists);
          const result = countListItemsInSelection(editorState);

          expect(result).toEqual(7);
        });
      });
    });
  });

  describe('indentation', () => {
    // prettier-ignore
    const documentWithIndentedLists = doc(
      ol(
        li(p('A'),
        ol(
          li(p('B'),
          ol(
            li(p('C'),
            ol(
              li(p('D'),
              ol(
                li(p('E'),
                ol(
                  li(p('F')),
                )),
              )),
            )),
          )),
        )),
      ),
    )(sampleSchema);

    describe('#hasValidListIndentationLevel', () => {
      it('should return true if indentation level is within the maximum', () => {
        const { tr } = createEditorState(documentWithIndentedLists);
        expect(
          hasValidListIndentationLevel({ tr, maxIndentation: 6 }),
        ).toBeTruthy();
      });

      it('should return false if indentation level exceeds the maximum', () => {
        const { tr } = createEditorState(documentWithIndentedLists);
        expect(
          hasValidListIndentationLevel({ tr, maxIndentation: 3 }),
        ).toBeFalsy();
      });
    });
  });
});
