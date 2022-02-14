import { EventHandler, MouseEvent, KeyboardEvent } from 'react';
import { CardAppearance, CardPlatform, OnResolveCallback } from '../Card/types';
import { AnalyticsHandler } from '../../utils/types';
import { FlexibleUiOptions } from '../FlexibleCard/types';
import { InlinePreloaderStyle } from '../types';

export type CardWithUrlContentProps = {
  id: string;
  url: string;
  appearance: CardAppearance;
  platform?: CardPlatform;
  onClick?: EventHandler<MouseEvent | KeyboardEvent>;
  isSelected?: boolean;
  isFrameVisible?: boolean;
  container?: HTMLElement;
  dispatchAnalytics: AnalyticsHandler;
  testId?: string;
  onResolve?: OnResolveCallback;
  showActions?: boolean;
  inheritDimensions?: boolean;
  embedIframeRef?: React.Ref<HTMLIFrameElement>;
  inlinePreloaderStyle?: InlinePreloaderStyle;
  ui?: FlexibleUiOptions;
  children?: React.ReactNode;
};
