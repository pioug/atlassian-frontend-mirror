import { Schema } from 'prosemirror-model';
import {
  doc,
  p,
  ul,
  ol,
  li,
  RefsNode,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import { indentList } from '../../../actions/indent-list';

describe('lists plugin: actions', () => {
  describe('indentList', () => {
    type DocToRefsNodeType = (schema: Schema<any, any>) => RefsNode;
    const testIndentation = (
      originalDoc: DocToRefsNodeType,
      indentedDoc: DocToRefsNodeType,
    ) => {
      const editorState = createEditorState(originalDoc);
      const tr = editorState.tr;
      indentList(tr);
      expect(tr.doc).toEqualDocument(indentedDoc);
    };

    it('should indent an item into a sublist', () => {
      // prettier-ignore
      const originalDoc = doc(
        ul(
          li(p('one')),
          li(p('t{<>}wo')),
          li(p('three'))
        )
      );
      // prettier-ignore
      const indentedDoc = doc(
        ul(
          li(p('one'),
          ul(
            li(p('two'))
          )),
          li(p('three'))
        )
      );
      testIndentation(originalDoc, indentedDoc);
    });

    it('should indent an item into the preceding parent list for identical list types', () => {
      // prettier-ignore
      const originalDoc = doc(
        ul(
          li(p('one')),
          li(p('...'),
          ul(
            li(p('two'))
          )),
          li(p('t{<>}hree')),
        ),
      );
      // prettier-ignore
      const indentedDoc = doc(
        ul(
          li(p('one')),
          li(p('...'),
          ul(
            li(p('two')),
            li(p('three'))
          ))
        )
      );
      testIndentation(originalDoc, indentedDoc);
    });

    it('should indent an item into the preceding parent list for different list types', () => {
      // prettier-ignore
      const originalDoc = doc(
        ul(
          li(p('one')),
          li(p('...'),
          ol(
            li(p('two'))
          )),
          li(p('t{<>}hree')),
        ),
      );
      // prettier-ignore
      const indentedDoc = doc(
        ul(
          li(p('one')),
          li(p('...'),
          ol(
            li(p('two')),
            li(p('three'))
          ))
        )
      );
      testIndentation(originalDoc, indentedDoc);
    });

    it.each([
      [
        // prettier-ignore
        doc(
          ul(
            li(p('o{<>}ne')),
            li(p('two')),
            li(p('three'))
          )
        ),
      ],
      [
        // prettier-ignore
        doc(
          ul(
            li(p('{<>}one'),
            ul(
              li(p('two'))
            )),
            li(p('three'))
          )
        ),
      ],
      [
        // prettier-ignore
        doc(
          ul(
            li(p('{<}one'),
            ul(
              li(p('two'))
            )),
            li(p('three{>}'))
          )
        ),
      ],
      [
        // prettier-ignore
        doc(
        p('before{<}'),
        ul(
          li(p('one'),
          ul(
            li(p('two{>}'))
          )),
          li(p('three')),
        ),
        p('after'),
      ),
      ],
      [
        // prettier-ignore
        doc(
          p('before{<}'),
          ul(
            li(p('one'),
            ul(
              li(p('two'))
            )),
            li(p('three')),
          ),
          p('{>}after'),
        ),
      ],
    ])(
      'should not indent list items in a top-level list if selection contains the first list item (no-op)',
      (originalDoc) => {
        const indentedDoc = originalDoc;
        testIndentation(originalDoc, indentedDoc);
      },
    );

    it.each([
      [
        // prettier-ignore
        doc(
          ul(
            li(p('one'),
            ul(
              li(p('two{<>}'))
            )),
            li(p('three'))
          )
        ),
      ],
      [
        // prettier-ignore
        doc(
          p('before'),
          ul(
            li(p('one'),
            ul(
              li(p('two{<}'))
            )),
            li(p('three')),
          ),
          p('{>}after'),
        ),
      ],
    ])(
      'should not indent a list item more than one level past its parent (no-op)',
      (originalDoc) => {
        const indentedDoc = originalDoc;
        testIndentation(originalDoc, indentedDoc);
      },
    );
  });
});
