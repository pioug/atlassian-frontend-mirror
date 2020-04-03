import { MouseEvent } from 'react';
import {
  FileDetails,
  MediaClient,
  Identifier,
  ImageResizeMode,
} from '@atlaskit/media-client';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { CardAction } from './actions';
import { MediaViewerDataSource } from '@atlaskit/media-viewer';

export {
  MediaCardAnalyticsPayload,
  MediaCardAnalyticsFileAttributes,
} from './utils/analytics';

export { default as Card } from './root/card/cardLoader';

export { CardAction, CardEventHandler } from './actions';

export type CardStatus =
  | 'uploading'
  | 'loading'
  | 'processing'
  | 'complete'
  | 'error'
  | 'failed-processing';

export type CardAppearance = 'auto' | 'image' | 'square' | 'horizontal';

export type CardDimensionValue = number | string;

export interface CardDimensions {
  width?: CardDimensionValue;
  height?: CardDimensionValue;
}

export interface OriginalCardDimensions {
  width: number;
  height: number;
}

export interface CardEvent {
  event: MouseEvent<HTMLElement>;
  mediaItemDetails?: FileDetails;
}

export interface SharedCardProps {
  readonly appearance?: CardAppearance;
  readonly dimensions?: CardDimensions;
  readonly originalDimensions?: OriginalCardDimensions;
  readonly actions?: Array<CardAction>;
  readonly selectable?: boolean;
  readonly selected?: boolean;
  readonly alt?: string;
  readonly testId?: string;
}

export interface CardOnClickCallback {
  (result: CardEvent, analyticsEvent?: UIAnalyticsEvent): void;
}

export interface CardEventProps {
  readonly onClick?: CardOnClickCallback;
  readonly onMouseEnter?: (result: CardEvent) => void;
}

export interface CardProps extends SharedCardProps, CardEventProps {
  readonly mediaClient: MediaClient;
  readonly identifier: Identifier;
  readonly isLazy?: boolean;
  readonly resizeMode?: ImageResizeMode;

  // only relevant to file card with image appearance
  readonly disableOverlay?: boolean;
  readonly useInlinePlayer?: boolean;
  readonly shouldOpenMediaViewer?: boolean;
  readonly mediaViewerDataSource?: MediaViewerDataSource;
  readonly contextId?: string;
}

export interface CardState {
  status: CardStatus;
  isCardVisible: boolean;
  previewOrientation: number;
  isPlayingFile: boolean;
  mediaViewerSelectedItem?: Identifier;
  metadata?: FileDetails;
  dataURI?: string;
  progress?: number;
  error?: Error;
}

export { CardLoading } from './utils/lightCards/cardLoading';
export { CardError } from './utils/lightCards/cardError';
export { defaultImageCardDimensions } from './utils/cardDimensions';
