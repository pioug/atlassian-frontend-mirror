import type { DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  doc,
  li,
  p,
  ul,
  code_block,
  panel,
  hardBreak,
} from '@atlaskit/editor-test-helpers/doc-builder';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import { blockTypePlugin } from '@atlaskit/editor-plugin-block-type';
import codeBlockPlugin from '../../';
import { compositionPlugin } from '@atlaskit/editor-plugin-composition';
import panelPlugin from '../../../panel';
import { textFormattingPlugin } from '@atlaskit/editor-plugin-text-formatting';
import { listPlugin } from '@atlaskit/editor-plugin-list';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';

describe('inputrules', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add([analyticsPlugin, {}])
        .add(blockTypePlugin)
        .add(decorationsPlugin)
        .add(compositionPlugin)
        .add([codeBlockPlugin, { appearance: 'full-page' }])
        .add(panelPlugin)
        .add(listPlugin)
        .add([
          textFormattingPlugin,
          {
            disableCode: true,
          },
        ]),
    });
  };
  describe('codeblock rule', () => {
    describe('when node is not convertable to code block', () => {
      it('should append a code block to the doc', () => {
        const { editorView, sel } = editor(doc(panel()(p('{<>}hello'))));

        insertText(editorView, '```', sel);
        expect(editorView.state.doc).toEqualDocument(
          doc(panel()(p('hello')), code_block()()),
        );
      });
    });

    describe('when cursor is inside lists', () => {
      it('should convert "```" to a code block\t', () => {
        const { editorView, sel } = editor(doc(ul(li(p('{<>}hello')))));

        insertText(editorView, '```', sel);

        expect(editorView.state.doc).toEqualDocument(
          doc(ul(li(code_block()('hello')))),
        );
      });

      describe('when cursor is in a new line created with shift+enter', () => {
        it('should convert "```" to a code block\t', () => {
          const { editorView, sel } = editor(
            doc(ul(li(p('text', hardBreak(), '{<>}hello')))),
          );

          insertText(editorView, '```', sel);

          expect(editorView.state.doc).toEqualDocument(
            doc(ul(li(p('text', hardBreak()), code_block()('hello')))),
          );
        });
      });
    });

    describe('when node is convertable to code block', () => {
      describe('when converted node has no content', () => {
        it('should convert "```" to a code block\t', () => {
          const { editorView, sel } = editor(doc(p('{<>}')));

          insertText(editorView, '```', sel);

          expect(editorView.state.doc).toEqualDocument(doc(code_block({})()));
        });
      });
    });
  });
});
