import { hasValidListIndentationLevel } from '@atlaskit/editor-common/lists';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, li, ol, p } from '@atlaskit/editor-test-helpers/doc-builder';

describe('utils', () => {
  describe('indentation', () => {
    // prettier-ignore
    const documentWithIndentedLists = doc(
      ol()(
        li(p('A'),
        ol()(
          li(p('B'),
          ol()(
            li(p('C'),
            ol()(
              li(p('D'),
              ol()(
                li(p('E'),
                ol()(
                  li(p('F')),
                )),
              )),
            )),
          )),
        )),
      ),
    );

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
