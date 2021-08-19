import { ProviderFactory } from '@atlaskit/editor-common';
import {
  filter,
  isNthParentOfType,
  isEmptySelectionAtStart,
  isFirstChildOfParent,
  findCutBefore,
  toggleMark,
} from '../../../utils/commands';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';

import {
  p,
  table,
  tr,
  td,
  ul,
  li,
  doc,
  hardBreak,
  strong,
  em,
  subsup,
  tdEmpty,
  code,
  emoji,
  mention,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';

import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import { uuid } from '@atlaskit/adf-schema';

import { Command } from '../../../types';

const TABLE_LOCAL_ID = 'test-table-local-id';

describe('utils -> commands', () => {
  beforeAll(() => {
    uuid.setStatic(TABLE_LOCAL_ID);
  });

  afterAll(() => {
    uuid.setStatic(false);
  });

  const createEditor = createEditorFactory();

  describe('filter', () => {
    let cb: jest.Mock;

    beforeEach(() => {
      cb = jest.fn();
    });

    it('always calls command if empty predicate array', () => {
      const { editorView } = createEditor({});
      filter([], cb)(editorView.state, editorView.dispatch);
      expect(cb).toHaveBeenCalledTimes(1);
    });

    it('does nothing with falsey predicate as function', () => {
      const falseFilter = jest.fn();

      const { editorView } = createEditor({});
      const result = filter(falseFilter, cb)(
        editorView.state,
        editorView.dispatch,
      );

      expect(cb).not.toHaveBeenCalled();
      expect(falseFilter).toHaveBeenCalledTimes(1);
      expect(falseFilter).toHaveBeenLastCalledWith(editorView.state, undefined);
      expect(result).toBe(false);
    });

    it('does nothing with one falsey predicate in array', () => {
      const trueFilter = jest.fn();
      const falseFilter = jest.fn();

      const { editorView } = createEditor({});
      const result = filter(
        [
          () => {
            trueFilter();
            return true;
          },
          () => {
            falseFilter();
            return false;
          },
        ],
        cb,
      )(editorView.state, editorView.dispatch);

      expect(cb).not.toHaveBeenCalled();
      expect(trueFilter).toHaveBeenCalledTimes(1);
      expect(falseFilter).toHaveBeenCalledTimes(1);
      expect(result).toBe(false);
    });

    it('calls command if filter was true', () => {
      const trueFilter = jest.fn();

      const { editorView } = createEditor({});
      const result = filter(
        [
          () => {
            trueFilter();
            return true;
          },
        ],
        cb,
      )(editorView.state, editorView.dispatch);

      expect(cb).toHaveBeenCalledTimes(1);
      expect(trueFilter).toHaveBeenCalledTimes(1);
      expect(result).toBe(false);
    });

    it('passes through state, dispatch and view', () => {
      const trueFilter = jest.fn();

      const command: Command = (state, dispatch, view) => {
        cb();
        expect(state).toBe(editorView.state);
        expect(dispatch).toBe(editorView.dispatch);
        expect(view).toBe(editorView);

        return true;
      };

      const { editorView } = createEditor({});
      const result = filter(
        [
          (state, view) => {
            trueFilter(state, view);
            return true;
          },
        ],
        command,
      )(editorView.state, editorView.dispatch, editorView);

      expect(cb).toHaveBeenCalledTimes(1);
      expect(trueFilter).toHaveBeenCalledTimes(1);
      expect(trueFilter).toHaveBeenLastCalledWith(editorView.state, editorView);

      // ensure we pass back the result from the callback
      expect(result).toBe(true);
    });
  });

  describe('isNthParentOfType', () => {
    const { editorView } = createEditor({
      doc: table()(tr(td()(p('hel{<>}lo')))),
      editorProps: { allowTables: true },
    });

    it('returns true for paragraph at selection depth', () => {
      expect(isNthParentOfType('paragraph', 0)(editorView.state)).toBe(true);
    });

    it('returns false for some other node at selection depth', () => {
      expect(isNthParentOfType('h1', 0)(editorView.state)).toBe(false);
    });

    it('returns true for td at parent from selection', () => {
      expect(isNthParentOfType('tableCell', 1)(editorView.state)).toBe(true);
    });

    it('returns true for tr at second level from selection', () => {
      expect(isNthParentOfType('tableRow', 2)(editorView.state)).toBe(true);
    });

    it('returns true for table at third level from selection', () => {
      expect(isNthParentOfType('table', 3)(editorView.state)).toBe(true);
    });

    it('returns true for doc at fourth level from selection', () => {
      expect(isNthParentOfType('doc', 4)(editorView.state)).toBe(true);
    });

    it('returns false for nodes beyond fourth level from selection', () => {
      expect(isNthParentOfType('doc', 5)(editorView.state)).toBe(false);
    });
  });

  describe('isEmptySelectionAtStart', () => {
    describe('paragraph at top level', () => {
      it('returns true with selection at start', () => {
        const { editorView } = createEditor({
          doc: doc(p('{<>}hello')),
        });

        expect(isEmptySelectionAtStart(editorView.state)).toBe(true);
      });

      it('returns false with selection at end', () => {
        const { editorView } = createEditor({
          doc: doc(p('hello{<>}')),
        });

        expect(isEmptySelectionAtStart(editorView.state)).toBe(false);
      });

      it('returns false with selection at middle', () => {
        const { editorView } = createEditor({
          doc: doc(p('he{<>}llo')),
        });

        expect(isEmptySelectionAtStart(editorView.state)).toBe(false);
      });

      it('returns true for start of second paragraph at start', () => {
        const { editorView } = createEditor({
          doc: doc(p('hello'), p('{<>}world')),
        });

        expect(isEmptySelectionAtStart(editorView.state)).toBe(true);
      });

      it('returns false for start of second paragraph at end', () => {
        const { editorView } = createEditor({
          doc: doc(p('hello'), p('world{<>}')),
        });

        expect(isEmptySelectionAtStart(editorView.state)).toBe(false);
      });
    });

    describe('nested paragraph inside table', () => {
      it('returns true with selection at start', () => {
        const { editorView } = createEditor({
          doc: doc(table()(tr(td()(p('{<>}hello'))))),
          editorProps: { allowTables: true },
        });

        expect(isEmptySelectionAtStart(editorView.state)).toBe(true);
      });

      it('returns false with selection at end', () => {
        const { editorView } = createEditor({
          doc: doc(table()(tr(td()(p('hello{<>}'))))),
          editorProps: { allowTables: true },
        });

        expect(isEmptySelectionAtStart(editorView.state)).toBe(false);
      });

      it('returns false with selection at middle', () => {
        const { editorView } = createEditor({
          doc: doc(table()(tr(td()(p('he{<>}llo'))))),
          editorProps: { allowTables: true },
        });

        expect(isEmptySelectionAtStart(editorView.state)).toBe(false);
      });
    });
  });

  describe('isFirstChildOfParent', () => {
    describe('top level paragraphs', () => {
      it('returns true for first paragraph at top level', () => {
        const { editorView } = createEditor({
          doc: doc(p('{<>}hello'), p('world')),
        });

        expect(isFirstChildOfParent(editorView.state)).toBe(true);
      });

      it('returns true for second paragraph at top level', () => {
        const { editorView } = createEditor({
          doc: doc(p('hello'), p('wo{<>}rld')),
        });

        expect(isFirstChildOfParent(editorView.state)).toBe(true);
      });
    });

    describe('list item with two paragraphs', () => {
      it('returns true with selection in first', () => {
        const { editorView } = createEditor({
          doc: doc(ul(li(p('{<>}hello'), p('world')))),
        });

        expect(isFirstChildOfParent(editorView.state)).toBe(true);
      });

      it('returns false with selection in second', () => {
        const { editorView } = createEditor({
          doc: doc(ul(li(p('hello'), p('wo{<>}rld')))),
        });

        expect(isFirstChildOfParent(editorView.state)).toBe(false);
      });
    });

    describe('multiple list items', () => {
      it('returns true with selection in start of second li', () => {
        const { editorView } = createEditor({
          doc: doc(ul(li(p('first')), li(p('{<>}hello')))),
        });

        expect(isFirstChildOfParent(editorView.state)).toBe(true);
      });

      it('returns true with selection in first p of first nested li', () => {
        const { editorView } = createEditor({
          doc: doc(ul(li(p('first'), ul(li(p('{<>}hello'), p('world')))))),
        });

        expect(isFirstChildOfParent(editorView.state)).toBe(true);
      });

      it('returns false with selection in second p of first nested li', () => {
        const { editorView } = createEditor({
          doc: doc(ul(li(p('first'), ul(li(p('hello'), p('{<>}world')))))),
        });

        expect(isFirstChildOfParent(editorView.state)).toBe(false);
      });

      it('returns true with selection at start of first p of second nested li', () => {
        const { editorView } = createEditor({
          doc: doc(
            ul(
              li(
                p('first'),
                ul(li(p('hello'), p('world')), li(p('{<>}second'))),
              ),
            ),
          ),
        });

        expect(isFirstChildOfParent(editorView.state)).toBe(true);
      });
    });
  });

  describe('findCutBefore', () => {
    it('finds a split in a balanced tree', () => {
      const { editorView } = createEditor({
        doc: doc(ul(li(p('first')), li(p('{<>}second')))),
      });

      const { $from } = editorView.state.selection;
      const { listItem } = editorView.state.schema.nodes;

      const $cut = findCutBefore($from);
      expect($cut).not.toBeNull();

      expect($cut!.nodeBefore!.type).toBe(listItem);
      expect($cut!.nodeAfter!.type).toBe(listItem);

      expect($cut!.nodeBefore!.firstChild!.textContent).toBe('first');
      expect($cut!.nodeAfter!.firstChild!.textContent).toBe('second');
    });

    it('finds a split in an unbalanced tree above', () => {
      const { editorView } = createEditor({
        doc: doc(ul(li(p('first'), ul(li(p('nested')))), li(p('{<>}second')))),
      });

      const { $from } = editorView.state.selection;
      const { listItem } = editorView.state.schema.nodes;

      const $cut = findCutBefore($from);
      expect($cut).not.toBeNull();

      expect($cut!.nodeBefore!.type).toBe(listItem);
      expect($cut!.nodeAfter!.type).toBe(listItem);

      expect($cut!.nodeBefore!.firstChild!.textContent).toBe('first');
      expect($cut!.nodeAfter!.firstChild!.textContent).toBe('second');
    });

    it('finds a split in an unbalanced tree below', () => {
      const { editorView, refs } = createEditor({
        doc: doc(
          ul(
            li(p('first'), ul(li(p('nested')))),
            li(p('second'), p('nested'), ul(li(p('{<>}child')))),
          ),
        ),
      });

      const { $from } = editorView.state.selection;

      const $cut = findCutBefore($from);
      expect($cut).not.toBeNull();

      expect($cut!.nodeBefore).toBeDefined();
      expect($cut!.nodeAfter).toBeDefined();
      expect($cut!.pos).toBe(refs['<>'] - 3);
    });

    it('does not search across isolating boundaries', () => {
      const { editorView } = createEditor({
        doc: doc(table()(tr(td()(p('{<>}hey'))))),
        editorProps: { allowTables: true },
      });

      const { $from } = editorView.state.selection;

      const $cut = findCutBefore($from);
      expect($cut).toBeNull();
    });
  });

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
        const { editorView } = editor(
          doc(
            p('{<}hey', helgaMention(), grinningEmoji()),
            p(helgaMention(), grinningEmoji()),
            p('hey', grinningEmoji(), '{>}'),
          ),
        );

        toggleMark(editorView.state.schema.marks.code)(
          editorView.state,
          editorView.dispatch,
        );

        expect(editorView.state.doc).toEqualDocument(
          doc(p(code('hey@helga😀')), p(code('@helga😀')), p(code('hey😀'))),
        );
      });
    });

    describe('in cell selection', () => {
      describe('with mentions and emojis', () => {
        it('enables code mark', () => {
          const { editorView } = editor(
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

          toggleMark(editorView.state.schema.marks.code)(
            editorView.state,
            editorView.dispatch,
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
        const { editorView } = createEditor({
          doc: doc(
            table()(
              tr(td()(p('{<cell}hey')), tdEmpty, tdEmpty),
              tr(td()(p('hey')), tdEmpty, tdEmpty),
              tr(td()(p('{cell>}hey')), tdEmpty, tdEmpty),
            ),
          ),
          editorProps: { allowTables: true },
        });

        toggleMark(editorView.state.schema.marks.code)(
          editorView.state,
          editorView.dispatch,
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
        const { editorView } = createEditor({
          doc: doc(
            table()(
              tr(td()(p('{<cell}hey')), tdEmpty, tdEmpty),
              tr(td()(p('hey')), tdEmpty, tdEmpty),
              tr(td()(p('{cell>}hey')), tdEmpty, tdEmpty),
            ),
          ),
          editorProps: { allowTables: true },
        });

        toggleMark(editorView.state.schema.marks.strong)(
          editorView.state,
          editorView.dispatch,
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

      it('removes the bold mark when only part of the selection has the mark', () => {
        const { editorView } = createEditor({
          doc: doc(
            table()(
              tr(td({})(p('{<cell}a1')), tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, td({})(p(strong('{cell>}b3')))),
              tr(tdEmpty, tdEmpty, tdEmpty),
            ),
          ),
          editorProps: { allowTables: true },
        });

        toggleMark(editorView.state.schema.marks.strong)(
          editorView.state,
          editorView.dispatch,
        );

        expect(editorView.state.doc).toEqualDocument(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              tr(td({})(p('{<cell}a1')), tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, td({})(p('b3{cell>}'))),
              tr(tdEmpty, tdEmpty, tdEmpty),
            ),
          ),
        );
      });
    });

    it('enables the bold mark', () => {
      const { editorView } = editor(doc(p('{<}text', hardBreak(), 'here{>}')));

      toggleMark(editorView.state.schema.marks.strong)(
        editorView.state,
        editorView.dispatch,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(p(strong('text'), hardBreak(), strong('here'))),
      );
    });

    it('removes the bold mark when only part of the selection has the mark', () => {
      const { editorView } = editor(
        doc(p('{<}text', hardBreak(), strong('here{>}'))),
      );

      toggleMark(editorView.state.schema.marks.strong)(
        editorView.state,
        editorView.dispatch,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(p('text', hardBreak(), 'here')),
      );
    });

    it('enables mutliple marks when toggled', () => {
      const { editorView } = editor(doc(p('{<}text', hardBreak(), 'here{>}')));

      toggleMark(editorView.state.schema.marks.strong)(
        editorView.state,
        editorView.dispatch,
      );

      toggleMark(editorView.state.schema.marks.em)(
        editorView.state,
        editorView.dispatch,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(p(em(strong('text')), hardBreak(), em(strong('here')))),
      );
    });

    it('can toggle a mark on and off', () => {
      const { editorView } = editor(doc(p('{<}text', hardBreak(), 'here{>}')));

      toggleMark(editorView.state.schema.marks.strong)(
        editorView.state,
        editorView.dispatch,
      );

      toggleMark(editorView.state.schema.marks.strong)(
        editorView.state,
        editorView.dispatch,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(p('text', hardBreak(), 'here')),
      );
    });

    it('can toggle a mark with different attributes', () => {
      const { editorView } = editor(doc(p('{<}text here{>}')));

      toggleMark(editorView.state.schema.marks.subsup, { type: 'sup' })(
        editorView.state,
        editorView.dispatch,
      );

      toggleMark(editorView.state.schema.marks.subsup, { type: 'sub' })(
        editorView.state,
        editorView.dispatch,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(p(subsup({ type: 'sub' })('text here'))),
      );
    });

    it('toggles only marks of same type and attributes', () => {
      const { editorView } = editor(
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

      toggleMark(editorView.state.schema.marks.subsup, { type: 'sup' })(
        editorView.state,
        editorView.dispatch,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            'This is the first normal text This text is sup Spacer words ',
            subsup({ type: 'sub' })('This text is sub'),
            ' Words at the end',
          ),
        ),
      );
    });

    it('can apply two different marks at different points', () => {
      const { editorView } = editor(
        doc(p('This is the first normal text {<>}')),
      );

      toggleMark(editorView.state.schema.marks.subsup, { type: 'sup' })(
        editorView.state,
        editorView.dispatch,
      );

      insertText(editorView, 'This text is sup');
      sendKeyToPm(editorView, 'Enter');
      insertText(editorView, 'This is the second normal text ');

      toggleMark(editorView.state.schema.marks.subsup, { type: 'sub' })(
        editorView.state,
        editorView.dispatch,
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
      const { editorView } = editor(doc(p('te{<}xt{>}')));

      toggleMark(editorView.state.schema.marks.strong)(
        editorView.state,
        editorView.dispatch,
      );

      expect(editorView.state.doc).toEqualDocument(doc(p('te', strong('xt'))));
    });

    it('can toggle a mark for the current cursor position', () => {
      const {
        editorView,
        refs: { nextCursorPos },
      } = editor(doc(p('text here{<>}{nextCursorPos}')));

      toggleMark(editorView.state.schema.marks.strong)(
        editorView.state,
        editorView.dispatch,
      );

      toggleMark(editorView.state.schema.marks.strong)(
        editorView.state,
        editorView.dispatch,
      );

      expect(editorView.state.selection.from).toEqual(nextCursorPos);
      expect(editorView.state.doc).toEqualDocument(
        doc(p('text here', strong())),
      );
    });

    it('enables a mark with attributes', () => {
      const { editorView } = editor(doc(p('{<}text here{>}')));

      toggleMark(editorView.state.schema.marks.subsup, { type: 'sup' })(
        editorView.state,
        editorView.dispatch,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(p(subsup({ type: 'sup' })('text here'))),
      );
    });

    it('can toggle marks with only differing attributes', () => {
      const { editorView } = editor(
        doc(p('text here', subsup({ type: 'sub' })('{<>}'))),
      );

      toggleMark(editorView.state.schema.marks.subsup, { type: 'sup' })(
        editorView.state,
        editorView.dispatch,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(p('text here', subsup({ type: 'sup' })(''))),
      );
    });
  });
});
