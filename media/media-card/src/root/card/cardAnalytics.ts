import { FileAttributes, MediaFeatureFlags } from '@atlaskit/media-common';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  fireMediaCardEvent,
  getRenderSucceededEventPayload,
  getRenderErrorEventPayload,
  getRenderFailedFileStatusPayload,
  MediaCardAnalyticsEventPayload,
} from '../../utils/analytics';
import { CardStatus } from '../..';
import { CardPreview } from './getCardPreview';
import { MediaCardError } from './../../errors';

export const relevantFeatureFlagNames: Array<keyof MediaFeatureFlags> = [
  'newCardExperience',
  'poll_intervalMs',
  'poll_maxAttempts',
  'poll_backoffFactor',
  'poll_maxIntervalMs',
  'captions',
];

export type FireOperationalEventParams = {
  cardPreview?: CardPreview;
  error?: MediaCardError;
};

export const fireOperationalEvent = (
  createAnalyticsEvent: CreateUIAnalyticsEvent,
  status: CardStatus,
  fileAttributes: FileAttributes,
  { cardPreview, error }: FireOperationalEventParams = {},
) => {
  const fireEvent = (payload: MediaCardAnalyticsEventPayload) =>
    fireMediaCardEvent(payload, createAnalyticsEvent);

  switch (status) {
    case 'complete':
      /**
       * A Card that is considered Complete and has no preview,
       * reflects an expected behaviour, and thus a legitimate
       * success case to be logged.
       */
      if (!cardPreview?.dataURI) {
        fireEvent(getRenderSucceededEventPayload(fileAttributes));
      }
      break;
    case 'failed-processing':
      fireEvent(getRenderFailedFileStatusPayload(fileAttributes));
      break;
    case 'error':
      error && fireEvent(getRenderErrorEventPayload(fileAttributes, error));
      break;
  }
};
