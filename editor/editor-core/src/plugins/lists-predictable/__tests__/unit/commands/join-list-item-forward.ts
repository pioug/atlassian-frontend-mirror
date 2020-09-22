import {
  p,
  ul,
  li,
  doc,
  code_block,
  RefsNode,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { Schema } from 'prosemirror-model';
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
import listPredictablePlugin from '../../..';
import basePlugins from '../../../../../plugins/base';
import blockType from '../../../../../plugins/block-type';
import codeBlockTypePlugin from '../../../../../plugins/code-block';
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

  const editor = (doc: any) => {
    const preset = new Preset<LightEditorPlugin>()
      .add(listPredictablePlugin)
      .add(basePlugins)
      .add(blockType)
      .add(codeBlockTypePlugin)
      .add([analyticsPlugin, { createAnalyticsEvent }]);

    return createEditor({
      doc,
      preset,
    });
  };

  // prettier-ignore
  const documentCase1 = doc(
    ul(
      li(
        p('A{<>}'),
      ),
    ),
    p('B'),
  );

  // prettier-ignore
  const documentCase2 = doc(
    ul(
      li(
        p('A{<>}'),
      ),
      li(
        p('B'),
      )
    ),
    p('B'),
  );

  // prettier-ignore
  const documentCase3 = doc(
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
  );

  // prettier-ignore
  const documentCase4 = doc(
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
  );

  // prettier-ignore
  const documentEmptyParagraphFollowedBySingleLevelList = doc(
    p('{<>}'),
    ul(
      li(
        p('A'),
      ),
      li(
        p('B'),
      ),
    ),
  );

  // prettier-ignore
  const documentEmptyParagraphFollowedByNestedList = doc(
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
  );

  // prettier-ignore
  const documentParagraphFollowedBySingleLevelList = doc(
    p('some text {<>}'),
    ul(
      li(
        p('A'),
      ),
      li(
        p('B'),
      ),
    ),
  );

  // prettier-ignore
  const documentParagraphFollowedByNestedList = doc(
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
  );

  // prettier-ignore
  const documentParagraphFollowedBySingleListItem = doc(
    p('some text {<>}'),
    ul(
      li(
        p('A'),
      ),
    ),
  );

  // prettier-ignore
  const documentParagraphFollowedByEmptyListItem = doc(
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
  );

  describe.each<[string, (schema: Schema) => RefsNode, string]>([
    [
      'joining a list item with a paragraph',
      documentCase1,
      LIST_TEXT_SCENARIOS.JOIN_PARAGRAPH_WITH_LIST,
    ],
    [
      'joining a sibling list item',
      documentCase2,
      LIST_TEXT_SCENARIOS.JOIN_SIBLINGS,
    ],
    [
      'joining a sub list descendants into the parent',
      documentCase3,
      LIST_TEXT_SCENARIOS.JOIN_DESCENDANT_TO_PARENT,
    ],
    [
      'joining a parent sibling to the current level',
      documentCase4,
      LIST_TEXT_SCENARIOS.JOIN_PARENT_SIBLING_TO_PARENT_CHILD,
    ],
    [
      'removing the empty paragraph when followed by single level list',
      documentEmptyParagraphFollowedBySingleLevelList,
      LIST_TEXT_SCENARIOS.JOIN_LIST_ITEM_WITH_PARAGRAPH,
    ],
    [
      'removing the empty paragraph when followed by a nested list',
      documentEmptyParagraphFollowedByNestedList,
      LIST_TEXT_SCENARIOS.JOIN_LIST_ITEM_WITH_PARAGRAPH,
    ],
    [
      'joining the first list item to paragraph containing text',
      documentParagraphFollowedBySingleLevelList,
      LIST_TEXT_SCENARIOS.JOIN_LIST_ITEM_WITH_PARAGRAPH,
    ],
    [
      'joining the first list item to paragraph containing text, and joining child list to top level of list',
      documentParagraphFollowedByNestedList,
      LIST_TEXT_SCENARIOS.JOIN_LIST_ITEM_WITH_PARAGRAPH,
    ],
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
      const initialDoc = documentEmptyParagraphFollowedBySingleLevelList;
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
      const initialDoc = documentEmptyParagraphFollowedByNestedList;
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
      const initialDoc = documentParagraphFollowedBySingleLevelList;
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
      const initialDoc = documentParagraphFollowedByNestedList;
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
      const initialDoc = documentParagraphFollowedBySingleListItem;
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
      const initialDoc = documentParagraphFollowedByEmptyListItem;
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
});
