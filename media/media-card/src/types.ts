/**
 * Entry Point: @atlaskit/media-card/types
 * tsconfig.entry-points.json
 */
import { MouseEvent } from 'react';
import {
  FileDetails,
  MediaClient,
  Identifier,
  ImageResizeMode,
  FileState,
} from '@atlaskit/media-client';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  MediaFeatureFlags,
  NumericalCardDimensions,
  SSR,
} from '@atlaskit/media-common';
import { CardAction } from './card/actions';
import { MediaViewerDataSource } from '@atlaskit/media-viewer';
import { MediaCardError } from './errors';

export type CardStatus =
  | 'uploading'
  | 'loading'
  | 'processing'
  | 'loading-preview'
  | 'complete'
  | 'error'
  | 'failed-processing';

export type FilePreviewStatus = {
  hasFilesize: boolean;
  isPreviewable: boolean;
  hasPreview: boolean;
  isSupportedByBrowser: boolean;
};

export type FileStateFlags = {
  wasStatusProcessing: boolean;
  wasStatusUploading: boolean;
};

export type CardAppearance = 'auto' | 'image' | 'square' | 'horizontal';

export declare type CardDimensionValue = number | string;

export type CardPreviewSource =
  | 'local'
  | 'remote'
  | 'ssr-server'
  | 'ssr-client'
  | 'ssr-data'
  | 'cache-local'
  | 'cache-remote'
  | 'cache-ssr-client'
  | 'cache-ssr-server'
  | 'external';

export interface CardPreview {
  dataURI: string;
  orientation?: number;
  dimensions?: CardDimensions;
  source: CardPreviewSource;
}

export enum MediaCardCursor {
  Action = 'pointer',
  NotReady = 'wait',
}

export interface CardDimensions {
  width?: CardDimensionValue;
  height?: CardDimensionValue;
}

export type TitleBoxIcon = 'LockFilledIcon';

export interface CardEvent {
  event: MouseEvent<HTMLElement>;
  mediaItemDetails?: FileDetails;
}

export interface SharedCardProps {
  // only relevant to file card with image appearance
  readonly disableOverlay?: boolean;
  readonly resizeMode?: ImageResizeMode;
  readonly featureFlags?: MediaFeatureFlags;
  readonly appearance?: CardAppearance;
  readonly dimensions?: CardDimensions;
  readonly originalDimensions?: NumericalCardDimensions;
  readonly actions?: Array<CardAction>;
  readonly selectable?: boolean;
  readonly selected?: boolean;
  readonly alt?: string;
  readonly testId?: string;
  readonly titleBoxBgColor?: string;
  readonly titleBoxIcon?: TitleBoxIcon;
}

export interface CardOnClickCallback {
  (result: CardEvent, analyticsEvent?: UIAnalyticsEvent): void;
}

export interface CardEventProps {
  readonly onClick?: CardOnClickCallback;
  readonly onMouseEnter?: (result: CardEvent) => void;
  /** Callback function to be called when video enters and exit fullscreen.
   * `fullscreen = true` indicates video enters fullscreen
   * `fullscreen = false` indicates video exits fullscreen
   */
  readonly onFullscreenChange?: (fullscreen: boolean) => void;
}

export interface CardProps extends SharedCardProps, CardEventProps {
  readonly mediaClient: MediaClient;
  readonly identifier: Identifier;
  readonly isLazy?: boolean;
  readonly useInlinePlayer?: boolean;
  readonly shouldOpenMediaViewer?: boolean;
  readonly mediaViewerDataSource?: MediaViewerDataSource;
  readonly contextId?: string;
  readonly shouldEnableDownloadButton?: boolean;
  readonly ssr?: SSR;
}

export interface CardState {
  status: CardStatus;
  isCardVisible: boolean;
  shouldAutoplay?: boolean;
  isPlayingFile: boolean;
  mediaViewerSelectedItem?: Identifier;
  fileState?: FileState;
  progress?: number;
  cardPreview?: CardPreview;
  error?: MediaCardError;
  cardRef: HTMLDivElement | null;
  isBannedLocalPreview: boolean;
  previewDidRender: boolean;
}
