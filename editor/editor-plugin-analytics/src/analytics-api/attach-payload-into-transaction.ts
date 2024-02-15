import { AnalyticsStep } from '@atlaskit/adf-schema/steps';
import type {
  AnalyticsEventPayload,
  TABLE_ACTION,
} from '@atlaskit/editor-common/analytics';
import { ACTION } from '@atlaskit/editor-common/analytics';
import type {
  Selection,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';

import { getStateContext } from './editor-state-context';
import { mapActionSubjectIdToAttributes } from './map-attributes';

const actionsToIgnore: (ACTION | TABLE_ACTION)[] = [
  ACTION.INVOKED,
  ACTION.OPENED,
];

type AttachPayloadIntoTransaction = (props: {
  payload: AnalyticsEventPayload;
  selection: Selection;
  tr: Transaction;
  channel: string;
}) => void;

export type CreateAttachPayloadIntoTransaction = (props: {
  payload: AnalyticsEventPayload;
  tr: Transaction;
  channel: string;
}) => void;

export const createAttachPayloadIntoTransaction =
  (selection: Selection): CreateAttachPayloadIntoTransaction =>
  ({ payload, tr, channel }) =>
    attachPayloadIntoTransaction({ payload, selection, tr, channel });

// This utils was taken as reference in packages/editor/editor-plugin-ai/src/analytics/utils.ts
//  to create new util attachPayloadIntoTransaction in above file.
// If you make a change here, please review attachPayloadIntoTransaction in above
//  file and update it as well if needed.
export const attachPayloadIntoTransaction: AttachPayloadIntoTransaction = ({
  payload,
  selection,
  tr,
  channel,
}) => {
  payload = getStateContext(selection, payload, tr);
  payload = mapActionSubjectIdToAttributes(payload);

  const { storedMarks } = tr;
  const pos = tr.mapping.map(selection.$from.pos, -1);
  tr.step(
    new AnalyticsStep(
      [
        {
          payload,
          channel,
        },
      ],
      actionsToIgnore,
      pos, // We need to create the step based on a position, this prevent split history for relative changes.
    ),
  );

  // When you add a new step all the storedMarks are removed it
  if (storedMarks) {
    tr.setStoredMarks(storedMarks);
  }
};
