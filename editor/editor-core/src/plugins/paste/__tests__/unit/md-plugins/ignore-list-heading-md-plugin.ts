import {
  doc,
  p,
  ul,
  li,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  Preset,
  createProsemirrorEditorFactory,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';

// Editor Plugins
import pastePlugin from '../../..';
import basePlugin from '../../../../base';
import blockTypePlugin from '../../../../block-type';
import { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
import listPlugin from '../../../../list';
import textFormattingPlugin from '../../../../text-formatting';

import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';

describe('Paste Markdown Plugins', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add(hyperlinkPlugin)
        .add([pastePlugin, {}])
        .add([listPlugin])
        .add(blockTypePlugin)
        .add(textFormattingPlugin)
        .add(basePlugin),
    });
  };

  describe('Paste markdown list with headings', () => {
    const pasteContent =
      '- # heading in list\n' +
      '    - ## will turn into text\n' +
      '- when inside a list item\n' +
      '    -    ###  with white spaces trimmed\n' +
      '    -   ####  because it is\n' +
      '    -   #     markdown';

    it('should paste markdown with list headings converted to paragraphs', () => {
      const { editorView } = editor(doc(p('{<>}')));
      dispatchPasteEvent(editorView, {
        plain: pasteContent,
      });
      expect(editorView.state.doc).toEqualDocument(
        doc(
          ul(
            li(p('heading in list'), ul(li(p('will turn into text')))),
            li(
              p('when inside a list item'),
              ul(
                li(p('with white spaces trimmed')),
                li(p('because it is')),
                li(p('markdown')),
              ),
            ),
          ),
        ),
      );
    });
    it('should paste list with raw markdown headings with shift', () => {
      const { editorView } = editor(doc(p('{<>}')));
      dispatchPasteEvent(
        editorView,
        {
          plain: pasteContent,
        },
        { shift: true },
      );
      expect(editorView.state.doc).toEqualDocument(
        doc(
          ul(li(p('# heading in list'))),
          ul(li(p('## will turn into text'))),
          ul(li(p('when inside a list item'))),
          ul(li(p('###  with white spaces trimmed'))),
          ul(li(p('####  because it is'))),
          ul(li(p('#     markdown'))),
        ),
      );
    });
  });
});
