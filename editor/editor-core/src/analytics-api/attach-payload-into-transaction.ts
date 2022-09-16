import type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics';
import type { Transaction, EditorState } from 'prosemirror-state';
import { getStateContext } from './editor-state-context';
import { mapActionSubjectIdToAttributes } from './map-attributes';
import { AnalyticsStep } from '@atlaskit/adf-schema/steps';
import { ACTION, TABLE_ACTION } from '@atlaskit/editor-common/analytics';

const actionsToIgnore: (ACTION | TABLE_ACTION)[] = [
  ACTION.INVOKED,
  ACTION.OPENED,
];

type AttachPayloadIntoTransaction = (props: {
  payload: AnalyticsEventPayload;
  editorState: EditorState;
  tr: Transaction;
  channel: string;
}) => void;

export const attachPayloadIntoTransaction: AttachPayloadIntoTransaction = ({
  payload,
  editorState,
  tr,
  channel,
}) => {
  payload = getStateContext(editorState, payload);
  payload = mapActionSubjectIdToAttributes(payload);

  const { storedMarks } = tr;
  tr.step(
    new AnalyticsStep(
      [
        {
          payload,
          channel,
        },
      ],
      actionsToIgnore,
      tr.selection.$from.pos, // We need to create the step based on a position, this prevent split history for relative changes.
    ),
  );

  // When you add a new step all the storedMarks are removed it
  if (storedMarks) {
    tr.setStoredMarks(storedMarks);
  }
};
