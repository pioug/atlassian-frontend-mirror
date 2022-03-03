import { Slice } from 'prosemirror-model';
import { TextSelection, EditorState } from 'prosemirror-state';
import {
  doc,
  p,
  a,
  ul,
  li,
  alignment,
  panel,
  table,
  th,
  tr,
  decisionItem,
  decisionList,
  layoutColumn,
  layoutSection,
  nestedExpand,
  expand,
  emoji,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import {
  createProsemirrorEditorFactory,
  Preset,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { toJSON } from '../../../../utils';
import {
  handleParagraphBlockMarks,
  handlePasteLinkOnSelectedText,
  flattenNestedListInSlice,
  insertIntoPanel,
  handlePasteIntoTaskAndDecision,
  handleExpandPasteInTable,
} from '../../handlers';
import pastePlugin from '../../index';
import hyperlinkPlugin from '../../../hyperlink';
import textFormattingPlugin from '../../../text-formatting';
import tasksAndDecisionsPlugin from '../../../tasks-and-decisions';
import tablePlugin from '../../../table';
import expandPlugin from '../../../expand';
import layoutPlugin from '../../../layout';
import panelPlugin from '../../../panel';
import emojiPlugin from '../../../emoji';

describe('handleParagraphBlockMarks', () => {
  let slice: Slice;

  describe('slice has alignment or indentation marks', () => {
    beforeEach(() => {
      const paragraphWithAlignment = doc(
        alignment({ align: 'end' })(p('hello')), // source
      )(defaultSchema);

      const json = toJSON(paragraphWithAlignment);
      slice = Slice.fromJSON(defaultSchema, {
        content: json.content,
        openStart: 1,
        openEnd: 1,
      });
    });

    describe('destination supports those marks', () => {
      let state: EditorState;

      beforeEach(() => {
        state = createEditorState(
          doc(
            p('{<>}'), // destination
          ),
        );
      });

      it('should decrement the open depth of the slice', () => {
        const modifiedSlice = handleParagraphBlockMarks(state, slice);
        expect(modifiedSlice.openStart).toEqual(0);
      });

      it('retains alignment or indentation marks', () => {
        const modifiedSlice = handleParagraphBlockMarks(state, slice);
        expect(modifiedSlice.content.firstChild?.marks[0].type.name).toEqual(
          'alignment',
        );
      });
    });

    describe('destination does not support those marks', () => {
      let state: EditorState;

      beforeEach(() => {
        state = createEditorState(
          doc(
            panel()(p('{<>}')), // destination
          ),
        );
      });

      it('should not decrement the open depth of the slice', () => {
        const modifiedSlice = handleParagraphBlockMarks(state, slice);
        expect(modifiedSlice.openStart).toEqual(1);
      });

      it('drops alignment or indentation marks', () => {
        const modifiedSlice = handleParagraphBlockMarks(state, slice);
        expect(modifiedSlice.content.firstChild?.marks.length).toEqual(0);
      });

      it('handles multiple paragraphs', () => {
        const multipleParagraphs = doc(
          p('normal text'),
          alignment({ align: 'end' })(p('hello')),
          p('normal text'),
        )(defaultSchema);

        const json = toJSON(multipleParagraphs);
        slice = Slice.fromJSON(defaultSchema, {
          content: json.content,
          openStart: 1,
          openEnd: 1,
        });

        const expectedFragment = doc(
          p('normal text'),
          p('hello'),
          p('normal text'),
        )(defaultSchema);

        const modifiedSlice = handleParagraphBlockMarks(state, slice);
        expect(modifiedSlice.content.eq(expectedFragment.content)).toBeTruthy();
      });
    });
  });

  describe('slice does not have alignment or indentation marks', () => {
    beforeEach(() => {
      const paragraphWithoutAlignment = doc(
        p(
          a({ href: 'https://hello.atlassian.net' })('hello'), // source
        ),
      )(defaultSchema);

      const json = toJSON(paragraphWithoutAlignment);
      slice = Slice.fromJSON(defaultSchema, {
        content: json.content,
        openStart: 1,
        openEnd: 1,
      });
    });

    it('should not decrement the open depth of the slice', () => {
      const state = createEditorState(
        doc(
          panel()(p('{<>}')), // destination
        ),
      );

      const modifiedSlice = handleParagraphBlockMarks(state, slice);
      expect(modifiedSlice.openStart).toEqual(1);
    });
  });

  describe('destination already has content', () => {
    let state: EditorState;

    beforeEach(() => {
      state = createEditorState(
        doc(
          alignment({ align: 'center' })(p('pre-existing text {<>}')), // destination
        ),
      );
    });

    it('pasting a single paragraph should not alter the slice', () => {
      const modifiedSlice = handleParagraphBlockMarks(state, slice);
      expect(modifiedSlice.eq(slice)).toBeTruthy();
    });

    it('pasting multiple paragraphs should keep source formatting', () => {
      const multipleParagraphs = doc(
        p('normal text'),
        alignment({ align: 'end' })(p('hello')),
        p('normal text'),
      )(defaultSchema);

      const json = toJSON(multipleParagraphs);
      slice = Slice.fromJSON(defaultSchema, {
        content: json.content,
        openStart: 1,
        openEnd: 1,
      });

      const modifiedSlice = handleParagraphBlockMarks(state, slice);
      expect(modifiedSlice.openStart).toEqual(0);
    });
  });
});

describe('handleRichText', () => {
  describe('pasting into a table', () => {
    it('should flatten nested list on its own', () => {
      // prettier-ignore
      const pasteContent = doc(
        ul(
          li(
            p('a'),
            '{<}',
            ul(
              li(
                p('b')
              )
            )
          ),
          li(
            p('c{>}')
          )
        )
      );
      const pasteOriginState = createEditorState(pasteContent);
      const pasteSlice = pasteOriginState.doc.slice(
        pasteOriginState.selection.from,
        pasteOriginState.selection.to,
        // @ts-ignore
        true, // include parents
      );

      // prettier-ignore
      const expectedContent = doc(
        ul(
          li(
            p('b')
          ),
          li(
            p('c')
          )
        )
      )(defaultSchema);
      const expectedSlice = Slice.fromJSON(defaultSchema, {
        content: toJSON(expectedContent).content,
        openStart: 3,
        openEnd: 3,
      });

      const flattenedSlice = flattenNestedListInSlice(pasteSlice);
      expect(flattenedSlice.eq(expectedSlice)).toBeTruthy();
    });

    it('should flatten nested list and preserve following contents (single paragraph)', () => {
      // prettier-ignore
      const pasteContent = doc(
        ul(
          li(
            p('a'),
            '{<}',
            ul(
              li(
                p('b')
              )
            )
          ),
          li(
            p('c')
          ),
        ),
        p('text after list{>}')
      );
      const pasteOriginState = createEditorState(pasteContent);
      const pasteSlice = pasteOriginState.doc.slice(
        pasteOriginState.selection.from,
        pasteOriginState.selection.to,
        // @ts-ignore
        true, // include parents
      );

      // prettier-ignore
      const expectedContent = doc(
        ul(
          li(
            p('b')
          ),
          li(
            p('c')
          )
        ),
        p('text after list')
      )(defaultSchema);
      const expectedSlice = Slice.fromJSON(defaultSchema, {
        content: toJSON(expectedContent).content,
        openStart: 1,
        openEnd: 1,
      });

      const flattenedSlice = flattenNestedListInSlice(pasteSlice);
      expect(flattenedSlice.eq(expectedSlice)).toBeTruthy();
    });

    it('should flatten nested list and preserve following contents (paragraph + separate list)', () => {
      // prettier-ignore
      const pasteContent = doc(
        ul(
          li(
            p('a'),
            '{<}',
            ul(
              li(
                p('b')
              )
            )
          ),
          li(
            p('c')
          ),
        ),
        p('text between lists'),
        ul(
          li(
            p('d'),
          ),
          li(
            p('e{>}')
          ),
        )
      );
      const pasteOriginState = createEditorState(pasteContent);
      const pasteSlice = pasteOriginState.doc.slice(
        pasteOriginState.selection.from,
        pasteOriginState.selection.to,
        // @ts-ignore
        true, // include parents
      );

      // prettier-ignore
      const expectedContent = doc(
        ul(
          li(
            p('b')
          ),
          li(
            p('c')
          )
        ),
        p('text between lists'),
        ul(
          li(
            p('d')
          ),
          li(
            p('e')
          )
        )
      )(defaultSchema);
      const expectedSlice = Slice.fromJSON(defaultSchema, {
        content: toJSON(expectedContent).content,
        openStart: 3,
        openEnd: 3,
      });

      const flattenedSlice = flattenNestedListInSlice(pasteSlice);
      expect(flattenedSlice.eq(expectedSlice)).toBeTruthy();
    });

    it('should copy list inside a panel accordingly', () => {
      // prettier-ignore
      const originalDoc = createEditorState(
        doc(
          panel()(
            ul(
              li(p('{<}a')),
              li(p('b{>}'))
            ),
          ),
        )
      );
      const { tr } = originalDoc;

      // prettier-ignore
      const pasteOriginState = createEditorState(
        doc(
          panel()(
            ul(
              li(p('{<}1')),
              li(p('2{>}'))
            ),
          ),
        )
      );

      const pasteSlice = pasteOriginState.doc.slice(
        pasteOriginState.selection.from,
        pasteOriginState.selection.to,
        // @ts-ignore
        true, // include parents
      );

      // prettier-ignore
      const resultDoc = doc(
        panel()(
          ul(
            li(p('1')),
            li(p('2{<>}'))
          ),
        ),
      )(defaultSchema);

      const { panel: panelNode } = pasteOriginState.schema.nodes;

      insertIntoPanel(tr, pasteSlice, panelNode);
      expect(tr).toEqualDocumentAndSelection(resultDoc);
    });
  });
});

describe('handlePasteLinkOnSelectedText', () => {
  function createEditorWithSelection() {
    const stateDocument = doc(p('hello'), p('world'));
    const createEditor = createProsemirrorEditorFactory();
    const pasteOptions = {
      cardOptions: {},
    };

    const editor = createEditor({
      doc: stateDocument,
      preset: new Preset<LightEditorPlugin>()
        .add([pastePlugin, pasteOptions])
        .add(hyperlinkPlugin)
        .add(textFormattingPlugin),
    });
    const { editorView } = editor;
    const { state: oldState } = editorView;
    editorView.dispatch(
      oldState.tr.setSelection(TextSelection.create(oldState.doc, 1, 4)),
    );

    return editor;
  }

  function createPasteSlice(
    state: EditorState,
    href: string,
    text: string,
    isRichText: boolean,
  ) {
    const pasteContent = doc(
      p(
        a({
          href,
        })(isRichText ? href : text),
      ),
    );
    const pasteDocument = pasteContent(state.schema);
    const pasteJson = toJSON(pasteDocument);
    return Slice.fromJSON(state.schema, {
      content: pasteJson.content,
      openStart: 0,
      openEnd: 0,
    });
  }
  it('should add link mark for url that has % in it.', () => {
    const editor = createEditorWithSelection();
    const { editorView } = editor;
    const { state } = editorView;

    const pasteSlice = createPasteSlice(
      state,
      'https://redash.data.internal.atlassian.com/queries/90971?p_Start%20date=2021-06-01#214419',
      'https://redash.data.internal.atlassian.com/queries/90971?p_Start date=2021-06-01#214419',
      false,
    );

    const linkMarkAdded = handlePasteLinkOnSelectedText(pasteSlice)(state);
    expect(linkMarkAdded).toEqual(true);
  });

  it('should add link mark for url that has characters elibile for escaping.', () => {
    const editor = createEditorWithSelection();
    const { editorView } = editor;
    const { state } = editorView;

    const pasteSlice = createPasteSlice(
      state,
      'https://mozilla.org/?x=%D1%88%D0%B5%D0%BB%D0%BB%D1%8B',
      'https://mozilla.org/?x=шеллы',
      false,
    );

    const linkMarkAdded = handlePasteLinkOnSelectedText(pasteSlice)(state);
    expect(linkMarkAdded).toEqual(true);
  });

  it('should add link mark for rich text where both text.text and href of marks is without decoding', () => {
    const editor = createEditorWithSelection();
    const { editorView } = editor;
    const { state } = editorView;

    const pasteSlice = createPasteSlice(
      state,
      'https://mozilla.org/?x=%D1%88%D0%B5%D0%BB%D0%BB%D1%8B',
      'https://mozilla.org/?x=шеллы',
      true,
    );

    const linkMarkAdded = handlePasteLinkOnSelectedText(pasteSlice)(state);
    expect(linkMarkAdded).toEqual(true);
  });
});

describe('handlePasteIntoTaskAndDecision', () => {
  const case0: [
    string,
    string,
    DocBuilder,
    DocBuilder,
    DocBuilder,
    number,
    number,
  ] = [
    'destination is the middle of a decision node with text',
    'paste content is a panel',
    // Destination
    // prettier-ignore
    doc(
      decisionList({ localId: "test1" })(
        decisionItem({ localId: "test2" })(
          "Some text in {<>}a decision"
        )
      )
    ),
    // Pasted Content
    doc('{<}', panel()(p('Some text in a panel{>}'))),
    // Expected Document
    // prettier-ignore
    doc(
      decisionList({ localId: "test1" })(
        decisionItem({ localId: "test2" })(
          "Some text in a decision"
        )
      ),
      panel({ panelType: "info" })(p("Some text in a panel")),
    ),
    // Open Start & Open End for Paste Slice
    1,
    1,
  ];

  const case1: [
    string,
    string,
    DocBuilder,
    DocBuilder,
    DocBuilder,
    number,
    number,
  ] = [
    'destination is the middle of a decision node with text',
    'paste content is text',
    // Destination
    // prettier-ignore
    doc(
      decisionList({ localId: "test1" })(
        decisionItem({ localId: "test2" })(
          "Some text in {<>} a decision"
        )
      )
    ),
    // Pasted Content
    doc(p('{<}TEST{>}')),
    // Expected Document
    // prettier-ignore
    doc(
      decisionList({ localId: "test1" })(
        decisionItem({ localId: "test2" })(
          "Some text in TEST a decision"
        )
      ),
    ),
    // Open Start & Open End for Paste Slice
    1,
    1,
  ];

  const case2: [
    string,
    string,
    DocBuilder,
    DocBuilder,
    DocBuilder,
    number,
    number,
  ] = [
    'destination is a decision node (node selection)',
    'paste content is a panel',
    // Destination
    // prettier-ignore
    doc(
      '{<node>}',
      decisionList({ localId: "test1" })(
        decisionItem({ localId: "test2" })(
          "Some text in a decision"
        )
      ),
    ),
    // Pasted Content
    doc('{<}', panel()(p('Some text in a panel{>}'))),

    // Expected Document
    doc(panel()(p('Some text in a panel'))),

    // Open Start & Open End for Paste Slice
    0,
    0,
  ];

  const case3: [
    string,
    string,
    DocBuilder,
    DocBuilder,
    DocBuilder,
    number,
    number,
  ] = [
    'destination is a decision node with text',
    'paste content is an emoji (node selection)',
    // Destination
    // prettier-ignore
    doc(
      decisionList({ localId: "test1" })(
        decisionItem({ localId: "test2" })(
          "Some text in a {<>}decision"
        )
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      p(
        '{<node>}',
        emoji({ shortName: ":slight_smile:", id: "1f642", text: "🙂" })(),
      )
    ),

    // Expected Document
    // prettier-ignore
    doc(
      decisionList({ localId: "test1" })(
        decisionItem({ localId: "test2" })(
          "Some text in a ",
          emoji({ shortName: ":slight_smile:", id: "1f642", text: "🙂" })(),
          "decision"
        )
      )
    ),

    // Open Start & Open End for Paste Slice
    1,
    1,
  ];

  describe.each<
    [string, string, DocBuilder, DocBuilder, DocBuilder, number, number]
  >([case0, case1, case2, case3])(
    '[case%#] when %s and %s',
    (
      _scenarioDest,
      _scenarioContent,
      destinationDocument,
      pasteContent,
      expectedDocument,
      openStart,
      openEnd,
    ) => {
      it('should match the expected document and selection', () => {
        const createEditor = createProsemirrorEditorFactory();

        const editor = (doc: any) => {
          const preset = new Preset<LightEditorPlugin>()
            .add([pastePlugin, {}])
            .add(hyperlinkPlugin)
            .add(tasksAndDecisionsPlugin)
            .add(panelPlugin)
            .add(emojiPlugin);

          return createEditor({
            doc,
            preset,
          });
        };

        const { editorView } = editor(destinationDocument);
        const pasteSlice = new Slice(
          pasteContent(editorView.state.schema).content,
          openStart,
          openEnd,
        );
        handlePasteIntoTaskAndDecision(pasteSlice)(
          editorView.state,
          editorView.dispatch,
        );
        expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
        expect(() => {
          editorView.state.tr.doc.check();
        }).not.toThrow();
      });
    },
  );
});

describe('handleExpand', () => {
  const case0: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is in a table',
    'paste content is an expand',
    // Destination
    // prettier-ignore
    doc(
      table({ isNumberColumnEnabled: false, layout: "default", localId: "test" })
      (tr(th({})(p('{<>}'))))
    ),
    // Pasted Content
    doc('{<}', expand({ title: '' })(p('Expand{>}'))),

    // Expected Document
    // prettier-ignore
    doc(
      table({ isNumberColumnEnabled: false, layout: "default", localId: "test" })(
        tr(th({})(nestedExpand({ title: "" })(p("Expand"))))
      ),
    ),
  ];

  const case1: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is in a table',
    'paste content is an expand inside a layout - function should return early',
    // Destination
    // prettier-ignore
    doc(
      table({ isNumberColumnEnabled: false, layout: "default", localId: "test" })
      (tr(th({})(p('{<>}'))))
    ),
    // Pasted Content
    doc(
      '{<}',
      layoutSection(
        layoutColumn({ width: 100 })(expand({ title: '' })(p('Expand{>}'))),
      ),
    ),

    // Expected Document
    // prettier-ignore
    doc(
      table({ isNumberColumnEnabled: false, layout: "default", localId: "test" })
      (tr(th({})(p('{<>}'))))
    ),
  ];

  describe.each<[string, string, DocBuilder, DocBuilder, DocBuilder]>([
    case0,
    case1,
  ])(
    '[case%#] when %s and %s',
    (
      _scenarioDest,
      _scenarioContent,
      destinationDocument,
      pasteContent,
      expectedDocument,
    ) => {
      it('should match the expected document and selection', () => {
        const createEditor = createProsemirrorEditorFactory();

        const editor = (doc: any) => {
          const preset = new Preset<LightEditorPlugin>()
            .add([pastePlugin, {}])
            .add(tablePlugin)
            .add(expandPlugin)
            .add(layoutPlugin);

          return createEditor({
            doc,
            preset,
          });
        };

        const { editorView } = editor(destinationDocument);
        const pasteSlice = new Slice(
          pasteContent(editorView.state.schema).content,
          1,
          1,
        );

        handleExpandPasteInTable(pasteSlice)(
          editorView.state,
          editorView.dispatch,
        );
        expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
        expect(() => {
          editorView.state.tr.doc.check();
        }).not.toThrow();
      });
    },
  );
});
