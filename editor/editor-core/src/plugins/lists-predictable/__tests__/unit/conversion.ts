import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  ul,
  li,
  ol,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { toggleOrderedList, toggleBulletList } from '../../commands';
import { pluginKey } from '../../pm-plugins/main';

describe('list conversion', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: any) => {
    return createEditor({
      doc,
      editorProps: {
        UNSAFE_predictableLists: true,
      },
      pluginKey,
    });
  };

  describe('in caret selection', () => {
    it('converts all siblings', () => {
      const { editorView } = editor(doc(ul(li(p('A')), li(p('{<>}B')))));

      toggleOrderedList(editorView);

      expect(editorView.state.doc).toEqualDocument(
        doc(ol(li(p('A')), li(p('{<>}B')))),
      );

      toggleBulletList(editorView);

      expect(editorView.state.doc).toEqualDocument(
        doc(ul(li(p('A')), li(p('{<>}B')))),
      );
    });

    it('converts siblings but leaves cousins alone', () => {
      const { editorView } = editor(
        doc(
          ul(
            li(p('A')),
            li(p('B'), ul(li(p('B1{<>}')))),
            li(p('C'), ul(li(p('C1')))),
          ),
        ),
      );

      toggleOrderedList(editorView);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          ul(
            li(p('A')),
            li(p('B'), ol(li(p('B1{<>}')))),
            li(p('C'), ul(li(p('C1')))),
          ),
        ),
      );
    });

    it('converts siblings but leaves children alone', () => {
      const { editorView } = editor(
        doc(ol(li(p('A{<>}'), ol(li(p('A1'), ol(li(p('A11')))))), li(p('B')))),
      );

      toggleBulletList(editorView);

      expect(editorView.state.doc).toEqualDocument(
        doc(ul(li(p('A{<>}'), ol(li(p('A1'), ol(li(p('A11')))))), li(p('B')))),
      );
    });
  });
});
