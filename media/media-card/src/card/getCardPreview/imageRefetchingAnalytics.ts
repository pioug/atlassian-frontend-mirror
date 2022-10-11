import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { CardDimensions } from '../../types';
import {
  fireMediaCardEvent,
  getCacheHitEventPayload,
  getRemoteSuccessEventPayload,
  MediaCardAnalyticsEventPayload,
  CardPreviewAttributes,
} from '../../utils/analytics';

type cardAction = 'cache-hit' | 'remote-success';

export const fireImageFetchingOperationalEvent = (
  createAnalyticsEvent: CreateUIAnalyticsEvent,
  action: cardAction,
  cardPreviewAttributes: CardPreviewAttributes,
) => {
  const fireEvent = (payload: MediaCardAnalyticsEventPayload) =>
    fireMediaCardEvent(payload, createAnalyticsEvent);

  switch (action) {
    case 'cache-hit':
      fireEvent(getCacheHitEventPayload(cardPreviewAttributes));
      break;
    case 'remote-success':
      fireEvent(getRemoteSuccessEventPayload(cardPreviewAttributes));
      break;
  }
};

export const calculatePercentageDifference = (
  prevDimensions: CardDimensions | undefined,
  currentDimensions: CardDimensions | undefined,
) => {
  if (!prevDimensions) {
    return undefined;
  }
  const prevWidth = parseInt(`${prevDimensions?.width}`, 10);
  const currWidth = parseInt(`${currentDimensions?.width}`, 10);
  const prevHeight = parseInt(`${prevDimensions?.height}`, 10);
  const currHeight = parseInt(`${currentDimensions?.height}`, 10);
  const percentageDiffInWidth = (
    ((currWidth - prevWidth) / prevWidth) *
    100
  ).toFixed(2);
  const percentageDiffInHeight = (
    ((currHeight - prevHeight) / prevHeight) *
    100
  ).toFixed(2);

  return { width: percentageDiffInWidth, height: percentageDiffInHeight };
};
