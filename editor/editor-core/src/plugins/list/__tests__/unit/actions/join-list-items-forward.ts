import {
  p,
  ul,
  li,
  doc,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import { calcJoinListScenario } from '../../../actions/join-list-items-forward';
import { walkNextNode } from '../../../../../utils/commands';
import { LIST_TEXT_SCENARIOS } from '../../../../analytics';

describe('list-delete', () => {
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
    p('{some text <>}'),
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
    p('{some text <>}'),
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

  describe.each<[string, DocBuilder, string]>([
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
      'joining a sub list descentas into the parent',
      documentCase3,
      LIST_TEXT_SCENARIOS.JOIN_DESCENDANT_TO_PARENT,
    ],
    [
      'joining a parent sibling to the current level',
      documentCase4,
      LIST_TEXT_SCENARIOS.JOIN_PARENT_SIBLING_TO_PARENT_CHILD,
    ],
    [
      'remove empty paragraph when followed by single level list',
      documentEmptyParagraphFollowedBySingleLevelList,
      LIST_TEXT_SCENARIOS.JOIN_LIST_ITEM_WITH_PARAGRAPH,
    ],
    [
      'remove empty paragraph when followed by a nested list',
      documentEmptyParagraphFollowedByNestedList,
      LIST_TEXT_SCENARIOS.JOIN_LIST_ITEM_WITH_PARAGRAPH,
    ],
    [
      'join first list item to paragraph containing text',
      documentParagraphFollowedBySingleLevelList,
      LIST_TEXT_SCENARIOS.JOIN_LIST_ITEM_WITH_PARAGRAPH,
    ],
    [
      'join first list item to paragraph containing text, and join child list to top level of list',
      documentParagraphFollowedByNestedList,
      LIST_TEXT_SCENARIOS.JOIN_LIST_ITEM_WITH_PARAGRAPH,
    ],
  ])('when the next state is to %s', (_scenario, documentNode, eventName) => {
    describe('#calcJoinListScenario', () => {
      it(`should return the event ${eventName}`, () => {
        const editorState = createEditorState(documentNode);
        const {
          selection: { $head },
        } = editorState;
        const walkNode = walkNextNode($head);

        const scenario = calcJoinListScenario(walkNode, $head);

        expect(scenario).not.toBe(false);

        if (scenario) {
          expect(scenario[0]).toEqual(eventName);
        }
      });
    });
  });
});
