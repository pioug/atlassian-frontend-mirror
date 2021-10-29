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
import { MediaCardError } from './../../errors';

export const relevantFeatureFlagNames: Array<keyof MediaFeatureFlags> = [
  'newCardExperience',
  'captions',
];

export const fireOperationalEvent = (
  createAnalyticsEvent: CreateUIAnalyticsEvent,
  status: CardStatus,
  fileAttributes: FileAttributes,
  performanceAttributes: PerformanceAttributes,
  error?: MediaCardError,
) => {
  const fireEvent = (payload: MediaCardAnalyticsEventPayload) =>
    fireMediaCardEvent(payload, createAnalyticsEvent);

  switch (status) {
    case 'complete':
      fireEvent(
        getRenderSucceededEventPayload(fileAttributes, performanceAttributes),
      );
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
