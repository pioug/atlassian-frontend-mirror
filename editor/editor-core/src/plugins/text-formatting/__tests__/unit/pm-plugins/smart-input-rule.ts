import { EditorView } from 'prosemirror-view';
import { TextSelection } from 'prosemirror-state';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  p,
  DocBuilder,
  subsup,
  strike,
  textColor,
  status,
  em,
  strong,
  Refs,
  code,
  emoji,
  blockquote,
  panel,
} from '@atlaskit/editor-test-helpers/doc-builder';
import base from '../../../../base';
import textFormatting from '../../..';
import blockType from '../../../../block-type';
import textColorPlugin from '../../../../text-color';
import statusPlugin from '../../../../status';
import emojiPlugin from '../../../../emoji';
import panelPlugin from '../../../../panel';

function typeText(view: EditorView, text: string) {
  const { $from, $to } = view.state.selection;
  if (
    !view.someProp('handleTextInput', (f) => f(view, $from.pos, $to.pos, text))
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

  describe('when inserting single quotes around text', () => {
    const startSmartQuote = '‘';
    const endSmartQuote = '’';
    const quote = "'";
    const editor = (doc: DocBuilder) => {
      return createEditor({
        doc,
        preset: new Preset<LightEditorPlugin>()
          .add(base)
          .add(textFormatting)
          .add(blockType)
          .add(textColorPlugin)
          .add([statusPlugin, { menuDisabled: true }])
          .add(emojiPlugin)
          .add(panelPlugin),
      });
    };
    it('should preserve formatting to inner content', () => {
      const { editorView, refs } = editor(
        doc(
          p(
            textColor({ color: '#ffc400' })('{<>}This'),
            ' ',
            subsup({ type: 'sub' })('is '),
            subsup({ type: 'sup' })('some '),
            em('formatted'),
            ' ',
            strike('text.{nextPos}'),
          ),
        ),
      );
      typeText(editorView, quote);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            textColor({ color: '#ffc400' })(`${quote}This`),
            ' ',
            subsup({ type: 'sub' })('is '),
            subsup({ type: 'sup' })('some '),
            em('formatted'),
            ' ',
            strike('text.'),
          ),
        ),
      );
      moveCursorToNextPos(editorView, refs, quote);
      typeText(editorView, quote);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            textColor({ color: '#ffc400' })(`${startSmartQuote}This`),
            ' ',
            subsup({ type: 'sub' })('is '),
            subsup({ type: 'sup' })('some '),
            em('formatted'),
            ' ',
            strike(`text.${endSmartQuote}`),
          ),
        ),
      );
    });
    it('should preserve content when adding quotes from middle of line', () => {
      const { editorView, refs } = editor(
        doc(
          p(
            textColor({ color: '#ffc400' })('This'),
            ' is {<>}some content.{nextPos}',
          ),
        ),
      );
      typeText(editorView, quote);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            textColor({ color: '#ffc400' })('This'),
            ` is ${quote}some content.`,
          ),
        ),
      );
      moveCursorToNextPos(editorView, refs, quote);
      typeText(editorView, quote);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            textColor({ color: '#ffc400' })('This'),
            ` is ${startSmartQuote}some content.${endSmartQuote}`,
          ),
        ),
      );
    });
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
    it('should add smart quotes with node at beginning/end of line', () => {
      const { editorView, refs } = editor(
        doc(
          p(
            '{<>}',
            status({
              text: 'Status',
              color: 'neutral',
              localId: '6bddf351-6c0d-4c5f-a7a9-3c3e7fb3c761',
            }),
            ' some content ',
            status({
              text: 'Status',
              color: 'neutral',
              localId: '6bddf351-6c0d-4c5f-a7a9-3c3e7fb3c761',
            }),
            '{nextPos}',
          ),
        ),
      );
      typeText(editorView, quote);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            quote,
            status({
              text: 'Status',
              color: 'neutral',
              localId: '6bddf351-6c0d-4c5f-a7a9-3c3e7fb3c761',
            }),
            ' some content ',
            status({
              text: 'Status',
              color: 'neutral',
              localId: '6bddf351-6c0d-4c5f-a7a9-3c3e7fb3c761',
            }),
          ),
        ),
      );
      moveCursorToNextPos(editorView, refs, quote);
      typeText(editorView, quote);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            startSmartQuote,
            status({
              text: 'Status',
              color: 'neutral',
              localId: '6bddf351-6c0d-4c5f-a7a9-3c3e7fb3c761',
            }),
            ' some content ',
            status({
              text: 'Status',
              color: 'neutral',
              localId: '6bddf351-6c0d-4c5f-a7a9-3c3e7fb3c761',
            }),
            endSmartQuote,
          ),
        ),
      );
    });
    it('should add smart quotes with emoji at beginning/end of line', () => {
      const { editorView, refs } = editor(
        doc(
          p(
            '{<>}',
            emoji({ shortName: ':slight_smile:', id: '1f642', text: '🙂' })(),
            ' some content ',
            emoji({ shortName: ':slight_smile:', id: '1f642', text: '🙂' })(),
            '{nextPos}',
          ),
        ),
      );
      typeText(editorView, quote);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            quote,
            emoji({ shortName: ':slight_smile:', id: '1f642', text: '🙂' })(),
            ' some content ',
            emoji({ shortName: ':slight_smile:', id: '1f642', text: '🙂' })(),
          ),
        ),
      );
      moveCursorToNextPos(editorView, refs, quote);
      typeText(editorView, quote);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            startSmartQuote,
            emoji({ shortName: ':slight_smile:', id: '1f642', text: '🙂' })(),
            ' some content ',
            emoji({ shortName: ':slight_smile:', id: '1f642', text: '🙂' })(),
            endSmartQuote,
          ),
        ),
      );
    });
    it('should add smart quotes inside block quote', () => {
      const { editorView, refs } = editor(
        doc(blockquote(p('some {<>}content inside a quote block{nextPos}'))),
      );
      typeText(editorView, quote);
      expect(editorView.state.doc).toEqualDocument(
        doc(blockquote(p(`some ${quote}content inside a quote block`))),
      );
      moveCursorToNextPos(editorView, refs, quote);
      typeText(editorView, quote);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          blockquote(
            p(
              `some ${startSmartQuote}content inside a quote block${endSmartQuote}`,
            ),
          ),
        ),
      );
    });
    it('should add smart quotes inside panel', () => {
      const { editorView, refs } = editor(
        doc(
          panel({ panelType: 'info' })(
            p('{<>}Some content inside a panel{nextPos}'),
          ),
        ),
      );
      typeText(editorView, quote);
      expect(editorView.state.doc).toEqualDocument(
        doc(panel({ panelType: 'info' })(p("'Some content inside a panel"))),
      );
      moveCursorToNextPos(editorView, refs, quote);
      typeText(editorView, quote);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          panel({ panelType: 'info' })(
            p(`${startSmartQuote}Some content inside a panel${endSmartQuote}`),
          ),
        ),
      );
    });
    it('should not add smart quotes if only a node exists in inner content', () => {
      const { editorView, refs } = editor(
        doc(
          p(
            '{<>}',
            emoji({ shortName: ':slight_smile:', id: '1f642', text: '🙂' })(),
            '{nextPos}',
          ),
        ),
      );
      typeText(editorView, quote);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            quote,
            emoji({ shortName: ':slight_smile:', id: '1f642', text: '🙂' })(),
          ),
        ),
      );
      moveCursorToNextPos(editorView, refs, quote);
      typeText(editorView, quote);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            quote,
            emoji({ shortName: ':slight_smile:', id: '1f642', text: '🙂' })(),
            quote,
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
  });
});
