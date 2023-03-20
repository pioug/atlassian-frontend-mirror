import countBy from 'lodash/countBy';
import { ADD_STEPS_TYPE, EVENT_ACTION, EVENT_STATUS } from '../helpers/const';
import {
  AcknowledgementResponseTypes,
  AddStepAcknowledgementPayload,
  ErrorPayload,
  StepJson,
  StepsPayload,
} from '../types';

import type { Step as ProseMirrorStep } from 'prosemirror-transform';
import type { Channel } from '../channel';
import AnalyticsHelper from '../analytics';

export const commitStep = ({
  channel,
  steps,
  version,
  userId,
  clientId,
  onStepsAdded,
  onErrorHandled,
  analyticsHelper,
}: {
  channel: Channel;
  steps: readonly ProseMirrorStep[];
  version: number;
  userId: string;
  clientId: number | string;
  onStepsAdded: (data: StepsPayload) => void;
  onErrorHandled: (error: ErrorPayload) => void;
  analyticsHelper?: AnalyticsHelper;
}) => {
  const stepsWithClientAndUserId = steps.map((step) => ({
    ...step.toJSON(),
    clientId,
    userId,
  })) as StepJson[];

  const start = new Date().getTime();
  channel.broadcast(
    'steps:commit',
    {
      steps: stepsWithClientAndUserId,
      version,
      userId,
    },
    (response: AddStepAcknowledgementPayload) => {
      const latency = new Date().getTime() - start;

      if (response.type === AcknowledgementResponseTypes.SUCCESS) {
        onStepsAdded({
          steps: stepsWithClientAndUserId,
          version: response.version,
        });
        analyticsHelper?.sendActionEvent(
          EVENT_ACTION.ADD_STEPS,
          EVENT_STATUS.SUCCESS,
          {
            type: ADD_STEPS_TYPE.ACCEPTED,
            latency,
            stepType: countBy(
              stepsWithClientAndUserId,
              (stepWithClientAndUserId) => stepWithClientAndUserId.stepType!,
            ),
          },
        );
      } else if (response.type === AcknowledgementResponseTypes.ERROR) {
        onErrorHandled(response.error);
        analyticsHelper?.sendActionEvent(
          EVENT_ACTION.ADD_STEPS,
          EVENT_STATUS.FAILURE,
          {
            // User tried committing steps but they were rejected because:
            // - HEAD_VERSION_UPDATE_FAILED: the collab service's latest stored step tail version didn't correspond to the head version of the first step submitted
            // - VERSION_NUMBER_ALREADY_EXISTS: while storing the steps there was a conflict meaning someone else wrote steps into the database more quickly
            type:
              response.error?.data?.code === 'HEAD_VERSION_UPDATE_FAILED' ||
              response.error?.data?.code === 'VERSION_NUMBER_ALREADY_EXISTS'
                ? ADD_STEPS_TYPE.REJECTED
                : ADD_STEPS_TYPE.ERROR,
            latency,
          },
        );
        analyticsHelper?.sendErrorEvent(
          response.error,
          'Error while adding steps - Acknowledgement Error',
        );
      } else {
        analyticsHelper?.sendErrorEvent(
          // @ts-expect-error We didn't type the invalid type case
          new Error(`Response type: ${response?.type || 'No response type'}`),
          'Error while adding steps - Invalid Acknowledgement',
        );
      }
    },
  );
};
