import { Slice } from 'prosemirror-model';
import { TextSelection, EditorState } from 'prosemirror-state';
import { MediaADFAttrs } from '@atlaskit/adf-schema';
import {
  doc,
  p,
  a,
  h1,
  ul,
  li,
  alignment,
  panel,
  caption,
  table,
  th,
  tr,
  td,
  decisionItem,
  decisionList,
  layoutColumn,
  layoutSection,
  nestedExpand,
  expand,
  emoji,
  DocBuilder,
  mediaSingle,
  media,
  blockquote,
  taskList,
  taskItem,
  bodiedExtension,
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
  handlePasteIntoTaskOrDecisionOrPanel,
  handleExpandPasteInTable,
  handleRichText,
  handlePasteIntoCaption,
  handlePastePanelIntoList,
  handleMarkdown,
} from '../../handlers';
import pastePlugin from '../../index';
import hyperlinkPlugin from '../../../hyperlink';
import textFormattingPlugin from '../../../text-formatting';
import tasksAndDecisionsPlugin from '../../../tasks-and-decisions';
import { tablesPlugin } from '@atlaskit/editor-plugin-table';
import expandPlugin from '../../../expand';
import layoutPlugin from '../../../layout';
import panelPlugin from '../../../panel';
import emojiPlugin from '../../../emoji';
import blockTypePlugin from '../../../block-type';
import captionPlugin from '../../../caption';
import mediaPlugin from '../../../media';
import listPlugin from '../../../list';
import extensionPlugin from '../../../extension';

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
  });

  describe('pasting into a panel', () => {
    it('should paste inside the panel when paste content is a heading', () => {
      const destinationDocument = doc(panel({ panelType: 'info' })(p('{<>}')));
      const pasteContent = doc('{<}', h1('heading{>}'));
      const expectedDocument = doc(panel({ panelType: 'info' })(h1('heading')));

      const createEditor = createProsemirrorEditorFactory();
      const editor = (doc: any) => {
        const preset = new Preset<LightEditorPlugin>()
          .add([pastePlugin, {}])
          .add(panelPlugin)
          .add(blockTypePlugin);

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
      handleRichText(pasteSlice)(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
      expect(() => {
        editorView.state.tr.doc.check();
      }).not.toThrow();
    });

    it('should paste list inside panel', () => {
      const destinationDocument = doc(
        panel({ panelType: 'info' })(ul(li(p('{<}a')), li(p('b{>}')))),
      );
      const pasteContent = doc(
        panel({ panelType: 'info' })(ul(li(p('{<}1')), li(p('2{>}')))),
      );
      const expectedDocument = doc(
        panel({ panelType: 'info' })(ul(li(p('1')), li(p('2{<>}')))),
      );

      const createEditor = createProsemirrorEditorFactory();
      const editor = (doc: any) => {
        const preset = new Preset<LightEditorPlugin>()
          .add([pastePlugin, {}])
          .add(panelPlugin)
          .add(listPlugin)
          .add(blockTypePlugin);

        return createEditor({
          doc,
          preset,
        });
      };

      const { editorView } = editor(destinationDocument);
      const pasteSlice = new Slice(
        pasteContent(editorView.state.schema).content,
        4,
        4,
      );
      handleRichText(pasteSlice)(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
      expect(() => {
        editorView.state.tr.doc.check();
      }).not.toThrow();
    });
  });

  describe('pasting from an extension', () => {
    const createEditor = createProsemirrorEditorFactory();

    const editor = (doc: any) => {
      const preset = new Preset<LightEditorPlugin>()
        .add([pastePlugin, {}])
        .add(tablesPlugin)
        .add(listPlugin)
        .add(extensionPlugin)
        .add(panelPlugin);

      return createEditor({
        doc,
        preset,
      });
    };

    const openStart = 6;
    const openEnd = 8;

    it('should paste a nested bullet list from table inside extension into the table as expected', () => {
      const destinationDocument = doc(
        bodiedExtension({
          extensionType: 'atlassian.com.editor',
          extensionKey: 'fake.extension',
          localId: 'local-uuid',
          parameters: {},
        })(table({ localId: 'local-uuid' })(tr(td()(p('{<>}'))))),
      );

      const pasteContent = bodiedExtension({
        extensionType: 'atlassian.com.editor',
        extensionKey: 'fake.extension',
        localId: 'local-uuid',
        parameters: {},
      })(
        table({ localId: 'local-uuid' })(
          tr(td()(ul(li(p('testing'), ul(li(p('test'))))))),
        ),
      );

      const expectedDocument = doc(
        bodiedExtension({
          extensionType: 'atlassian.com.editor',
          extensionKey: 'fake.extension',
          localId: 'local-uuid',
          parameters: {},
        })(
          table({ localId: 'local-uuid' })(
            tr(td()(ul(li(p('testing'), ul(li(p('test'))))))),
          ),
        ),
      );

      const { editorView } = editor(destinationDocument);
      const pasteSlice = new Slice(
        pasteContent(editorView.state.schema).content,
        openStart,
        openEnd,
      );
      handleRichText(pasteSlice)(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
      expect(() => {
        editorView.state.tr.doc.check();
      }).not.toThrow();
    });

    it('should paste a nested bullet list from table inside extension into a bullet list as expected', () => {
      const destinationDocument = doc(ul(li(p('original text {<>}'))));

      const pasteContent = bodiedExtension({
        extensionType: 'atlassian.com.editor',
        extensionKey: 'fake.extension',
        localId: 'local-uuid',
        parameters: {},
      })(
        table({ localId: 'local-uuid' })(
          tr(td()(ul(li(p('testing'), ul(li(p('test'))))))),
        ),
      );

      const expectedDocument = doc(
        ul(li(p('original text testing'), ul(li(p('test'))))),
      );

      const { editorView } = editor(destinationDocument);
      const pasteSlice = new Slice(
        pasteContent(editorView.state.schema).content,
        openStart,
        openEnd,
      );
      handleRichText(pasteSlice)(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
      expect(() => {
        editorView.state.tr.doc.check();
      }).not.toThrow();
    });

    it('should paste a nested bullet list from table inside extension into a panel as expected', () => {
      const destinationDocument = doc(panel()(p('{<>}')));

      const pasteContent = bodiedExtension({
        extensionType: 'atlassian.com.editor',
        extensionKey: 'fake.extension',
        localId: 'local-uuid',
        parameters: {},
      })(
        table({ localId: 'local-uuid' })(
          tr(td()(ul(li(p('testing'), ul(li(p('test'))))))),
        ),
      );

      const expectedDocument = doc(
        panel()(ul(li(p('testing'), ul(li(p('test')))))),
      );

      const { editorView } = editor(destinationDocument);
      const pasteSlice = new Slice(
        pasteContent(editorView.state.schema).content,
        openStart,
        openEnd,
      );
      handleRichText(pasteSlice)(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
      expect(() => {
        editorView.state.tr.doc.check();
      }).not.toThrow();
    });

    it('should paste a nested bullet list from a panel in a table inside extension into a bullet list as expected', () => {
      const destinationDocument = bodiedExtension({
        extensionType: 'atlassian.com.editor',
        extensionKey: 'fake.extension',
        localId: 'local-uuid',
        parameters: {},
      })(table({ localId: 'local-uuid' })(tr(td()(p('{<>}')))));

      const pasteContent = bodiedExtension({
        extensionType: 'atlassian.com.editor',
        extensionKey: 'fake.extension',
        localId: 'local-uuid',
        parameters: {},
      })(
        table({ localId: 'local-uuid' })(
          tr(td()(panel()(ul(li(p('testing'), ul(li(p('test')))))))),
        ),
      );

      const expectedDocument = bodiedExtension({
        extensionType: 'atlassian.com.editor',
        extensionKey: 'fake.extension',
        localId: 'local-uuid',
        parameters: {},
      })(
        table({ localId: 'local-uuid' })(
          tr(td()(ul(li(p('testing'), ul(li(p('test'))))))),
        ),
      );

      const { editorView } = editor(destinationDocument);
      const pasteSlice = new Slice(
        pasteContent(editorView.state.schema).content,
        7,
        9,
      );
      handleRichText(pasteSlice)(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
      expect(() => {
        editorView.state.tr.doc.check();
      }).not.toThrow();
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
      openStart: 1,
      openEnd: 1,
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

describe('handlePasteIntoTaskOrDecisionOrPanel', () => {
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
    doc(panel()(p('Some text in a panel'))),
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
    0,
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
        handlePasteIntoTaskOrDecisionOrPanel(pasteSlice)(
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

describe('handlePastePanelIntoList', () => {
  const destinationDocument = doc(ul(li(p('1')), li(p('2 {<>}')), li(p('3'))));
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: any) => {
    const preset = new Preset<LightEditorPlugin>()
      .add([pastePlugin, {}])
      .add(listPlugin)
      .add(panelPlugin)
      .add(hyperlinkPlugin)
      .add(blockTypePlugin);
    return createEditor({
      doc,
      preset,
    });
  };
  const createPasteSlice = (pasteContent: any, editorView: any) => {
    const pasteSlice = new Slice(
      pasteContent(editorView.state.schema).content,
      2,
      2,
    );
    handlePastePanelIntoList(pasteSlice)(editorView.state, editorView.dispatch);
  };

  it('should paste inside the list when pasting panel content', () => {
    const pasteContent = doc(panel()(p('{<}This is a test{>}')));
    const expectedDocument = doc(
      ul(li(p('1')), li(p('2 This is a test{<>}')), li(p('3'))),
    );
    const { editorView } = editor(destinationDocument);
    createPasteSlice(pasteContent, editorView);

    expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
    expect(() => {
      editorView.state.tr.doc.check();
    }).not.toThrow();
  });

  it('should paste inside the list when pasting panel content with link', () => {
    const href = 'http://www.atlassian.com';
    const pasteContent = doc(
      panel()(p('{<}This is a test ', a({ href })(href), '{>}')),
    );
    const expectedDocument = doc(
      ul(li(p('1')), li(p('2 This is a test ', a({ href })(href))), li(p('3'))),
    );
    const { editorView } = editor(destinationDocument);
    createPasteSlice(pasteContent, editorView);

    expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
    expect(() => {
      editorView.state.tr.doc.check();
    }).not.toThrow();
  });
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
            .add(tablesPlugin)
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

describe('handlePasteIntoCaption', () => {
  const mediaNodeAttrs = {
    id: 'a559980d-cd47-43e2-8377-27359fcb905f',
    type: 'file',
    collection: 'MediaServicesSample',
    width: 250,
    height: 250,
  } as MediaADFAttrs;

  it('should paste inside the caption when paste content is a paragraph', () => {
    const destinationDocument = doc(
      mediaSingle()(media(mediaNodeAttrs)(), caption('{<>}')),
    );
    const pasteContent = doc('{<}', p('paragraph{>}'));
    const expectedDocument = doc(
      mediaSingle()(media(mediaNodeAttrs)(), caption('paragraph')),
    );

    const createEditor = createProsemirrorEditorFactory();
    const editor = (doc: any) => {
      const preset = new Preset<LightEditorPlugin>()
        .add([pastePlugin, {}])
        .add(panelPlugin)
        .add(blockTypePlugin)
        .add(captionPlugin)
        .add([
          mediaPlugin,
          { allowMediaSingle: true, featureFlags: { captions: true } },
        ]);

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
    handlePasteIntoCaption(pasteSlice)(editorView.state, editorView.dispatch);
    expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
    expect(() => {
      editorView.state.tr.doc.check();
    }).not.toThrow();
  });
});

describe('handlePasteIntoTaskOrDecisionOrPanel', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: any) => {
    const preset = new Preset<LightEditorPlugin>()
      .add([pastePlugin, {}])
      .add(hyperlinkPlugin)
      .add(tasksAndDecisionsPlugin)
      .add(panelPlugin)
      .add(emojiPlugin)
      .add(blockTypePlugin);

    return createEditor({
      doc,
      preset,
    });
  };

  describe('pasting a whole panel into', () => {
    const pasteContent = doc(panel()(p('Whole Panel')));
    const openStart = 1;
    const openEnd = 0;
    describe('the content of a panel', () => {
      it('should paste it beneath', () => {
        const destinationDocument = doc(panel()(p('Destination {<>}Panel')));

        const { editorView } = editor(destinationDocument);
        const pasteSlice = new Slice(
          pasteContent(editorView.state.schema).content,
          openStart,
          openEnd,
        );
        handlePasteIntoTaskOrDecisionOrPanel(pasteSlice)(
          editorView.state,
          editorView.dispatch,
        );
        const expectedDocument = doc(
          panel()(p('Destination Panel')),
          panel()(p('Whole Panel')),
        );
        expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
        expect(() => {
          editorView.state.tr.doc.check();
        }).not.toThrow();
      });
    });
    describe('the content of a decision', () => {
      it('should paste it beneath', () => {
        const destinationDocument = doc(
          decisionList({ localId: 'test1' })(
            decisionItem({ localId: 'test2' })('Destination {<>}Decision'),
          ),
        );

        const { editorView } = editor(destinationDocument);
        const pasteSlice = new Slice(
          pasteContent(editorView.state.schema).content,
          openStart,
          openEnd,
        );
        handlePasteIntoTaskOrDecisionOrPanel(pasteSlice)(
          editorView.state,
          editorView.dispatch,
        );
        const expectedDocument = doc(
          decisionList({ localId: 'test1' })(
            decisionItem({ localId: 'test2' })('Destination Decision'),
          ),
          panel()(p('Whole Panel')),
        );
        expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
        expect(() => {
          editorView.state.tr.doc.check();
        }).not.toThrow();
      });
    });
    describe('the content of a quote', () => {
      it('should not change the document', () => {
        // Note: the paste contents ends up being handled by a different part of the handler, not this function.
        const destinationDocument = doc(blockquote(p('Quote {<>}Destination')));
        // Depth is different when the slice is not transformed.
        const openStart = 0;
        const openEnd = 0;

        const { editorView } = editor(destinationDocument);
        const pasteSlice = new Slice(
          pasteContent(editorView.state.schema).content,
          openStart,
          openEnd,
        );
        handlePasteIntoTaskOrDecisionOrPanel(pasteSlice)(
          editorView.state,
          editorView.dispatch,
        );
        const expectedDocument = doc(blockquote(p('Quote Destination')));
        expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
        expect(() => {
          editorView.state.tr.doc.check();
        }).not.toThrow();
      });
    });
  });
  describe('pasting a whole decision into', () => {
    const pasteContent = doc(
      decisionList({ localId: 'test1' })(
        decisionItem({ localId: 'test2' })('Whole Decision'),
      ),
    );
    const openStart = 1;
    const openEnd = 0;
    it('the content of a panel, should paste it beneath', () => {
      const destinationDocument = doc(panel()(p('Destination {<>}Panel')));

      const { editorView } = editor(destinationDocument);
      const pasteSlice = new Slice(
        pasteContent(editorView.state.schema).content,
        openStart,
        openEnd,
      );
      handlePasteIntoTaskOrDecisionOrPanel(pasteSlice)(
        editorView.state,
        editorView.dispatch,
      );
      const expectedDocument = doc(
        panel()(p('Destination Panel')),
        decisionList({ localId: 'test1' })(
          decisionItem({ localId: 'test2' })('Whole Decision'),
        ),
      );
      expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
      expect(() => {
        editorView.state.tr.doc.check();
      }).not.toThrow();
    });
    it('the content of a decision, should paste it beneath', () => {
      const destinationDocument = doc(
        decisionList({ localId: 'test1' })(
          decisionItem({ localId: 'test2' })('Destination {<>}Decision'),
        ),
      );

      const { editorView } = editor(destinationDocument);
      const pasteSlice = new Slice(
        pasteContent(editorView.state.schema).content,
        openStart,
        openEnd,
      );
      handlePasteIntoTaskOrDecisionOrPanel(pasteSlice)(
        editorView.state,
        editorView.dispatch,
      );
      const expectedDocument = doc(
        decisionList({ localId: 'test1' })(
          decisionItem({ localId: 'test2' })('Destination Decision'),
        ),
        decisionList({ localId: 'test1' })(
          decisionItem({ localId: 'test2' })('Whole Decision'),
        ),
      );
      expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
      expect(() => {
        editorView.state.tr.doc.check();
      }).not.toThrow();
    });
    it('the content of an action, should paste it beneath', () => {
      const destinationDocument = doc(
        taskList({ localId: 'test1' })(
          taskItem({ localId: 'test2' })('Destination {<>}Action'),
        ),
      );

      const { editorView } = editor(destinationDocument);
      const pasteSlice = new Slice(
        pasteContent(editorView.state.schema).content,
        openStart,
        openEnd,
      );
      handlePasteIntoTaskOrDecisionOrPanel(pasteSlice)(
        editorView.state,
        editorView.dispatch,
      );
      const expectedDocument = doc(
        taskList({ localId: 'test1' })(
          taskItem({ localId: 'test2' })('Destination Action'),
        ),
        decisionList({ localId: 'test1' })(
          decisionItem({ localId: 'test2' })('Whole Decision'),
        ),
      );
      expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
      expect(() => {
        editorView.state.tr.doc.check();
      }).not.toThrow();
    });
    it('the content of a quote, should not change the document', () => {
      // Note: the paste contents ends up being handled by a different part of the handler, not this function.
      const destinationDocument = doc(blockquote(p('Quote {<>}Destination')));
      // Depth is different when the slice is not transformed.
      const openStart = 0;
      const openEnd = 0;

      const { editorView } = editor(destinationDocument);
      const pasteSlice = new Slice(
        pasteContent(editorView.state.schema).content,
        openStart,
        openEnd,
      );
      handlePasteIntoTaskOrDecisionOrPanel(pasteSlice)(
        editorView.state,
        editorView.dispatch,
      );
      const expectedDocument = doc(blockquote(p('Quote Destination')));
      expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
      expect(() => {
        editorView.state.tr.doc.check();
      }).not.toThrow();
    });
  });
  describe('pasting a contents of a panel into', () => {
    const pasteContent = doc(panel()(p('Contents of a Panel')));
    const openStart = 2;
    const openEnd = 2;
    describe('the content of a panel', () => {
      it('should paste the contents into the destination', () => {
        const destinationDocument = doc(panel()(p('Destination {<>}Panel')));

        const { editorView } = editor(destinationDocument);
        const pasteSlice = new Slice(
          pasteContent(editorView.state.schema).content,
          openStart,
          openEnd,
        );
        handlePasteIntoTaskOrDecisionOrPanel(pasteSlice)(
          editorView.state,
          editorView.dispatch,
        );
        const expectedDocument = doc(
          panel()(p('Destination Contents of a PanelPanel')),
        );
        expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
        expect(() => {
          editorView.state.tr.doc.check();
        }).not.toThrow();
      });
    });
    describe('the content of a decision', () => {
      it('should paste the contents into the destination', () => {
        const destinationDocument = doc(
          decisionList({ localId: 'test1' })(
            decisionItem({ localId: 'test2' })('Destination {<>}Decision'),
          ),
        );

        const { editorView } = editor(destinationDocument);
        const pasteSlice = new Slice(
          pasteContent(editorView.state.schema).content,
          openStart,
          openEnd,
        );
        handlePasteIntoTaskOrDecisionOrPanel(pasteSlice)(
          editorView.state,
          editorView.dispatch,
        );
        const expectedDocument = doc(
          decisionList({ localId: 'test1' })(
            decisionItem({ localId: 'test2' })(
              'Destination Contents of a PanelDecision',
            ),
          ),
        );
        expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
        expect(() => {
          editorView.state.tr.doc.check();
        }).not.toThrow();
      });
    });
    describe('the content of an action', () => {
      it('should paste the contents into the destination', () => {
        const destinationDocument = doc(
          taskList({ localId: 'test1' })(
            taskItem({ localId: 'test2' })('Destination {<>}Action'),
          ),
        );

        const { editorView } = editor(destinationDocument);
        const pasteSlice = new Slice(
          pasteContent(editorView.state.schema).content,
          openStart,
          openEnd,
        );
        handlePasteIntoTaskOrDecisionOrPanel(pasteSlice)(
          editorView.state,
          editorView.dispatch,
        );
        const expectedDocument = doc(
          taskList({ localId: 'test1' })(
            taskItem({ localId: 'test2' })(
              'Destination Contents of a PanelAction',
            ),
          ),
        );
        expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
        expect(() => {
          editorView.state.tr.doc.check();
        }).not.toThrow();
      });
    });
    describe('the content of a quote', () => {
      it('should paste the contents into the destination', () => {
        // Note: the paste contents ends up being handled by a different part of the handler, not this function.
        const destinationDocument = doc(blockquote(p('Quote {<>}Destination')));
        // Depth is different when the slice is not transformed.
        const openStart = 0;
        const openEnd = 0;

        const { editorView } = editor(destinationDocument);
        const pasteSlice = new Slice(
          pasteContent(editorView.state.schema).content,
          openStart,
          openEnd,
        );
        handlePasteIntoTaskOrDecisionOrPanel(pasteSlice)(
          editorView.state,
          editorView.dispatch,
        );
        const expectedDocument = doc(blockquote(p('Quote {<>}Destination')));
        expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
        expect(() => {
          editorView.state.tr.doc.check();
        }).not.toThrow();
      });
    });
  });
  describe('pasting a contents of a decision into', () => {
    const pasteContent = doc(
      decisionList({ localId: 'test1' })(
        decisionItem({ localId: 'test2' })('Contents of a Decision'),
      ),
    );
    const openStart = 2;
    const openEnd = 2;
    describe('the content of a panel', () => {
      it('should paste the contents into the destination', () => {
        const destinationDocument = doc(panel()(p('Destination {<>}Panel')));

        const { editorView } = editor(destinationDocument);
        const pasteSlice = new Slice(
          pasteContent(editorView.state.schema).content,
          openStart,
          openEnd,
        );
        handlePasteIntoTaskOrDecisionOrPanel(pasteSlice)(
          editorView.state,
          editorView.dispatch,
        );
        const expectedDocument = doc(
          panel()(p('Destination Contents of a DecisionPanel')),
        );
        expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
        expect(() => {
          editorView.state.tr.doc.check();
        }).not.toThrow();
      });
    });
    describe('the content of a decision', () => {
      it('should paste the contents into the destination', () => {
        const destinationDocument = doc(
          decisionList({ localId: 'test1' })(
            decisionItem({ localId: 'test2' })('Destination {<>}Decision'),
          ),
        );

        const { editorView } = editor(destinationDocument);
        const pasteSlice = new Slice(
          pasteContent(editorView.state.schema).content,
          openStart,
          openEnd,
        );
        handlePasteIntoTaskOrDecisionOrPanel(pasteSlice)(
          editorView.state,
          editorView.dispatch,
        );
        const expectedDocument = doc(
          decisionList({ localId: 'test1' })(
            decisionItem({ localId: 'test2' })(
              'Destination Contents of a DecisionDecision',
            ),
          ),
        );
        expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
        expect(() => {
          editorView.state.tr.doc.check();
        }).not.toThrow();
      });
    });
    describe('the content of an action', () => {
      it('should paste the contents into the destination', () => {
        const destinationDocument = doc(
          taskList({ localId: 'test1' })(
            taskItem({ localId: 'test2' })('Destination {<>}Action'),
          ),
        );

        const { editorView } = editor(destinationDocument);
        const pasteSlice = new Slice(
          pasteContent(editorView.state.schema).content,
          openStart,
          openEnd,
        );
        handlePasteIntoTaskOrDecisionOrPanel(pasteSlice)(
          editorView.state,
          editorView.dispatch,
        );
        const expectedDocument = doc(
          taskList({ localId: 'test1' })(
            taskItem({ localId: 'test2' })(
              'Destination Contents of a DecisionAction',
            ),
          ),
        );
        expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
        expect(() => {
          editorView.state.tr.doc.check();
        }).not.toThrow();
      });
    });
    describe('the content of a quote', () => {
      it('should paste the contents into the destination', () => {
        // Note: the paste contents ends up being handled by a different part of the handler, not this function.
        const destinationDocument = doc(blockquote(p('Quote {<>}Destination')));
        // Depth is different when the slice is not transformed.
        const openStart = 0;
        const openEnd = 0;

        const { editorView } = editor(destinationDocument);
        const pasteSlice = new Slice(
          pasteContent(editorView.state.schema).content,
          openStart,
          openEnd,
        );
        handlePasteIntoTaskOrDecisionOrPanel(pasteSlice)(
          editorView.state,
          editorView.dispatch,
        );
        const expectedDocument = doc(blockquote(p('Quote Destination')));
        expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
        expect(() => {
          editorView.state.tr.doc.check();
        }).not.toThrow();
      });
    });
  });
  describe('pasting a contents of an action into', () => {
    const pasteContent = doc(
      taskList({ localId: 'test1' })(
        taskItem({ localId: 'test2' })('Contents of an Action'),
      ),
    );
    const openStart = 2;
    const openEnd = 2;
    describe('the content of a panel', () => {
      it('should paste the contents into the destination', () => {
        const destinationDocument = doc(panel()(p('Destination {<>}Panel')));

        const { editorView } = editor(destinationDocument);
        const pasteSlice = new Slice(
          pasteContent(editorView.state.schema).content,
          openStart,
          openEnd,
        );
        handlePasteIntoTaskOrDecisionOrPanel(pasteSlice)(
          editorView.state,
          editorView.dispatch,
        );
        const expectedDocument = doc(
          panel()(p('Destination Contents of an ActionPanel')),
        );
        expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
        expect(() => {
          editorView.state.tr.doc.check();
        }).not.toThrow();
      });
    });
    describe('the content of a decision', () => {
      it('should paste the contents into the destination', () => {
        const destinationDocument = doc(
          decisionList({ localId: 'test1' })(
            decisionItem({ localId: 'test2' })('Destination {<>}Decision'),
          ),
        );

        const { editorView } = editor(destinationDocument);
        const pasteSlice = new Slice(
          pasteContent(editorView.state.schema).content,
          openStart,
          openEnd,
        );
        handlePasteIntoTaskOrDecisionOrPanel(pasteSlice)(
          editorView.state,
          editorView.dispatch,
        );
        const expectedDocument = doc(
          decisionList({ localId: 'test1' })(
            decisionItem({ localId: 'test2' })(
              'Destination Contents of an ActionDecision',
            ),
          ),
        );
        expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
        expect(() => {
          editorView.state.tr.doc.check();
        }).not.toThrow();
      });
    });
    describe('the content of an action', () => {
      it('should paste the contents into the destination', () => {
        const destinationDocument = doc(
          taskList({ localId: 'test1' })(
            taskItem({ localId: 'test2' })('Destination {<>}Action'),
          ),
        );

        const { editorView } = editor(destinationDocument);
        const pasteSlice = new Slice(
          pasteContent(editorView.state.schema).content,
          openStart,
          openEnd,
        );
        handlePasteIntoTaskOrDecisionOrPanel(pasteSlice)(
          editorView.state,
          editorView.dispatch,
        );
        const expectedDocument = doc(
          taskList({ localId: 'test1' })(
            taskItem({ localId: 'test2' })(
              'Destination Contents of an ActionAction',
            ),
          ),
        );
        expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
        expect(() => {
          editorView.state.tr.doc.check();
        }).not.toThrow();
      });
    });
    describe('the content of a quote', () => {
      it('should paste the contents into the destination', () => {
        // Note: the paste contents ends up being handled by a different part of the handler, not this function.
        const destinationDocument = doc(blockquote(p('Quote {<>}Destination')));
        // Depth is different when the slice is not transformed.
        const openStart = 0;
        const openEnd = 0;

        const { editorView } = editor(destinationDocument);
        const pasteSlice = new Slice(
          pasteContent(editorView.state.schema).content,
          openStart,
          openEnd,
        );
        handlePasteIntoTaskOrDecisionOrPanel(pasteSlice)(
          editorView.state,
          editorView.dispatch,
        );
        const expectedDocument = doc(blockquote(p('Quote Destination')));
        expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
        expect(() => {
          editorView.state.tr.doc.check();
        }).not.toThrow();
      });
    });
  });
  describe('pasting a contents of a quote into', () => {
    const pasteContent = doc(blockquote(p('Contents of a Quote')));
    const openStart = 2;
    const openEnd = 2;
    describe('the content of a panel', () => {
      it('should paste beneath', () => {
        const destinationDocument = doc(panel()(p('Destination {<>}Panel')));

        const { editorView } = editor(destinationDocument);
        const pasteSlice = new Slice(
          pasteContent(editorView.state.schema).content,
          openStart,
          openEnd,
        );
        handlePasteIntoTaskOrDecisionOrPanel(pasteSlice)(
          editorView.state,
          editorView.dispatch,
        );
        const expectedDocument = doc(
          panel()(p('Destination Panel')),
          blockquote(p('Contents of a Quote')),
        );
        expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
        expect(() => {
          editorView.state.tr.doc.check();
        }).not.toThrow();
      });
    });
    describe('the content of a decision', () => {
      it('should paste beneath', () => {
        const destinationDocument = doc(
          decisionList({ localId: 'test1' })(
            decisionItem({ localId: 'test2' })('Destination {<>}Decision'),
          ),
        );

        const { editorView } = editor(destinationDocument);
        const pasteSlice = new Slice(
          pasteContent(editorView.state.schema).content,
          openStart,
          openEnd,
        );
        handlePasteIntoTaskOrDecisionOrPanel(pasteSlice)(
          editorView.state,
          editorView.dispatch,
        );
        const expectedDocument = doc(
          decisionList({ localId: 'test1' })(
            decisionItem({ localId: 'test2' })('Destination Decision'),
          ),
          blockquote(p('Contents of a Quote')),
        );
        expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
        expect(() => {
          editorView.state.tr.doc.check();
        }).not.toThrow();
      });
    });
    describe('the content of an action', () => {
      it('should paste beneath', () => {
        const destinationDocument = doc(
          taskList({ localId: 'test1' })(
            taskItem({ localId: 'test2' })('Destination {<>}Action'),
          ),
        );

        const { editorView } = editor(destinationDocument);
        const pasteSlice = new Slice(
          pasteContent(editorView.state.schema).content,
          openStart,
          openEnd,
        );
        handlePasteIntoTaskOrDecisionOrPanel(pasteSlice)(
          editorView.state,
          editorView.dispatch,
        );
        const expectedDocument = doc(
          taskList({ localId: 'test1' })(
            taskItem({ localId: 'test2' })('Destination Action'),
          ),
          blockquote(p('Contents of a Quote')),
        );
        expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
        expect(() => {
          editorView.state.tr.doc.check();
        }).not.toThrow();
      });
    });
    describe('the content of a quote', () => {
      it('should paste beneath', () => {
        // Note: the paste contents ends up being handled by a different part of the handler, not this function.
        const destinationDocument = doc(blockquote(p('Quote {<>}Destination')));
        // Depth is different when the slice is not transformed.
        const openStart = 0;
        const openEnd = 0;

        const { editorView } = editor(destinationDocument);
        const pasteSlice = new Slice(
          pasteContent(editorView.state.schema).content,
          openStart,
          openEnd,
        );
        handlePasteIntoTaskOrDecisionOrPanel(pasteSlice)(
          editorView.state,
          editorView.dispatch,
        );
        const expectedDocument = doc(blockquote(p('Quote Destination')));
        expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
        expect(() => {
          editorView.state.tr.doc.check();
        }).not.toThrow();
      });
    });
  });
});

describe('handleMarkdown', () => {
  describe('pasting into a table', () => {
    it('should select in the same cell after pasting list', () => {
      const createEditor = createProsemirrorEditorFactory();
      const editor = (doc: any) => {
        const preset = new Preset<LightEditorPlugin>()
          .add([pastePlugin, {}])
          .add(tablesPlugin)
          .add(listPlugin);

        return createEditor({
          doc,
          preset,
        });
      };

      const destinationDocument = doc(
        table({ localId: 'local-uuid' })(tr(td()(p('{<>}')), td()(p()))),
      );
      const { editorView } = editor(destinationDocument);

      const pasteSlice = new Slice(
        doc(ul(li(p('a')), li(p('b'))))(editorView.state.schema).content,
        1,
        1,
      );
      handleMarkdown(pasteSlice)(editorView.state, editorView.dispatch);

      const expectedDocument = doc(
        table({ localId: 'local-uuid' })(
          tr(td()(ul(li(p('a')), li(p('b{<>}')))), td()(p())),
        ),
      );
      expect(editorView.state).toEqualDocumentAndSelection(expectedDocument);
    });
  });
});
