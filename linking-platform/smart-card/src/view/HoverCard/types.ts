import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { ElementItem } from '../FlexibleCard/components/blocks/types';
import { AnalyticsFacade } from '../../state/analytics';
import { LinkAction } from '../../state/hooks-external/useSmartLinkActions';
import { CardState } from '@atlaskit/linking-common';
import { AnalyticsHandler } from '../../utils/types';
import { CardProviderRenderers } from '@atlaskit/link-provider';
import { MouseEventHandler, ReactElement } from 'react';
import { JsonLd } from 'json-ld-types';
import type { CardActionOptions } from '../Card/types';

export interface HoverCardProps extends WithAnalyticsEventsProps {
  /**
   * Unique ID for a hover card. Used for analytics.
   */
  id?: string;

  /**
   * Hover card will display data from this url.
   */
  url: string;

  /**
   * React children component over which the hover card can be triggered.
   */
  children: ReactElement;

  /**
   * Function to be called when user is authorized to view a link.
   * @deprecated See EDM-7411
   */
  onAuthorize?: () => void;

  /**
   * Determines if the hover card is allowed to open. If changed from true to false while the
   * hover card is open, the hover card will be closed.
   */
  canOpen?: boolean;

  /**
   * Determines if the hover card should close when the children passed in are
   * clicked.
   */
  closeOnChildClick?: boolean;

  /**
   * Determines if the hover card should display the "Open preview" button.
   */
  hidePreviewButton?: boolean;

  /**
   * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-6348 Internal documentation for deprecation (no external access)}
   *
   * Prefer 'actionOptions' prop. Determines whether to show available server actions.
   */
  showServerActions?: boolean;

  /**
   * Configure visibility of server and client actions
   */
  actionOptions?: CardActionOptions;

  /**
   * Z-index that the hover card should be displayed in.
   * This is passed to the portal component.
   */
  zIndex?: number;
}

/**
 * An internal props that internal smart-card components can use to configure
 * hover preview behaviour. The prop contains here are suitable for unsafe
 * or experiment props that will not be or are yet ready to be available on
 * standalone hover card.
 */
export interface HoverCardInternalProps {
  /**
   * Allow click event to bubble up from hover preview trigger component.
   * @see EDM-7187 for further details
   */
  allowEventPropagation?: boolean;
  /**
   * Suspend hover card UI delays (fade-in, fade-out) for VR testing purposes.
   */
  noFadeDelay?: boolean;
}

export interface HoverCardComponentProps
  extends HoverCardProps,
    HoverCardInternalProps {
  analyticsHandler?: AnalyticsHandler;
  analytics?: AnalyticsFacade;
  canOpen?: boolean;
  closeOnChildClick?: boolean;
}

export type PreviewDisplay = 'card' | 'embed';
export type PreviewInvokeMethod = 'keyboard' | 'mouse_hover' | 'mouse_click';

export interface MetadataOptions {
  primary: Array<ElementItem>;
  secondary: Array<ElementItem>;
  subtitle: Array<ElementItem>;
}

export type HoverCardContentProps = {
  id?: string;
  analytics?: AnalyticsFacade;
  cardActions?: LinkAction[];
  cardState: CardState;
  renderers?: CardProviderRenderers;
  onActionClick: (actionId: string) => void;
  onResolve: () => void;
  url: string;
  onMouseEnter?: MouseEventHandler;
  onMouseLeave?: MouseEventHandler;
  actionOptions?: CardActionOptions;
};

export type ContentContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  isAIEnabled?: boolean;
  testId?: string;
  url: string;
};

export type ImagePreviewProps = {
  data: JsonLd.Data.BaseData;
  fallbackElementHeight: number;
};
