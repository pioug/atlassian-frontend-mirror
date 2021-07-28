import {
  p,
  ul,
  li,
  br,
  doc,
  code,
  status,
  panel,
  code_block,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { joinListItemForward } from '../../../commands/join-list-item-forward';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { deleteKeyCommand } from '../../../commands';
import listPlugin from '../../..';
import basePlugins from '../../../../base';
import blockType from '../../../../block-type';
import codeBlockTypePlugin from '../../../../code-block';
import statusInlineBlockTypePlugin from '../../../../status';
import panelBlockTypePlugin from '../../../../panel';
import textFormattingPlugin from '../../../../text-formatting';
import analyticsPlugin, {
  LIST_TEXT_SCENARIOS,
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
  DELETE_DIRECTION,
} from '../../../../analytics';

describe('join-list-item-forward', () => {
  const createEditor = createProsemirrorEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  beforeEach(() => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
  });

  const editor = (doc: DocBuilder) => {
    const preset = new Preset<LightEditorPlugin>()
      .add(listPlugin)
      .add(basePlugins)
      .add(blockType)
      .add(codeBlockTypePlugin)
      .add(panelBlockTypePlugin)
      .add([statusInlineBlockTypePlugin, { menuDisabled: false }])
      .add(textFormattingPlugin)
      .add([analyticsPlugin, { createAnalyticsEvent }]);

    return createEditor({
      doc,
      preset,
    });
  };

  const case1: [string, DocBuilder, string] = [
    'joining a list item with a paragraph',
    // prettier-ignore
    doc(
      ul(
        li(
          p('A{<>}'),
        ),
      ),
      p('B'),
    ),
    LIST_TEXT_SCENARIOS.JOIN_PARAGRAPH_WITH_LIST,
  ];

  const case2: [string, DocBuilder, string] = [
    'joining a sibling list item',
    // prettier-ignore
    doc(
      ul(
        li(
          p('A{<>}'),
        ),
        li(
          p('B'),
        )
      ),
      p('B'),
    ),
    LIST_TEXT_SCENARIOS.JOIN_SIBLINGS,
  ];

  const case3: [string, DocBuilder, string] = [
    'joining a sub list descendants into the parent',
    // prettier-ignore
    doc(
      ul(
        li(
          p('A{<>}'),
          ul(
            li(
              p('A1'),
              ul(
                li(
                  p('A1.sub1'),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
    LIST_TEXT_SCENARIOS.JOIN_DESCENDANT_TO_PARENT,
  ];

  const case4: [string, DocBuilder, string] = [
    'joining a parent sibling to the current level',
    // prettier-ignore
    doc(
      ul(
        li(
          p('A'),
          ul(
            li(
              p('A1{<>}')
            )
          )
        ),
        li(
          p('B'),
          ul(
            li(
              p('B1'),
            ),
          ),
        ),
      ),
    ),
    LIST_TEXT_SCENARIOS.JOIN_PARENT_SIBLING_TO_PARENT_CHILD,
  ];

  const case5: [string, DocBuilder, string] = [
    'Empty paragraph followed by a single level list',
    // prettier-ignore
    doc(
      p('{<>}'),
      ul(
        li(
          p('A'),
        ),
        li(
          p('B'),
        ),
      ),
    ),
    LIST_TEXT_SCENARIOS.JOIN_LIST_ITEM_WITH_PARAGRAPH,
  ];

  const case6: [string, DocBuilder, string] = [
    'Empty paragraph followed by a nested list',
    // prettier-ignore
    doc(
      p('{<>}'),
      ul(
        li(
          p('A'),
          ul(
            li(
              p('child 1'),
            ),
            li(
              p('child 2'),
            ),
          ),
        ),
        li(
          p('B'),
        ),
      ),
    ),
    LIST_TEXT_SCENARIOS.JOIN_LIST_ITEM_WITH_PARAGRAPH,
  ];

  const case7: [string, DocBuilder, string] = [
    'Paragraph followed by a single level list',
    // prettier-ignore
    doc(
      p('some text {<>}'),
      ul(
        li(
          p('A'),
        ),
        li(
          p('B'),
        ),
      ),
    ),
    LIST_TEXT_SCENARIOS.JOIN_LIST_ITEM_WITH_PARAGRAPH,
  ];

  const case8: [string, DocBuilder, string] = [
    'Paragraph followed by a nested list',
    // prettier-ignore
    doc(
      p('some text {<>}'),
      ul(
        li(
          p('A'),
          ul(
            li(
              p('child 1'),
              ul(
                li(
                  p('third level child'),
                ),
              ),
            ),
            li(
              p('child 2'),
            ),
          ),
        ),
        li(
          p('B'),
        ),
      ),
    ),
    LIST_TEXT_SCENARIOS.JOIN_LIST_ITEM_WITH_PARAGRAPH,
  ];

  const case9: [string, DocBuilder, string] = [
    'Paragraph followed by a single list item',
    // prettier-ignore
    doc(
      p('some text {<>}'),
      ul(
        li(
          p('A'),
        ),
      ),
    ),
    LIST_TEXT_SCENARIOS.JOIN_LIST_ITEM_WITH_PARAGRAPH,
  ];

  const case10: [string, DocBuilder, string] = [
    'Paragraph followed by an empty list item',
    // prettier-ignore
    doc(
      p('some text {<>}'),
      ul(
        li(
          p(''),
          ul(
            li(
              p('A')
            )
          )
        ),
      ),
    ),
    LIST_TEXT_SCENARIOS.JOIN_LIST_ITEM_WITH_PARAGRAPH,
  ];

  const case11: [string, DocBuilder, string] = [
    'Paragraph followed by an empty list item with no nested lists',
    // prettier-ignore
    doc(
      p('some text {<>}'),
      ul(
        li(
          p(''),
        ),
        li(
          p('B'),
        ),
        li(
          p('C'),
        ),
      ),
    ),
    LIST_TEXT_SCENARIOS.JOIN_LIST_ITEM_WITH_PARAGRAPH,
  ];

  const case12: [string, DocBuilder, string] = [
    'Paragraph followed by an empty list with nested lists and siblings',
    // prettier-ignore
    doc(
      p('some text {<>}'),
      ul(
        li(
          p(''),
          ul(
            li(
              p('B'),
              ul(
                li(
                  p('C')
                ),
                li(
                  p('D')
                ),
              ),
            ),
            li(
              p('E')
            )
          )
        ),
        li(
          p('F')
        ),
        li(
          p('G')
        )
      ),
    ),
    LIST_TEXT_SCENARIOS.JOIN_LIST_ITEM_WITH_PARAGRAPH,
  ];

  const case13: [string, DocBuilder, string] = [
    'Paragraph followed by a list item with a paragraph and its first child is a hard break',
    // prettier-ignore
    doc(
      p('some text {<>}'),
      ul(
        li(
          p(br(), 'A', br(), 'B', br(), 'C'),
        ),
        li(
          p('D'),
        ),
        li(
          p('E'),
        ),
      ),
    ),
    LIST_TEXT_SCENARIOS.JOIN_LIST_ITEM_WITH_PARAGRAPH,
  ];

  const case14: [string, DocBuilder, string] = [
    'Paragraph followed by a list item with multiple paragraphs, and siblings',
    // prettier-ignore
    doc(
      p('some text {<>}'),
      ul(
        li(
          p('A'),
          p('B'),
          p('C'),
        ),
        li(
          p('D'),
        ),
        li(
          p('E'),
        ),
      ),
    ),
    LIST_TEXT_SCENARIOS.JOIN_LIST_ITEM_WITH_PARAGRAPH,
  ];

  const case15: [string, DocBuilder, string] = [
    'Paragraph followed by a list item with multiple paragraphs, the first is empty, and siblings',
    // prettier-ignore
    doc(
      p('some text {<>}'),
      ul(
        li(
          p(''),
          p('B'),
          p('C'),
        ),
        li(
          p('D'),
        ),
        li(
          p('E'),
        ),
      ),
    ),
    LIST_TEXT_SCENARIOS.JOIN_LIST_ITEM_WITH_PARAGRAPH,
  ];

  const case16: [string, DocBuilder, string] = [
    'Status node followed by a list item with inline code and text',
    // prettier-ignore
    doc(
      p(
        status({ text: 'test', color: '#FFF', localId: 'a' }),
        '{<>}',
      ),
      ul(
        li(
          p(
            code('hello'),
            'world',
          ),
        ),
      ),
    ),
    LIST_TEXT_SCENARIOS.JOIN_LIST_ITEM_WITH_PARAGRAPH,
  ];

  const case17: [string, DocBuilder, string] = [
    'Paragraph followed by a list item with inline code and text, and siblings',
    // prettier-ignore
    doc(
      p('some text {<>}'),
      ul(
        li(
          p(
            code('hello'),
            'world',
          ),
        ),
        li(p('A')),
        li(p('B')),
      ),
    ),
    LIST_TEXT_SCENARIOS.JOIN_LIST_ITEM_WITH_PARAGRAPH,
  ];

  const case18: [string, DocBuilder, string] = [
    'Paragraph followed by a list item with multiple paragraphs (the first with inline code and text), and siblings',
    // prettier-ignore
    doc(
      p('some text {<>}'),
      ul(
        li(
          p(
            code('hello'),
            'world',
          ),
          p('multi paragraph'),
        ),
        li(p('A')),
        li(p('B')),
      ),
    ),
    LIST_TEXT_SCENARIOS.JOIN_LIST_ITEM_WITH_PARAGRAPH,
  ];

  const case19: [string, DocBuilder, string] = [
    'Paragraph followed by a list item with multiple paragraphs (the first with inline code and text)',
    // prettier-ignore
    doc(
      p('some text {<>}'),
      ul(
        li(
          p(
            code('hello'),
            'world',
          ),
          p('multi paragraph with out siblings'),
        ),
      ),
    ),
    LIST_TEXT_SCENARIOS.JOIN_LIST_ITEM_WITH_PARAGRAPH,
  ];

  const case20: [string, DocBuilder, string] = [
    'Paragraph followed by a list item with inline code and text, and a nested list',
    // prettier-ignore
    doc(
      p('some text {<>}'),
      ul(
        li(
          p(
            code('hello'),
            'world',
          ),
          ul(
            li(p('what about nested item')),
          ),
        ),
      ),
    ),
    LIST_TEXT_SCENARIOS.JOIN_LIST_ITEM_WITH_PARAGRAPH,
  ];

  const case21: [string, DocBuilder, string] = [
    'Paragraph followed by a list item with inline code and text, a nested list, and siblings',
    // prettier-ignore
    doc(
      p('some text {<>}'),
      ul(
        li(
          p(
            code('hello'),
            'world',
          ),
          ul(
            li(p('what about nested item with sibling')),
          ),
        ),
        li(p('hey')),
      ),
    ),
    LIST_TEXT_SCENARIOS.JOIN_LIST_ITEM_WITH_PARAGRAPH,
  ];

  const case22: [string, DocBuilder, string] = [
    'Panel node followed by a list item with inline code and text',
    // prettier-ignore
    doc(
      panel()(
        p('some text inside panel{<>}'),
      ),
      ul(
        li(
          p(
            code('hello'),
            'world',
          ),
        ),
      ),
    ),
    LIST_TEXT_SCENARIOS.JOIN_LIST_ITEM_WITH_PARAGRAPH,
  ];

  const case23: [string, DocBuilder, string] = [
    'Panel node followed by a list item with inline code and text, and siblings',
    // prettier-ignore
    doc(
      panel()(
        p('some text inside panel{<>}'),
      ),
      ul(
        li(
          p(
            code('hello'),
            'world',
          ),
        ),
        li(p('with sibling')),
      ),
    ),
    LIST_TEXT_SCENARIOS.JOIN_LIST_ITEM_WITH_PARAGRAPH,
  ];

  const case24: [string, DocBuilder, string] = [
    'Panel node followed by a list item with inline code and text, and a nested list, and siblings',
    // prettier-ignore
    doc(
      panel()(
        p('some text inside panel{<>}'),
      ),
      ul(
        li(
          p(
            code('hello'),
            'world',
          ),
          ul(
            li(p('what about nested item with sibling')),
          ),
        ),
        li(p('with sibling')),
      ),
    ),
    LIST_TEXT_SCENARIOS.JOIN_LIST_ITEM_WITH_PARAGRAPH,
  ];

  describe.each<[string, DocBuilder, string]>([
    case1,
    case2,
    case3,
    case4,
    case5,
    case6,
    case7,
    case8,
    case9,
    case10,
    case11,
    case12,
    case13,
    case14,
    case15,
    case16,
    case17,
    case18,
    case19,
    case20,
    case21,
    case22,
    case23,
    case24,
  ])('when the next state is to %s', (_scenario, documentNode, eventName) => {
    describe('#joinListItemForward', () => {
      it('should call the createAnalyticsEvent with the proper event payload', () => {
        const {
          editorView: { state, dispatch },
        } = editor(documentNode);
        const result = joinListItemForward(state, dispatch);

        expect(result).toBe(true);
        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          action: ACTION.LIST_ITEM_JOINED,
          actionSubject: ACTION_SUBJECT.LIST,
          actionSubjectId: ACTION_SUBJECT_ID.FORMAT_LIST_BULLET,
          eventType: EVENT_TYPE.TRACK,
          attributes: expect.objectContaining({
            inputMethod: INPUT_METHOD.KEYBOARD,
            direction: DELETE_DIRECTION.FORWARD,
            scenario: eventName,
          }),
        });
      });
    });
  });

  describe("when case isn't a list delete case", () => {
    it('should ignore when there is no next node', () => {
      const unchangedDoc = doc(ul(li(p('a{<>}'))));
      const { editorView } = editor(unchangedDoc);
      const commandReturn = joinListItemForward(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state).toEqualDocumentAndSelection(unchangedDoc);
      expect(commandReturn).toBeFalsy();
    });

    it('should ignore when next node is not in a paragraph', () => {
      const unchangedDoc = doc(ul(li(p('a{<>}')), li(code_block()('b'))));
      const { editorView } = editor(unchangedDoc);
      const commandReturn = joinListItemForward(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state).toEqualDocumentAndSelection(unchangedDoc);
      expect(commandReturn).toBeFalsy();
    });

    it('should ignore when selection is not the last child of its parent', () => {
      const unchangedDoc = doc(ul(li(p('a{<>}'), p('b')), li(p('c'))));
      const { editorView } = editor(unchangedDoc);
      const commandReturn = joinListItemForward(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state).toEqualDocumentAndSelection(unchangedDoc);
      expect(commandReturn).toBeFalsy();
    });

    it('should ignore when selection is not empty and at the end', () => {
      const unchangedDoc = doc(ul(li(p('a{<>}b')), li(p('c'))));
      const { editorView } = editor(unchangedDoc);
      const commandReturn = joinListItemForward(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state).toEqualDocumentAndSelection(unchangedDoc);
      expect(commandReturn).toBeFalsy();
    });

    it('should ignore when paragraph not present for next node in case 1', () => {
      const unchangedDoc = doc(
        ul(li(p('a'), p('b{<>}'))),
        code_block()('c'),
        code_block()('d'),
      );
      const { editorView } = editor(unchangedDoc);
      const commandReturn = joinListItemForward(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state).toEqualDocumentAndSelection(unchangedDoc);
      expect(commandReturn).toBeFalsy();
    });

    it('should ignore when paragraph not present for next node in case 2', () => {
      const unchangedDoc = doc(
        ul(li(p('a'), p('b{<>}')), li(code_block()('c'), code_block()('d'))),
      );
      const { editorView } = editor(unchangedDoc);
      const commandReturn = joinListItemForward(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state).toEqualDocumentAndSelection(unchangedDoc);
      expect(commandReturn).toBeFalsy();
    });

    it('should ignore when paragraph not present for next node in case 3', () => {
      const unchangedDoc = doc(
        ul(
          li(
            p('a'),
            ul(
              li(
                p('b'),
                p('c{<>}'),
                ul(li(code_block()('d'), code_block()('e'))),
              ),
            ),
          ),
        ),
      );
      const { editorView } = editor(unchangedDoc);
      const commandReturn = joinListItemForward(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state).toEqualDocumentAndSelection(unchangedDoc);
      expect(commandReturn).toBeFalsy();
    });

    it('should ignore when paragraph not present for next node in case 4', () => {
      const unchangedDoc = doc(
        ul(
          li(p('a'), ul(li(p('b'), p('c{<>}')))),
          li(code_block()('d'), code_block()('e')),
        ),
      );
      const { editorView } = editor(unchangedDoc);
      const commandReturn = joinListItemForward(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state).toEqualDocumentAndSelection(unchangedDoc);
      expect(commandReturn).toBeFalsy();
    });
  });

  //Cases below refer to the cases found in this document: https://product-fabric.atlassian.net/wiki/spaces/E/pages/1146954996/List+Backspace+and+Delete+Behaviour
  describe('when list delete case 1', () => {
    it('should lift an empty paragraph into an empty list item', () => {
      const initialDoc = doc(ul(li(p('{<>}'))), p(''));
      const expectedDoc = doc(ul(li(p('{<>}'))));

      const { editorView } = editor(initialDoc);

      deleteKeyCommand(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(expectedDoc);
    });

    it('should lift the paragraph into the list item', () => {
      const initialDoc = doc(
        ul(li(code_block()('a'), p('b{<>}'))),
        p('c'),
        p('d'),
      );
      const expectedDoc = doc(ul(li(code_block()('a'), p('b{<>}c'))), p('d'));

      const { editorView } = editor(initialDoc);

      deleteKeyCommand(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(expectedDoc);
    });
  });

  describe('when list delete case 2', () => {
    it('should lift the next listitem into the previous when they both have empty paragraphs', () => {
      const initialDoc = doc(ul(li(p('{<>}')), li(p(''))));
      const expectedDoc = doc(ul(li(p('{<>}'))));
      const { editorView } = editor(initialDoc);
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    it('should lift the next listItem into the previous and keep siblings / children with the same indentation', () => {
      const initialDoc = doc(
        ul(
          li(code_block()('a'), p('b{<>}')),
          li(p('c'), code_block()('d'), ul(li(p('e')))),
        ),
        p('g'),
      );
      const expectedDoc = doc(
        ul(
          li(code_block()('a'), p('b{<>}c'), code_block()('d'), ul(li(p('e')))),
        ),
        p('g'),
      );
      const { editorView } = editor(initialDoc);
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });

  describe('when list delete case 3', () => {
    it('should lift the indented listItem into the previous when they both have empty paragraphs', () => {
      const initialDoc = doc(ul(li(p('{<>}'), ul(li(p(''))))));
      const expectedDoc = doc(ul(li(p('{<>}'))));
      const { editorView } = editor(initialDoc);
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    //Tested without children since this will trigger the deletion of the nested list while other tests won't
    it('should lift the indented listItem into the previous and keep siblings', () => {
      const initialDoc = doc(
        ul(
          li(code_block()('a'), p('b{<>}'), ul(li(p('c'), code_block()('d')))),
        ),
        p('e'),
      );
      const expectedDoc = doc(
        ul(li(code_block()('a'), p('b{<>}c'), code_block()('d'))),
        p('e'),
      );
      const { editorView } = editor(initialDoc);
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    //Tests case where Children K are present but not Children J
    it('should lift the indented listItem into the previous and keep siblings / unindented children', () => {
      const initialDoc = doc(
        ul(
          li(
            code_block()('a'),
            p('b{<>}'),
            ul(li(p('c'), code_block()('d')), li(p('e')), li(p('f'))),
          ),
        ),
        p('g'),
      );
      const expectedDoc = doc(
        ul(
          li(
            code_block()('a'),
            p('b{<>}c'),
            code_block()('d'),
            ul(li(p('e')), li(p('f'))),
          ),
        ),
        p('g'),
      );
      const { editorView } = editor(initialDoc);
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    //Tests case where Children J are present but not Children K
    it('should lift the indented listItem into the previous and keep siblings / indented children', () => {
      const initialDoc = doc(
        ul(
          li(
            code_block()('a'),
            p('b{<>}'),
            ul(li(p('c'), code_block()('d'), ul(li(p('e')), li(p('f'))))),
          ),
        ),
        p('g'),
      );
      const expectedDoc = doc(
        ul(
          li(
            code_block()('a'),
            p('b{<>}c'),
            code_block()('d'),
            ul(li(p('e')), li(p('f'))),
          ),
        ),
        p('g'),
      );
      const { editorView } = editor(initialDoc);
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    //Tests case where Children K and J are present
    it('should lift the indented listItem into the previous and keep siblings / indented and unindented children', () => {
      const initialDoc = doc(
        ul(
          li(
            code_block()('a'),
            p('b{<>}'),
            ul(
              li(p('c'), code_block()('d'), ul(li(p('e')), li(p('f')))),
              li(p('g')),
              li(p('h')),
            ),
          ),
        ),
        p('i'),
      );
      const expectedDoc = doc(
        ul(
          li(
            code_block()('a'),
            p('b{<>}c'),
            code_block()('d'),
            ul(li(p('e')), li(p('f')), li(p('g')), li(p('h'))),
          ),
        ),
        p('i'),
      );
      const { editorView } = editor(initialDoc);
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });

  describe('when list delete case 4', () => {
    it('should lift the unindented listItem into the previous when both contain blank paragraphs', () => {
      const initialDoc = doc(ul(li(p(''), ul(li(p('{<>}')))), li(p(''))));
      const expectedDoc = doc(ul(li(p(''), ul(li(p(''))))));
      const { editorView } = editor(initialDoc);
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    //Tests case where Children O is not present
    it('should lift the unindented listItem into the previous and keep siblings', () => {
      const initialDoc = doc(
        ul(
          li(p('a'), ul(li(code_block()('b'), p('c{<>}')))),
          li(p('d'), code_block()('e')),
        ),
        p('f'),
      );
      const expectedDoc = doc(
        ul(
          li(p('a'), ul(li(code_block()('b'), p('c{<>}d'), code_block()('e')))),
        ),
        p('f'),
      );
      const { editorView } = editor(initialDoc);
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    //Tests case where Children O is present
    it('should lift the unindented listItem into the previous and keep siblings / children with the same indentation', () => {
      const initialDoc = doc(
        ul(
          li(code_block()('a'), ul(li(code_block()('b'), p('c{<>}')))),
          li(p('d'), code_block()('e'), ul(li(p('f')), li(p('g')))),
        ),
        p('h'),
      );
      const expectedDoc = doc(
        ul(
          li(
            code_block()('a'),
            ul(
              li(code_block()('b'), p('c{<>}d'), code_block()('e')),
              li(p('f')),
              li(p('g')),
            ),
          ),
        ),
        p('h'),
      );
      const { editorView } = editor(initialDoc);
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    //Tests case where the nested list isn't just a single list (since we have to search for the paragraph inside the leaf list)
    it('should lift the unindented listItem into the previous when it is deeply nested and keep siblings / children with the same indentation', () => {
      const initialDoc = doc(
        ul(
          li(
            code_block()('a'),
            ul(
              li(p('b'), ul(li(p('c'), ul(li(code_block()('d'), p('e{<>}')))))),
            ),
          ),
          li(p('f'), code_block()('g'), ul(li(p('h')), li(p('i')))),
        ),
        p('j'),
      );
      const expectedDoc = doc(
        ul(
          li(
            code_block()('a'),
            ul(
              li(
                p('b'),
                ul(
                  li(
                    p('c'),
                    ul(li(code_block()('d'), p('e{<>}f'), code_block()('g'))),
                  ),
                ),
              ),
              li(p('h')),
              li(p('i')),
            ),
          ),
        ),
        p('j'),
      );
      const { editorView } = editor(initialDoc);
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });

  describe('empty paragraph followed by single level list', () => {
    it('should delete the empty paragraph', () => {
      const initialDoc = case5[1];
      // prettier-ignore
      const expectedDoc = doc(
        ul(
          li(
            p('{<>}A')
          ),
          li(
            p('B')
          )
        )
      );
      const { editorView } = editor(initialDoc);
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });

  describe('empty paragraph followed by nested list', () => {
    it('should delete the empty paragraph', () => {
      const initialDoc = case6[1];
      // prettier-ignore
      const expectedDoc = doc(
        ul(
          li(
            p('{<>}A'),
            ul(
              li(
                p('child 1')
              ),
              li(
                p('child 2')
              )
            )
          ),
          li(
            p('B')
          )
        ),
      );
      const { editorView } = editor(initialDoc);
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });

  describe('paragraph with text followed by single level list', () => {
    it('should merge the first list items content into the paragraph', () => {
      const initialDoc = case7[1];
      // prettier-ignore
      const expectedDoc = doc(
        p('some text {<>}A'),
        ul(
          li(
            p('B')
          )
        )
      );
      const { editorView } = editor(initialDoc);
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });

  describe('paragraph with text followed by nested list', () => {
    it('should merge the first list items content into the paragraph, and merge the nested list items into the top level of the list', () => {
      const initialDoc = case8[1];
      // prettier-ignore
      const expectedDoc = doc(
        p('some text {<>}A'),
        ul(
          li(
            p('child 1'),
            ul(
              li(
                p('third level child')
                )
              )
            ),
          li(
            p('child 2')
          ),
          li(
            p('B')
          ),
        ),
      );
      const { editorView } = editor(initialDoc);
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });

  describe('paragraph with text followed by single list item', () => {
    it('should merge the first list items content into the paragraph and delete the remaining empty list', () => {
      const initialDoc = case9[1];
      // prettier-ignore
      const expectedDoc = doc(
        p('some text {<>}A')
      );
      const { editorView } = editor(initialDoc);
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });

  describe('paragraph with text followed by a list item with no content but a nested list', () => {
    it('should merge the first (empty) list items content into the paragraph and and merge the nested list items into the top level of the list', () => {
      const initialDoc = case10[1];
      // prettier-ignore
      const expectedDoc = doc(
        p('some text {<>}'),
        ul(
          li(
            p('A')
          )
        ),
      );
      const { editorView } = editor(initialDoc);
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });

  describe('paragraph with text followed by a list item with no content and no nested lists', () => {
    it('should merge the first (empty) list items content into the paragraph and leave the rest of the list items', () => {
      const initialDoc = case11[1];
      // prettier-ignore
      const expectedDoc = doc(
        p('some text {<>}'),
        ul(
          li(
            p('B')
          ),
          li(
            p('C')
          )
        ),
      );
      const { editorView } = editor(initialDoc);
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });

  describe('paragraph with text followed by a list item with no content but a nested list AND siblings', () => {
    it('should merge the first (empty) list items content into the paragraph and and merge the nested list items into the top level of the list', () => {
      const initialDoc = case12[1];
      // prettier-ignore
      const expectedDoc = doc(
        p('some text {<>}'),
        ul(
          li(
            p('B'),
            ul(
              li(
                p('C')
              ),
              li(
                p('D')
              ),
            ),
          ),
          li(
            p('E')
          ),
          li(
            p('F')
          ),
          li(
            p('G')
          )
        ),
      );
      const { editorView } = editor(initialDoc);
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });

  describe('paragraph with text followed by a list item with one paragraphs and its first child is a hardbreak', () => {
    it('should delete the first hardbreak and leave the rest of the paragraph', () => {
      const initialDoc = case13[1];
      // prettier-ignore
      const expectedDoc = doc(
        p('some text {<>}'),
        ul(
          li(
            p('A', br(), 'B', br(), 'C'),
          ),
          li(
            p('D')
          ),
          li(
            p('E')
          )
        ),
      );
      const { editorView } = editor(initialDoc);
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });

  describe('paragraph with text followed by a list item with multiple paragraphs', () => {
    it('should merge the first paragraph in the list to the paragraph before, but leave the remaining paragraphs in the list item', () => {
      const initialDoc = case14[1];
      // prettier-ignore
      const expectedDoc = doc(
        p('some text {<>}A'),
        ul(
          li(
            p('B'),
            p('C'),
          ),
          li(
            p('D')
          ),
          li(
            p('E')
          )
        ),
      );
      const { editorView } = editor(initialDoc);
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });

  describe('paragraph with text followed by a list item with multiple paragraphs, the first empty', () => {
    it('should delete the empty paragraph in the first list item, but leave any remaining', () => {
      const initialDoc = case15[1];
      // prettier-ignore
      const expectedDoc = doc(
        p('some text {<>}'),
        ul(
          li(
            p('B'),
            p('C'),
          ),
          li(
            p('D')
          ),
          li(
            p('E')
          )
        ),
      );
      const { editorView } = editor(initialDoc);
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });

  describe('status node followed by a list item with an inline code block and text', () => {
    it('should merge the inline code block and text with the status nodes paragraph', () => {
      const initialDoc = case16[1];
      // prettier-ignore
      const expectedDoc = doc(
        p(
          status({ text: 'test', color: '#FFF', localId: 'a' }),
          '{<>}',
          code('hello'),
          'world',
        ),
      );
      const { editorView } = editor(initialDoc);
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });

  describe('paragraph followed by multiple list items, the first with an inline code block and text', () => {
    it('should merge the inline code block and text with the paragraph', () => {
      const initialDoc = case17[1];
      // prettier-ignore
      const expectedDoc = doc(
        p(
          'some text {<>}',
          code('hello'),
          'world',
        ),
        ul(
          li(p('A')),
          li(p('B')),
        ),
      );
      const { editorView } = editor(initialDoc);
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });

  describe('paragraph followed by multiple list items, the first with a multiple paragraphs', () => {
    it('should merge the inline code block and text with the paragraph, leave the second paragraph', () => {
      const initialDoc = case18[1];
      // prettier-ignore
      const expectedDoc = doc(
        p(
          'some text {<>}',
          code('hello'),
          'world',
        ),
        ul(
          li(p('multi paragraph')),
          li(p('A')),
          li(p('B')),
        ),
      );
      const { editorView } = editor(initialDoc);
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });

  describe('paragraph followed by a list items with multiple paragraphs, the first with marks', () => {
    it('should merge the inline code block and text with the paragraph, leave the second paragraph', () => {
      const initialDoc = case19[1];
      // prettier-ignore
      const expectedDoc = doc(
        p(
          'some text {<>}',
          code('hello'),
          'world',
        ),
        ul(
          li(p('multi paragraph with out siblings')),
        ),
      );
      const { editorView } = editor(initialDoc);
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });

  describe('paragraph followed by a list items with inline code, text, and a nested list', () => {
    it('should merge the inline code block and text with the paragraph, merge the nested list into the top level of list', () => {
      const initialDoc = case20[1];
      // prettier-ignore
      const expectedDoc = doc(
        p(
          'some text {<>}',
          code('hello'),
          'world',
        ),
        ul(
          li(p('what about nested item')),
        ),
      );
      const { editorView } = editor(initialDoc);
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });

  describe('paragraph followed by multiple list items, the first with marks and nested list', () => {
    it('should merge the inline code block and text with the paragraph, merge the nested list into the top level of list', () => {
      const initialDoc = case21[1];
      // prettier-ignore
      const expectedDoc = doc(
        p(
          'some text {<>}',
          code('hello'),
          'world',
        ),
        ul(
          li(p('what about nested item with sibling')),
          li(p('hey')),
        ),
      );
      const { editorView } = editor(initialDoc);
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });

  describe('panel followed by a single list item with inline code and text', () => {
    it('should merge the inline code block and text with the paragraph inside the panel, delete the remaining empty list', () => {
      const initialDoc = case22[1];
      // prettier-ignore
      const expectedDoc = doc(
        panel()(
          p(
            'some text inside panel{<>}',
            code('hello'),
            'world',
          ),
        ),
      );
      const { editorView } = editor(initialDoc);
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });

  describe('panel followed by multiple list items, first with inline code and text', () => {
    it('should merge the inline code block and text with the paragraph inside the panel, leave the remaining list items', () => {
      const initialDoc = case23[1];
      // prettier-ignore
      const expectedDoc = doc(
        panel()(
          p(
            'some text inside panel{<>}',
            code('hello'),
            'world',
          ),
        ),
        ul(
          li(p('with sibling')),
        ),
      );
      const { editorView } = editor(initialDoc);
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });

  describe('panel followed by multiple list items, first with inline code and text, and a nested list', () => {
    it('should merge the inline code block and text with the paragraph inside the panel, merge nested list to top level, and leave the remaining list items', () => {
      const initialDoc = case24[1];
      // prettier-ignore
      const expectedDoc = doc(
        panel()(
          p(
            'some text inside panel{<>}',
            code('hello'),
            'world',
          ),
        ),
        ul(
          li(p('what about nested item with sibling')),
          li(p('with sibling')),
        ),
      );
      const { editorView } = editor(initialDoc);
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });
});
