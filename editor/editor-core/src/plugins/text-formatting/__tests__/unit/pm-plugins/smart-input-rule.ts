import { EditorView } from 'prosemirror-view';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import base from '../../../../base';
import textFormatting from '../../..';
import blockType from '../../../../block-type';

function typeText(view: EditorView, text: string) {
  const { $from, $to } = view.state.selection;
  if (
    !view.someProp('handleTextInput', (f) => f(view, $from.pos, $to.pos, text))
  ) {
    view.dispatch(view.state.tr.insertText(text, $from.pos, $to.pos));
  }
}

describe('text-formatting input rules', () => {
  const createEditor = createProsemirrorEditorFactory();

  describe.each([true, false])(
    'when useUnpredictableInputRule is %s',
    (useUnpredictableInputRule) => {
      const editor = (doc: DocBuilder) => {
        const editor = createEditor({
          doc,
          preset: new Preset<LightEditorPlugin>()
            .add(base)
            .add(textFormatting)
            .add(blockType),
          featureFlags: {
            useUnpredictableInputRule,
          },
        });

        return editor;
      };

      it('should not replace text outside of matched word in a long paragraph', () => {
        const longParagraph = 'Hello world. '.repeat(50);
        const { editorView } = editor(doc(p(`${longParagraph}it{<>}`)));
        typeText(editorView, "'s");
        expect(editorView.state.doc).toEqualDocument(
          doc(p(`${longParagraph}it’s`)),
        );
      });
    },
  );
});
