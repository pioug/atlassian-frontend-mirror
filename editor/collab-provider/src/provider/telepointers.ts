import { createLogger } from '../helpers/utils';
import type { CollabEventTelepointerData } from '@atlaskit/editor-common/collab';
import {
  ExperiencePerformanceTypes,
  ExperienceTypes,
  UFOExperience,
} from '@atlaskit/ufo';
import {
  AcknowledgementErrorPayload,
  AcknowledgementPayload,
  AcknowledgementResponseTypes,
  StepJson,
} from '../types';
import { ParticipantsMap } from './index';

const logger = createLogger('Telepointer', 'green');

export const telepointersFromStep = (
  participants: ParticipantsMap,
  step: StepJson,
): CollabEventTelepointerData | undefined => {
  const [participant] = Array.from(participants.values()).filter(
    (p) => p.clientId === step.clientId,
  );
  if (participant) {
    const { stepType, to, from, slice = { content: [] } } = step;

    const [node] = slice.content;

    if (
      to &&
      from &&
      stepType === 'replace' &&
      to === from &&
      slice.content.length === 1 &&
      node?.type === 'text' &&
      node?.text?.length === 1
    ) {
      return {
        sessionId: participant.sessionId,
        selection: {
          type: 'textSelection',
          anchor: from + 1,
          head: to + 1,
        },
        type: 'telepointer',
      };
    }
  }
};

export const telepointerCallback = (
  documentAri: string,
): ((response: AcknowledgementPayload) => void) => {
  const telepointerExperience = new UFOExperience(
    'collab-provider.telepointer',
    {
      type: ExperienceTypes.Operation,
      performanceType: ExperiencePerformanceTypes.Custom,
      performanceConfig: {
        histogram: {
          [ExperiencePerformanceTypes.Custom]: {
            duration: '250_500_1000_1500_2000_3000_4000',
          },
        },
      },
    },
  );
  telepointerExperience.addMetadata({
    documentAri,
  });
  telepointerExperience.start();

  return (response: AcknowledgementPayload) => {
    if (response.type === AcknowledgementResponseTypes.SUCCESS) {
      telepointerExperience.success();
    } else if (response.type === AcknowledgementResponseTypes.ERROR) {
      const errorMessage = (response as AcknowledgementErrorPayload).error;
      telepointerExperience.addMetadata({
        error: errorMessage,
      });
      logger(
        'Error from collab service with telepointer broadcast',
        errorMessage,
      );
      telepointerExperience.failure();
    } else {
      logger('Invalid ACK from collab service with telepointer broadcast');
      telepointerExperience.addMetadata({
        error: 'Invalid ACK from collab service with telepointer broadcast',
      });
      telepointerExperience.failure();
    }
  };
};
