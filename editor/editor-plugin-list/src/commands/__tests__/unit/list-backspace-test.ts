import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  DELETE_DIRECTION,
  EVENT_TYPE,
  INPUT_METHOD,
  LIST_TEXT_SCENARIOS,
} from '@atlaskit/editor-common/analytics';
import { walkPrevNode } from '@atlaskit/editor-common/utils';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import type { DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import { doc, li, p, ul } from '@atlaskit/editor-test-helpers/doc-builder';

import { calcJoinListScenario, listBackspace } from '../../listBackspace';

describe('list-backspace', () => {
  const editorAnalyticsAPIFake: EditorAnalyticsAPI = {
    attachAnalyticsEvent: jest.fn().mockReturnValue(() => jest.fn()),
  };
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

  // describe('test', () => {
  //   it('should pass', () => {
  //     const myState = createEditorState(documentCase4);
  //     expect(1).toBeTruthy();
  //   });
  // });

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
      it('should call the editorAnalyticsAPIFake function with the proper event payload', () => {
        listBackspace(editorAnalyticsAPIFake)(createEditorState(documentNode));

        expect(
          editorAnalyticsAPIFake.attachAnalyticsEvent,
        ).toHaveBeenCalledWith({
          action: ACTION.LIST_ITEM_JOINED,
          actionSubject: ACTION_SUBJECT.LIST,
          actionSubjectId: ACTION_SUBJECT_ID.FORMAT_LIST_BULLET,
          eventType: EVENT_TYPE.TRACK,
          attributes: {
            inputMethod: INPUT_METHOD.KEYBOARD,
            direction: DELETE_DIRECTION.BACKWARD,
            scenario: eventName,
          },
        });
      });
    });
  });
});
