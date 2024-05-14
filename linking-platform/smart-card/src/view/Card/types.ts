import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { CardAppearance, CardState } from '@atlaskit/linking-common';

import { CardPlatform } from '@atlaskit/link-extractors';

import { AnalyticsFacade } from '../../state/analytics';
import { FlexibleUiOptions } from '../FlexibleCard/types';
import { ErrorCardType, InlinePreloaderStyle, OnErrorCallback } from '../types';
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

export enum CardAction {
  DownloadAction = 'DownloadAction',
  PreviewAction = 'PreviewAction',
  ViewAction = 'ViewAction',
  ChangeStatusAction = 'ChangeStatusAction',
  FollowAction = 'FollowAction',
  CopyLinkAction = 'CopyLinkAction',
  AISummaryAction = 'AISummaryAction',
}

export type CardActionOptions =
  | {
      hide: true;
    }
  | { hide: false; exclude?: Array<CardAction> };

export interface CardProps extends WithAnalyticsEventsProps {
  appearance: CardAppearance;
  id?: string;
  platform?: CardPlatform;
  isSelected?: boolean;
  /** A flag that determines whether a card is in a hover state in edit mode. Currently used for inline links only */
  isHovered?: boolean;
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
  /**
   * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-3226 Internal documentation for deprecation (no external access)}
   * Likely here for legacy reason where editor would store data in ADF instead of resolving it everytime
   * https://product-fabric.atlassian.net/browse/EDM-6813
   */
  data?: any;
  url?: string;
  testId?: string;
  /**
   * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-6348 Internal documentation for deprecation (no external access)}
   *
   * Prefer `actionOptions` prop. Show client actions, e.g. preview, download, etc.
   * These actions do not change the link resource.
   */
  showActions?: boolean;
  /**
   * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-6348 Internal documentation for deprecation (no external access)}
   *
   * Prefer `actionOptions` prop. Show server actions that change the link resource, e.g. update status.
   */
  showServerActions?: boolean;
  actionOptions?: CardActionOptions;
  onResolve?: OnResolveCallback;
  /**
   * A callback function currently invoked in two cases
   * 1. When the {@link CardState.status} is one of {@link ErrorCardType}. "err" property in argument will be undefined in this case
   *    This does not mean that smart card failed to render.
   * 2. When there is any unhandled error inside smart card while rendering, resulting in failure to render smart card succesfully.
   *    "err" property in argument will be provided in this case.
   *    Presence of an err property indicates that the client should either render their own fallback
   *    or provide a fallbackComponent prop which will be rendered instead smart card component.
   *    If fallbackComponent is not provided, smart card will render null
   */
  onError?: OnErrorCallback;
  /**
   * A component that will be rendered when smart card fails to render
   * because of uncaught errors
   */
  fallbackComponent?: React.ComponentType;
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
  /**
   * When enabled the legacy block card is always used, even if the enableFlexibleBlockCard flag is set to true.
   * Usage is strongly discouraged. This should only be used if there is a specific reason you're
   * unable to use the new flexible block cards.
   */
  useLegacyBlockCard?: boolean;
}
