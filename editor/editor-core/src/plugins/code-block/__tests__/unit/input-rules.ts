import {
  doc,
  li,
  p,
  ul,
  code_block,
  panel,
  hardBreak,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  createProsemirrorEditorFactory,
  Preset,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import blockTypePlugin from '../../../block-type';
import codeBlockPlugin from '../../';
import panelPlugin from '../../../panel';
import textFormattingPlugin from '../../../text-formatting';
import listPlugin from '../../../list';

describe('inputrules', () => {
  const createEditor = createProsemirrorEditorFactory();

  describe.each([true, false])(
    'when useUnpredictableInputRule is %s',
    (useUnpredictableInputRule) => {
      const editor = (doc: DocBuilder) => {
        return createEditor({
          featureFlags: {
            useUnpredictableInputRule,
          },
          doc,
          preset: new Preset<LightEditorPlugin>()
            .add(blockTypePlugin)
            .add(codeBlockPlugin)
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

              expect(editorView.state.doc).toEqualDocument(
                doc(code_block({})()),
              );
            });
          });
        });
      });
    },
  );
});
