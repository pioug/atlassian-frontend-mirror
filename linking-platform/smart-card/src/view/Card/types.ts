import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { CardAppearance, CardPlatform } from '@atlaskit/linking-common';
import { AnalyticsFacade } from '../../state/analytics';
import { FlexibleUiOptions } from '../FlexibleCard/types';
import { InlinePreloaderStyle, OnErrorCallback } from '../types';
import { FrameStyle } from '../EmbedCard/types';

export type { CardAppearance, CardPlatform };
export type CardInnerAppearance =
  | CardAppearance
  | 'embedPreview'
  | 'flexible'
  | 'hoverCardPreview';

export type EmbedIframeUrlType = 'href' | 'interactiveHref';

export type OnResolveCallback = (data: {
  url?: string;
  title?: string;
  aspectRatio?: number;
}) => void;

export interface CardProps extends WithAnalyticsEventsProps {
  appearance: CardAppearance;
  id?: string;
  platform?: CardPlatform;
  isSelected?: boolean;
  /**
   * @deprecated please use 'frameStyle' prop instead. Current usages will be converted in the following manner:
   * isFrameVisible: true => frameStyle: 'show', isFrameVisible: false => frameStyle: 'showOnHover'
   */
  isFrameVisible?: boolean;
  /** A prop that determines the style of a frame: whether to show it, hide it or only show it when a user hovers over embed */
  frameStyle?: FrameStyle;
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  importer?: (target: any) => void;
  container?: HTMLElement;
  data?: any;
  url?: string;
  testId?: string;
  /**
   * Show client actions, e.g. preview, download, etc.
   * These actions do not change the link resource.
   */
  showActions?: boolean;
  /**
   * Show server actions that change the link resource, e.g. update status.
   */
  showServerActions?: boolean;
  onResolve?: OnResolveCallback;
  onError?: OnErrorCallback;
  /** This props determines if dimensions of an embed card are to be inherited from the parent.
   * The parent container needs to override a style '.loader-wrapper' and set the desirable height there. (for instance, 'height: 100%')
   */
  inheritDimensions?: boolean;
  embedIframeRef?: React.Ref<HTMLIFrameElement>;
  embedIframeUrlType?: EmbedIframeUrlType;
  inlinePreloaderStyle?: InlinePreloaderStyle;
  ui?: FlexibleUiOptions;
  children?: React.ReactNode;
  showHoverPreview?: boolean;
  showAuthTooltip?: boolean;
  /**
   * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-2681 Internal documentation for deprecation (no external access)}
   * The use of `useSmartLinkAnalytics` external use in conjunction with `analyticsEvents` prop is deprecated and may be removed in future releases.
   * Please avoid using this prop.
   */
  analyticsEvents?: AnalyticsFacade;
  placeholder?: string;
}
