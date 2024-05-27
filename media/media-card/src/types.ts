/**
 * Entry Point: @atlaskit/media-card/types
 * tsconfig.entry-points.json
 */
import { type MouseEvent } from 'react';
import {
  type FileDetails,
  type MediaClient,
  type Identifier,
  type ImageResizeMode,
  type FileState,
} from '@atlaskit/media-client';
import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  type MediaFeatureFlags,
  type NumericalCardDimensions,
  type SSR,
} from '@atlaskit/media-common';
import { type CardAction } from './card/actions';
import { type MediaCardError } from './errors';

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

export interface InlineCardEvent {
  event: MouseEvent<HTMLElement> | React.KeyboardEvent;
  mediaItemDetails?: FileDetails;
}

export interface SharedCardProps {
  // Overlay the media file.
  readonly disableOverlay?: boolean;
  // Resize the media to 'crop' | 'fit' | 'full-fit' | 'stretchy-fit'.
  readonly resizeMode?: ImageResizeMode;
  // Includes media features like caption, timestamp etc.
  readonly featureFlags?: MediaFeatureFlags;
  // Sets meida card appearance
  readonly appearance?: CardAppearance;
  // Custom media card dimension like width and height.
  readonly dimensions?: CardDimensions;
  // Original media card dimension like width and height.
  readonly originalDimensions?: NumericalCardDimensions;
  // Array of additional media card actions.
  readonly actions?: Array<CardAction>;
  // Enable media card selectable.
  readonly selectable?: boolean;
  // Renders media card as selected, if selected is true.
  readonly selected?: boolean;
  // Alternate text for an media card.
  readonly alt?: string;
  // ID for testing the media card.
  readonly testId?: string;
  // Sets the title box background color.
  readonly titleBoxBgColor?: string;
  // Sets the title box icon.
  readonly titleBoxIcon?: TitleBoxIcon;
}

export interface CardOnClickCallback {
  (result: CardEvent, analyticsEvent?: UIAnalyticsEvent): void;
}

export interface InlineCardOnClickCallback {
  (result: InlineCardEvent, analyticsEvent?: UIAnalyticsEvent): void;
}

export interface CardEventProps {
  // Callback function to be called when user clicks on media card.
  readonly onClick?: CardOnClickCallback;
  // Callback function to be called when the mouse pointer is moved onto an media card.
  readonly onMouseEnter?: (result: CardEvent) => void;
  /** Callback function to be called when video enters and exit fullscreen.
   * `fullscreen = true` indicates video enters fullscreen
   * `fullscreen = false` indicates video exits fullscreen
   */
  readonly onFullscreenChange?: (fullscreen: boolean) => void;

  // Callback function to be called when video controls panel rendered.
  readonly videoControlsWrapperRef?: React.Ref<HTMLDivElement>;
}

export interface CardProps extends SharedCardProps, CardEventProps {
  // Instance of MediaClient.
  readonly mediaClient: MediaClient;
  // Instance of file identifier.
  readonly identifier: Identifier;
  // Lazy loads the media file.
  readonly isLazy?: boolean;
  // Uses the inline player for media file.
  readonly useInlinePlayer?: boolean;
  // Uses media MediaViewer to preview the media file.
  readonly shouldOpenMediaViewer?: boolean;
  // Media file list to display in Media Viewer.
  readonly mediaViewerItems?: Identifier[];
  // Retrieve auth based on a given context.
  readonly contextId?: string;
  // Enables the download button for media file.
  readonly shouldEnableDownloadButton?: boolean;
  // Server-Side-Rendering modes are "server" and "client"
  readonly ssr?: SSR;
  // Disable tooltip for the card
  readonly shouldHideTooltip?: boolean;
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
  wasResolvedUpfrontPreview: boolean;
  shouldUpdateStateForIdentifier?: boolean;
}
