import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import { p, ol, li, doc } from '@atlaskit/editor-test-helpers/doc-builder';
import { hasValidListIndentationLevel } from '../../../utils/indentation';

describe('utils', () => {
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
