import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { ElementItem } from '../FlexibleCard/components/blocks/types';
import { AnalyticsFacade } from '../../state/analytics';
import { LinkAction } from '../../state/hooks-external/useSmartLinkActions';
import { CardState } from '@atlaskit/linking-common';
import { CardProviderRenderers } from '@atlaskit/link-provider';
import { AnalyticsHandler } from '../../utils/types';
import { ReactElement } from 'react';

export interface HoverCardProps extends WithAnalyticsEventsProps {
  id?: string;
  url: string;
  children: ReactElement;
}

export interface HoverCardComponentProps extends HoverCardProps {
  analyticsHandler: AnalyticsHandler;
  analytics: AnalyticsFacade;
}

export type PreviewDisplay = 'card' | 'embed';
export type PreviewInvokeMethod = 'keyboard' | 'mouse_hover' | 'mouse_click';

export interface MetadataOptions {
  primary: Array<ElementItem>;
  secondary: Array<ElementItem>;
  subtitle: Array<ElementItem>;
}

export type HoverCardContentProps = {
  analytics: AnalyticsFacade;
  cardActions?: LinkAction[];
  cardState: CardState;
  renderers?: CardProviderRenderers;
  onActionClick: (actionId: string) => void;
  onResolve: () => void;
  url: string;
};
