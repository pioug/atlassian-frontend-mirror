import { EditorState } from 'prosemirror-state';
import sampleSchema from '@atlaskit/editor-test-helpers/schema';
import { setSelectionTransform } from '@atlaskit/editor-test-helpers/set-selection-transform';
import {
  p,
  ul,
  li,
  doc,
  RefsNode,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { calcJoinListScenario, listDelete } from '../../commands/listDelete';
import { walkNextNode } from '../../../../utils/commands';
import {
  LIST_TEXT_SCENARIOS,
  addAnalytics,
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
  DELETE_DIRECTION,
} from '../../../analytics';
jest.mock('../../../analytics');

function createEditorState(documentNode: RefsNode) {
  const myState = EditorState.create({
    doc: documentNode,
  });
  const { tr } = myState;
  setSelectionTransform(documentNode, tr);
  return myState.apply(tr);
}

describe('list-delete', () => {
  // prettier-ignore
  const documentCase1 = doc(
    ul(
      li(
        p('A{<>}'),
      ),
    ),
    p('B'),
  )(sampleSchema);

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
  )(sampleSchema);

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
  )(sampleSchema);

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
  )(sampleSchema);

  afterEach(() => {
    (addAnalytics as jest.Mock).mockReset();
  });

  describe.each<[string, RefsNode, string]>([
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
  ])('when the next state is to %s', (_scenario, documentNode, eventName) => {
    describe('#calcJoinListScenario', () => {
      it(`should return the event ${eventName}`, () => {
        const myState = createEditorState(documentNode);
        const {
          selection: { $head },
        } = myState;
        const walkNode = walkNextNode($head);

        const scenario = calcJoinListScenario(walkNode, $head);

        expect(scenario).toEqual(eventName);
      });
    });

    describe('#listDelete', () => {
      it('should call the addAnalytics function with the proper data', () => {
        listDelete(createEditorState(documentNode));

        expect(addAnalytics).toHaveBeenCalledWith(
          expect.anything(),
          expect.anything(),
          expect.objectContaining({
            action: ACTION.LIST_ITEM_JOINED,
            actionSubject: ACTION_SUBJECT.LIST,
            actionSubjectId: ACTION_SUBJECT_ID.FORMAT_LIST_BULLET,
            eventType: EVENT_TYPE.TRACK,
            attributes: {
              inputMethod: INPUT_METHOD.KEYBOARD,
              direction: DELETE_DIRECTION.FORWARD,
              scenario: eventName,
            },
          }),
        );
      });
    });
  });
});
