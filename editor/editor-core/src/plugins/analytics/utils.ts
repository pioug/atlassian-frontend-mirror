import { Step } from 'prosemirror-transform';
import {
  EditorState,
  ReadonlyTransaction,
  Transaction,
} from 'prosemirror-state';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { AnalyticsStep } from '@atlaskit/adf-schema/steps';
import { editorAnalyticsChannel } from './consts';
import {
  AnalyticsEventPayloadWithChannel,
  AnalyticsEventPayload,
} from './types';
import { analyticsPluginKey } from './plugin-key';
import { HigherOrderCommand } from '../../types/command';

function getCreateUIAnalyticsEvent(
  editorState: EditorState,
): CreateUIAnalyticsEvent | null | undefined {
  return analyticsPluginKey.getState(editorState)?.createAnalyticsEvent;
}

import { attachPayloadIntoTransaction } from '../../analytics-api/attach-payload-into-transaction';
import { mapActionSubjectIdToAttributes } from '../../analytics-api/map-attributes';
import {
  getStateContext,
  getSelectionType,
  findInsertLocation,
} from '../../analytics-api/editor-state-context';

export {
  getStateContext,
  mapActionSubjectIdToAttributes,
  getSelectionType,
  findInsertLocation,
};

export function addAnalytics(
  state: EditorState,
  tr: Transaction,
  payload: AnalyticsEventPayload,
  channel: string = editorAnalyticsChannel,
): Transaction {
  const createAnalyticsEvent = getCreateUIAnalyticsEvent(state);
  if (!createAnalyticsEvent) {
    return tr;
  }

  attachPayloadIntoTransaction({
    tr,
    editorState: state,
    payload,
    channel,
  });

  return tr;
}

export type AnalyticsEventPayloadCallback = (
  state: EditorState,
) => AnalyticsEventPayload | undefined;

export function withAnalytics(
  payload: AnalyticsEventPayload | AnalyticsEventPayloadCallback,
  channel?: string,
): HigherOrderCommand {
  return (command) => (state, dispatch, view) =>
    command(
      state,
      (tr) => {
        if (dispatch) {
          if (payload instanceof Function) {
            const dynamicPayload = payload(state);
            if (dynamicPayload) {
              dispatch(addAnalytics(state, tr, dynamicPayload, channel));
            }
          } else {
            dispatch(addAnalytics(state, tr, payload, channel));
          }
        }
      },
      view,
    );
}

export function getAnalyticsEventsFromTransaction(
  tr: Transaction | ReadonlyTransaction,
): AnalyticsEventPayloadWithChannel[] {
  return (tr.steps as Step[])
    .filter<AnalyticsStep<AnalyticsEventPayload>>(
      (step: Step): step is AnalyticsStep<AnalyticsEventPayload> =>
        step instanceof AnalyticsStep,
    )
    .reduce<AnalyticsEventPayloadWithChannel[]>(
      (acc, step) => [...acc, ...step.analyticsEvents],
      [],
    );
}
