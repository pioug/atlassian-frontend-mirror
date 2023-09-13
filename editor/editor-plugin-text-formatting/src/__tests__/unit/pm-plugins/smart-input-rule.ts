import type { DocBuilder, Refs } from '@atlaskit/editor-common/types';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  code,
  doc,
  p,
  strong,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { textFormattingPlugin } from '../../../index';

function typeText(view: EditorView, text: string) {
  const { $from, $to } = view.state.selection;
  if (
    !view.someProp('handleTextInput', f => f(view, $from.pos, $to.pos, text))
  ) {
    view.dispatch(view.state.tr.insertText(text, $from.pos, $to.pos));
  }
}

function moveCursorToNextPos(
  view: EditorView,
  refs: Refs,
  additionalContent: string = '',
) {
  if (!refs.nextPos) {
    return;
  }
  const $pos = view.state.doc.resolve(refs.nextPos + additionalContent.length);
  view.dispatch(view.state.tr.setSelection(new TextSelection($pos, $pos)));
}

describe('text-formatting input rules', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder) => {
    const editor = createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>().add(textFormattingPlugin),
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

  describe('when inserting single quotes around text', () => {
    const startSmartQuote = '‘';
    const endSmartQuote = '’';
    const quote = "'";
    const editor = (doc: DocBuilder) => {
      return createEditor({
        doc,
        preset: new Preset<LightEditorPlugin>()
          .add([featureFlagsPlugin, {}])
          .add(textFormattingPlugin)
          .add(decorationsPlugin),
      });
    };

    it('should add smart quotes over multiline', () => {
      const longParagraph = 'Hello world. '.repeat(10);
      const { editorView, refs } = editor(
        doc(p(`{<>}${longParagraph}`, strong('Hello{nextPos}'), ' world.')),
      );
      typeText(editorView, quote);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(`${quote}${longParagraph}`, strong('Hello'), ' world.')),
      );
      moveCursorToNextPos(editorView, refs, quote);
      typeText(editorView, quote);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            `${startSmartQuote}${longParagraph}`,
            strong(`Hello${endSmartQuote}`),
            ' world.',
          ),
        ),
      );
    });

    it('should not add smart quotes if empty space in inner content', () => {
      const { editorView } = editor(doc(p('{<>}')));
      typeText(editorView, "' '");
      expect(editorView.state.doc).toEqualDocument(doc(p("' '")));
    });
    it('should not add smart quotes if no words in inner content', () => {
      const { editorView } = editor(doc(p('{<>}')));
      typeText(editorView, "'.'");
      expect(editorView.state.doc).toEqualDocument(doc(p("'.'")));
    });
    it('should not add smart quotes with code at end of line', () => {
      const { editorView, refs } = editor(
        doc(p('{<>}some content', code('code'), '{nextPos}')),
      );
      typeText(editorView, quote);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(quote, 'some content', code('code'))),
      );
      moveCursorToNextPos(editorView, refs, quote);
      typeText(editorView, quote);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(quote, 'some content', code('code' + quote))),
      );
    });
    it('should add smart quotes where match has heaps of space at beginning', () => {
      const { editorView, refs } = editor(
        doc(p('   {<>}some content{nextPos}')),
      );
      typeText(editorView, quote);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(`   ${quote}some content`)),
      );
      moveCursorToNextPos(editorView, refs, quote);
      typeText(editorView, quote);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(`   ${startSmartQuote}some content${endSmartQuote}`)),
      );
    });
    it('should not remove inlineCode mark when adding apostrophe and text afterwards', () => {
      const stringToEqual = '' + '’' + 'te';
      const { editorView, refs } = editor(
        doc(p('some content', code('code'), `${quote}`)),
      );
      moveCursorToNextPos(editorView, refs, quote);
      typeText(editorView, 'te');
      expect(editorView.state.doc).toEqualDocument(
        doc(p('some content', code('code'), stringToEqual)),
      );
    });
    it('should convert singleQuote to apostrophe when typed in letters', () => {
      const stringToType = '' + "'" + 'm';
      const { editorView } = editor(doc(p('hello i{<>}')));
      typeText(editorView, stringToType);
      expect(editorView.state.doc).toEqualDocument(doc(p('hello i’m')));
    });
  });
});
