import {
  FileAttributes,
  MediaFeatureFlags,
  PerformanceAttributes,
} from '@atlaskit/media-common';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  fireMediaCardEvent,
  getRenderSucceededEventPayload,
  getRenderErrorEventPayload,
  getRenderFailedFileStatusPayload,
  getCopiedFilePayload,
  getRenderCommencedEventPayload,
  MediaCardAnalyticsEventPayload,
  getRenderPreviewableCardPayload,
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
  performanceAttributes: PerformanceAttributes,
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
        fireEvent(
          getRenderSucceededEventPayload(fileAttributes, performanceAttributes),
        );
      }
      break;
    case 'failed-processing':
      fireEvent(
        getRenderFailedFileStatusPayload(fileAttributes, performanceAttributes),
      );
      break;
    case 'error':
      error &&
        fireEvent(
          getRenderErrorEventPayload(
            fileAttributes,
            performanceAttributes,
            error,
          ),
        );
      break;
  }
};

export const fireCommencedEvent = (
  createAnalyticsEvent: CreateUIAnalyticsEvent,
  fileAttributes: FileAttributes,
  performanceAttributes: PerformanceAttributes,
) => {
  fireMediaCardEvent(
    getRenderCommencedEventPayload(fileAttributes, performanceAttributes),
    createAnalyticsEvent,
  );
};

export const fireCopiedEvent = (
  createAnalyticsEvent: CreateUIAnalyticsEvent,
  fileId: string,
  cardRef: HTMLDivElement,
) => {
  if (typeof window.getSelection === 'function') {
    const selection = window.getSelection();
    if (selection?.containsNode?.(cardRef, true)) {
      fireMediaCardEvent(getCopiedFilePayload(fileId), createAnalyticsEvent);
    }
  }
};

export const fireScreenEvent = (
  createAnalyticsEvent: CreateUIAnalyticsEvent,
  fileAttributes: FileAttributes,
) => {
  fireMediaCardEvent(
    getRenderPreviewableCardPayload(fileAttributes),
    createAnalyticsEvent,
  );
};
