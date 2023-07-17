import countBy from 'lodash/countBy';
import throttle from 'lodash/throttle';
import { ADD_STEPS_TYPE, EVENT_ACTION, EVENT_STATUS } from '../helpers/const';
import {
  AcknowledgementResponseTypes,
  AddStepAcknowledgementPayload,
  ChannelEvent,
  StepsPayload,
} from '../types';
import type {
  CollabCommitStatusEventPayload,
  CollabEvents,
  StepJson,
} from '@atlaskit/editor-common/collab';
import type { Step as ProseMirrorStep } from 'prosemirror-transform';
import { NCS_ERROR_CODE } from '../errors/error-types';
import AnalyticsHelper from '../analytics/analytics-helper';
import type { InternalError } from '../errors/error-types';

const SEND_STEPS_THROTTLE = 500; // 0.5 second

export const commitStep = ({
  broadcast,
  steps,
  version,
  userId,
  clientId,
  onStepsAdded,
  onErrorHandled,
  analyticsHelper,
  emit,
}: {
  broadcast: <K extends keyof ChannelEvent>(
    type: K,
    data: Omit<ChannelEvent[K], 'timestamp'>,
    callback?: Function,
  ) => void;
  steps: readonly ProseMirrorStep[];
  version: number;
  userId: string;
  clientId: number | string;
  onStepsAdded: (data: StepsPayload) => void;
  onErrorHandled: (error: InternalError) => void;
  analyticsHelper?: AnalyticsHelper;
  emit: (evt: keyof CollabEvents, data: CollabCommitStatusEventPayload) => void;
}) => {
  const stepsWithClientAndUserId = steps.map((step) => ({
    ...step.toJSON(),
    clientId,
    userId,
  })) as StepJson[];

  const start = new Date().getTime();
  emit('commit-status', { status: 'attempt', version });
  try {
    broadcast(
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
          // Sample only 10% of add steps events to avoid overwhelming the analytics
          if (Math.random() < 0.1) {
            analyticsHelper?.sendActionEvent(
              EVENT_ACTION.ADD_STEPS,
              EVENT_STATUS.SUCCESS_10x_SAMPLED,
              {
                type: ADD_STEPS_TYPE.ACCEPTED,
                latency,
                stepType: countBy(
                  stepsWithClientAndUserId,
                  (stepWithClientAndUserId) =>
                    stepWithClientAndUserId.stepType!,
                ),
              },
            );
          }
          emit('commit-status', {
            status: 'success',
            version: response.version,
          });
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
                response.error.data.code ===
                  NCS_ERROR_CODE.HEAD_VERSION_UPDATE_FAILED ||
                response.error.data.code ===
                  NCS_ERROR_CODE.VERSION_NUMBER_ALREADY_EXISTS
                  ? ADD_STEPS_TYPE.REJECTED
                  : ADD_STEPS_TYPE.ERROR,
              latency,
            },
          );
          analyticsHelper?.sendErrorEvent(
            response.error,
            'Error while adding steps - Acknowledgement Error',
          );
          emit('commit-status', { status: 'failure', version });
        } else {
          analyticsHelper?.sendErrorEvent(
            // @ts-expect-error We didn't type the invalid type case
            new Error(`Response type: ${response?.type || 'No response type'}`),
            'Error while adding steps - Invalid Acknowledgement',
          );
          emit('commit-status', { status: 'failure', version });
        }
      },
    );
  } catch (error) {
    analyticsHelper?.sendErrorEvent(
      error,
      'Error while adding steps - Broadcast threw exception',
    );
    emit('commit-status', { status: 'failure', version });
  }
};

export const throttledCommitStep = throttle<typeof commitStep>(
  commitStep,
  SEND_STEPS_THROTTLE,
  {
    leading: false,
    trailing: true,
  },
);
