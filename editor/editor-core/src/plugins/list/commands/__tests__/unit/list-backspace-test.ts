import {
  p,
  ul,
  li,
  doc,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import { calcJoinListScenario, listBackspace } from '../../listBackspace';
import { walkPrevNode } from '../../../../../utils/commands';
import {
  LIST_TEXT_SCENARIOS,
  addAnalytics,
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
  DELETE_DIRECTION,
} from '../../../../analytics';
jest.mock('../../../../analytics');

describe('list-backspace', () => {
  // prettier-ignore
  const documentCase2 = doc(
    ul(
      li(
        p('A1'),
      ),
      li(
        p('{<>}A2'),
      ),
    ),
  );

  // prettier-ignore
  const documentCase3 = doc(
    ul(
      li(
        p('A'),
        ul(
          li(
            p('{<>}A1'),
          ),
          li(
            p('A2'),
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
            p('A1'),
          ),
        )
      ),
      li(
        p('{<>}B'),
        ul(
          li(
            p('B1'),
          ),
        ),
      ),
    ),
  );

  afterEach(() => {
    (addAnalytics as jest.Mock).mockReset();
  });

  describe.each<[string, DocBuilder, string]>([
    ['joining sibling itens', documentCase2, LIST_TEXT_SCENARIOS.JOIN_SIBLINGS],
    [
      'joining descendant itens into the parent',
      documentCase3,
      LIST_TEXT_SCENARIOS.JOIN_DESCENDANT_TO_PARENT,
    ],
    [
      'joining sublist into parent sibling',
      documentCase4,
      LIST_TEXT_SCENARIOS.JOIN_TO_SIBLING_DESCENDANT,
    ],
  ])('when the next state is to %s', (_scenario, documentNode, eventName) => {
    describe('#calcJoinListScenario', () => {
      it(`should return the event ${eventName}`, () => {
        const myState = createEditorState(documentNode);
        const {
          tr,
          selection: { $head },
        } = myState;
        const walkNode = walkPrevNode($head);

        const scenario = calcJoinListScenario(walkNode, $head, tr);

        expect((scenario as any)[0]).toEqual(eventName);
      });
    });

    describe('#listBackspace', () => {
      it('should call the addAnalytics function with the proper event payload', () => {
        listBackspace(createEditorState(documentNode));

        expect(addAnalytics).toHaveBeenCalledWith(
          expect.anything(),
          expect.anything(),
          {
            action: ACTION.LIST_ITEM_JOINED,
            actionSubject: ACTION_SUBJECT.LIST,
            actionSubjectId: ACTION_SUBJECT_ID.FORMAT_LIST_BULLET,
            eventType: EVENT_TYPE.TRACK,
            attributes: {
              inputMethod: INPUT_METHOD.KEYBOARD,
              direction: DELETE_DIRECTION.BACKWARD,
              scenario: eventName,
            },
          },
        );
      });
    });
  });
});
