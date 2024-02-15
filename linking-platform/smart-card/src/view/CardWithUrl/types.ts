import { EventHandler, MouseEvent, KeyboardEvent } from 'react';
import type {
  CardAppearance,
  CardPlatform,
  EmbedIframeUrlType,
  OnResolveCallback,
  CardActionOptions,
} from '../Card/types';
import { AnalyticsHandler } from '../../utils/types';
import { FlexibleUiOptions } from '../FlexibleCard/types';
import { InlinePreloaderStyle, OnErrorCallback } from '../types';
import { AnalyticsFacade } from '../../state/analytics';
import { FrameStyle } from '../EmbedCard/types';

export type CardWithUrlContentProps = {
  id: string;
  url: string;
  appearance: CardAppearance;
  platform?: CardPlatform;
  onClick?: EventHandler<MouseEvent | KeyboardEvent>;
  isSelected?: boolean;
  isHovered?: boolean;
  isFrameVisible?: boolean;
  frameStyle?: FrameStyle;
  container?: HTMLElement;
  /**
   * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-2681 Internal documentation for deprecation (no external access)}
   * Avoid prop drilling analytics handlers
   */
  dispatchAnalytics?: AnalyticsHandler;
  testId?: string;
  onResolve?: OnResolveCallback;
  onError?: OnErrorCallback;
  /**
   * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-6348 Internal documentation for deprecation (no external access)}
   *
   * Prefer 'actionOptions' prop.
   */
  showActions?: boolean;
  /**
   * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-6348 Internal documentation for deprecation (no external access)}
   *
   * Prefer 'actionOptions' prop.
   */
  showServerActions?: boolean;
  actionOptions?: CardActionOptions;
  inheritDimensions?: boolean;
  embedIframeRef?: React.Ref<HTMLIFrameElement>;
  embedIframeUrlType?: EmbedIframeUrlType;
  inlinePreloaderStyle?: InlinePreloaderStyle;
  ui?: FlexibleUiOptions;
  children?: React.ReactNode;
  showHoverPreview?: boolean;
  showAuthTooltip?: boolean;
  analyticsEvents?: AnalyticsFacade;
  placeholder?: string;
  useLegacyBlockCard?: boolean;
};
