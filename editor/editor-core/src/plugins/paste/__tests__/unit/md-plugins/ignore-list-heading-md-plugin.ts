import type { DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import { doc, p, ul, li } from '@atlaskit/editor-test-helpers/doc-builder';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  Preset,
  createProsemirrorEditorFactory,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';

// Editor Plugins
import pastePlugin from '../../..';
import { basePlugin } from '../../../../base';
import blockTypePlugin from '../../../../block-type';
import { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
import { listPlugin } from '@atlaskit/editor-plugin-list';
import { textFormattingPlugin } from '@atlaskit/editor-plugin-text-formatting';
import betterTypeHistoryPlugin from '../../../../better-type-history';

import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';

describe('Paste Markdown Plugins', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add(basePlugin)
        .add([analyticsPlugin, {}])
        .add(hyperlinkPlugin)
        .add(betterTypeHistoryPlugin)
        .add([pastePlugin, {}])
        .add([listPlugin])
        .add(blockTypePlugin)
        .add(textFormattingPlugin),
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
