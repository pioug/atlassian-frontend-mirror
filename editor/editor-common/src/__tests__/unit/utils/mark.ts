import { uuid } from '@atlaskit/adf-schema';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import type { DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  code,
  doc,
  em,
  emoji,
  hardBreak,
  li,
  mention,
  p,
  strong,
  subsup,
  table,
  td,
  tdEmpty,
  tr,
  ul,
} from '@atlaskit/editor-test-helpers/doc-builder';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';

import { toggleMark } from '../../../mark';
import { ProviderFactory } from '../../../provider-factory';

const TABLE_LOCAL_ID = 'test-table-local-id';

describe('mark utilities', () => {
  beforeAll(() => {
    uuid.setStatic(TABLE_LOCAL_ID);
  });

  afterAll(() => {
    uuid.setStatic(false);
  });

  const createEditor = createEditorFactory();

  describe('toggleMark', () => {
    const helgaMention = mention({ id: '1234', text: '@helga' });
    const grinningEmoji = emoji({ shortName: ':grinning:', text: '😀' });
    const editor = (doc: DocBuilder) => {
      return createEditor({
        doc,
        editorProps: {
          mentionProvider: new Promise(() => {}),
          emojiProvider: new Promise(() => {}),
          allowTables: true,
        },
        providerFactory: ProviderFactory.create({
          emojiProvider: new Promise(() => {}),
        }),
      });
    };

    describe('on mentions and emojis', () => {
      it('enables code mark', () => {
        const { editorView, editorAPI } = editor(
          doc(
            p('{<}hey', helgaMention(), grinningEmoji()),
            p(helgaMention(), grinningEmoji()),
            p('hey', grinningEmoji(), '{>}'),
          ),
        );

        editorAPI.core.actions.execute(
          toggleMark(editorView.state.schema.marks.code),
        );

        expect(editorView.state.doc).toEqualDocument(
          doc(p(code('hey@helga😀')), p(code('@helga😀')), p(code('hey😀'))),
        );
      });
    });

    describe('in cell selection', () => {
      describe('with mentions and emojis', () => {
        it('enables code mark', () => {
          const { editorView, editorAPI } = editor(
            doc(
              table()(
                tr(td()(p('{<cell}hey', grinningEmoji())), tdEmpty, tdEmpty),
                tr(td()(p('hey', helgaMention())), tdEmpty, tdEmpty),
                tr(
                  td()(p('{cell>}', helgaMention(), grinningEmoji())),
                  tdEmpty,
                  tdEmpty,
                ),
              ),
            ),
          );

          editorAPI.core.actions.execute(
            toggleMark(editorView.state.schema.marks.code),
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(td()(p(code('hey😀'))), tdEmpty, tdEmpty),
                tr(td()(p(code('hey@helga'))), tdEmpty, tdEmpty),
                tr(td()(p(code('@helga😀'))), tdEmpty, tdEmpty),
              ),
            ),
          );
        });
      });

      it('enables code mark', () => {
        const { editorView, editorAPI } = createEditor({
          doc: doc(
            table()(
              tr(td()(p('{<cell}hey')), tdEmpty, tdEmpty),
              tr(td()(p('hey')), tdEmpty, tdEmpty),
              tr(td()(p('{cell>}hey')), tdEmpty, tdEmpty),
            ),
          ),
          editorProps: { allowTables: true },
        });

        editorAPI.core.actions.execute(
          toggleMark(editorView.state.schema.marks.code),
        );

        expect(editorView.state.doc).toEqualDocument(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              tr(td()(p(code('hey'))), tdEmpty, tdEmpty),
              tr(td()(p(code('hey'))), tdEmpty, tdEmpty),
              tr(td()(p(code('hey'))), tdEmpty, tdEmpty),
            ),
          ),
        );
      });

      it('enables the bold mark', () => {
        const { editorView, editorAPI } = createEditor({
          doc: doc(
            table()(
              tr(td()(p('{<cell}hey')), tdEmpty, tdEmpty),
              tr(td()(p('hey')), tdEmpty, tdEmpty),
              tr(td()(p('{cell>}hey')), tdEmpty, tdEmpty),
            ),
          ),
          editorProps: { allowTables: true },
        });

        editorAPI.core.actions.execute(
          toggleMark(editorView.state.schema.marks.strong),
        );

        expect(editorView.state.doc).toEqualDocument(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              tr(td()(p(strong('hey'))), tdEmpty, tdEmpty),
              tr(td()(p(strong('hey'))), tdEmpty, tdEmpty),
              tr(td()(p(strong('hey'))), tdEmpty, tdEmpty),
            ),
          ),
        );
      });

      it('bolds the selection when only part of the selection has the bold mark', () => {
        const { editorView, editorAPI } = createEditor({
          doc: doc(
            table()(
              tr(td({})(p('{<cell}a1')), tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, td({})(p(strong('{cell>}b3')))),
              tr(tdEmpty, tdEmpty, tdEmpty),
            ),
          ),
          editorProps: { allowTables: true },
        });

        editorAPI.core.actions.execute(
          toggleMark(editorView.state.schema.marks.strong),
        );

        expect(editorView.state.doc).toEqualDocument(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              tr(td({})(p(strong('{<cell}a1'))), tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, td({})(p(strong('b3{cell>}')))),
              tr(tdEmpty, tdEmpty, tdEmpty),
            ),
          ),
        );
      });
    });

    it('enables the bold mark', () => {
      const { editorView, editorAPI } = editor(
        doc(p('{<}text', hardBreak(), 'here{>}')),
      );

      editorAPI.core.actions.execute(
        toggleMark(editorView.state.schema.marks.strong),
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(p(strong('text'), hardBreak(), strong('here'))),
      );
    });

    it('bolds the selection when only part of the selection has the bold mark', () => {
      const { editorView, editorAPI } = editor(
        doc(p('{<}text', hardBreak(), strong('here{>}'))),
      );

      editorAPI.core.actions.execute(
        toggleMark(editorView.state.schema.marks.strong),
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(p(strong('text'), hardBreak(), strong('here'))),
      );
    });

    it('bolds the selection when only part of the selection has the bold mark with various elements', () => {
      const { editorView, editorAPI } = editor(
        doc(
          p('{<}text', hardBreak(), 'other text'),
          ul(li(p('first item')), li(p('second item'))),
          p(subsup({ type: 'sub' })('sub text')),
          p(strong('here{>}')),
        ),
      );

      editorAPI.core.actions.execute(
        toggleMark(editorView.state.schema.marks.strong),
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(strong('text'), hardBreak(), strong('other text')),
          ul(li(p(strong('first item'))), li(p(strong('second item')))),
          p(subsup({ type: 'sub' })(strong('sub text'))),
          p(strong('here')),
        ),
      );
    });

    it('bolds the selection when only part of the selection has the bold mark mixed with tables', () => {
      const { editorView, editorAPI } = editor(
        doc(
          p('{<}text', hardBreak(), 'other text'),
          ul(li(p('first item')), li(p('second item'))),
          p(subsup({ type: 'sub' })('sub text')),
          table()(
            tr(td({})(p('a1')), tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty, td({})(p(strong('b3')))),
            tr(tdEmpty, tdEmpty, tdEmpty),
          ),
          p(strong('here{>}')),
        ),
      );

      editorAPI.core.actions.execute(
        toggleMark(editorView.state.schema.marks.strong),
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(strong('text'), hardBreak(), strong('other text')),
          ul(li(p(strong('first item'))), li(p(strong('second item')))),
          p(subsup({ type: 'sub' })(strong('sub text'))),
          table({ localId: TABLE_LOCAL_ID })(
            tr(td({})(p(strong('a1'))), tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty, td({})(p(strong('b3')))),
            tr(tdEmpty, tdEmpty, tdEmpty),
          ),
          p(strong('here')),
        ),
      );
    });

    it('enables muliple marks when toggled', () => {
      const { editorView, editorAPI } = editor(
        doc(p('{<}text', hardBreak(), 'here{>}')),
      );

      editorAPI.core.actions.execute(
        toggleMark(editorView.state.schema.marks.strong),
      );

      editorAPI.core.actions.execute(
        toggleMark(editorView.state.schema.marks.em),
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(p(em(strong('text')), hardBreak(), em(strong('here')))),
      );
    });

    it('can toggle a mark on and off', () => {
      const { editorView, editorAPI } = editor(
        doc(p('{<}text', hardBreak(), 'here{>}')),
      );

      editorAPI.core.actions.execute(
        toggleMark(editorView.state.schema.marks.strong),
      );

      editorAPI.core.actions.execute(
        toggleMark(editorView.state.schema.marks.strong),
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(p('text', hardBreak(), 'here')),
      );
    });

    it('can toggle a mark with different attributes', () => {
      const { editorView, editorAPI } = editor(doc(p('{<}text here{>}')));

      editorAPI.core.actions.execute(
        toggleMark(editorView.state.schema.marks.subsup, { type: 'sup' }),
      );

      editorAPI.core.actions.execute(
        toggleMark(editorView.state.schema.marks.subsup, { type: 'sub' }),
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(p(subsup({ type: 'sub' })('text here'))),
      );
    });

    it('toggles only marks of same type and attributes', () => {
      const { editorView, editorAPI } = editor(
        doc(
          p(
            'This is the first normal {<}text ',
            subsup({ type: 'sup' })('This text is sup'),
            ' Spacer words ',
            subsup({ type: 'sub' })('This text is sub'),
            ' Words at{>} the end',
          ),
        ),
      );

      editorAPI.core.actions.execute(
        toggleMark(editorView.state.schema.marks.subsup, { type: 'sup' }),
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            'This is the first normal ',
            subsup({ type: 'sup' })(
              'text This text is sup Spacer words This text is sub Words at',
            ),
            ' the end',
          ),
        ),
      );
    });

    it('can apply two different marks at different points', () => {
      const { editorView, editorAPI } = editor(
        doc(p('This is the first normal text {<>}')),
      );

      editorAPI.core.actions.execute(
        toggleMark(editorView.state.schema.marks.subsup, { type: 'sup' }),
      );

      insertText(editorView, 'This text is sup');
      sendKeyToPm(editorView, 'Enter');
      insertText(editorView, 'This is the second normal text ');

      editorAPI.core.actions.execute(
        toggleMark(editorView.state.schema.marks.subsup, { type: 'sub' }),
      );

      insertText(editorView, 'This is sub');

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            'This is the first normal text ',
            subsup({ type: 'sup' })('This text is sup'),
          ),
          p(
            'This is the second normal text ',
            subsup({ type: 'sub' })('This is sub'),
          ),
        ),
      );
    });

    it('can apply a mark half way through a selection', () => {
      const { editorView, editorAPI } = editor(doc(p('te{<}xt{>}')));

      editorAPI.core.actions.execute(
        toggleMark(editorView.state.schema.marks.strong),
      );

      expect(editorView.state.doc).toEqualDocument(doc(p('te', strong('xt'))));
    });

    it('can toggle a mark for the current cursor position', () => {
      const {
        editorView,
        refs: { nextCursorPos },
        editorAPI,
      } = editor(doc(p('text here{<>}{nextCursorPos}')));

      editorAPI.core.actions.execute(
        toggleMark(editorView.state.schema.marks.strong),
      );

      editorAPI.core.actions.execute(
        toggleMark(editorView.state.schema.marks.strong),
      );

      expect(editorView.state.selection.from).toEqual(nextCursorPos);
      expect(editorView.state.doc).toEqualDocument(
        doc(p('text here', strong())),
      );
    });

    it('enables a mark with attributes', () => {
      const { editorView, editorAPI } = editor(doc(p('{<}text here{>}')));

      editorAPI.core.actions.execute(
        toggleMark(editorView.state.schema.marks.subsup, { type: 'sup' }),
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(p(subsup({ type: 'sup' })('text here'))),
      );
    });

    it('can toggle marks with only differing attributes', () => {
      const { editorView, editorAPI } = editor(
        doc(p('text here', subsup({ type: 'sub' })('{<>}'))),
      );

      editorAPI.core.actions.execute(
        toggleMark(editorView.state.schema.marks.subsup, { type: 'sup' }),
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(p('text here', subsup({ type: 'sup' })(''))),
      );
    });
  });
});
