import { p, ul, ol, li, doc } from '@atlaskit/editor-test-helpers/doc-builder';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import { countListItemsInSelection } from '../../../utils/analytics';

describe('utils', () => {
  describe('analytics', () => {
    // prettier-ignore
    const documentWithSelectionOutsideList = doc(
      ul(
        li(
          p('a1'),
        ),
      ),
      p('{<>}')
    );

    // prettier-ignore
    const documentWithCursorSelection = doc(
      ul(
        li(
          p('a1{<>}'),
        ),
      ),
    );

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
    );

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
    );

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
    );

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
    );

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
});
