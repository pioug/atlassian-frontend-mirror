import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { ElementItem } from '../FlexibleCard/components/blocks/types';
import { AnalyticsFacade } from '../../state/analytics';
import { LinkAction } from '../../state/hooks-external/useSmartLinkActions';
import { CardState } from '@atlaskit/linking-common';
import { CardProviderRenderers } from '@atlaskit/link-provider';
import { AnalyticsHandler } from '../../utils/types';
import { ReactElement } from 'react';
import { TitleBlockProps } from '../FlexibleCard/components/blocks/title-block/types';
import { FlexibleCardProps } from '../FlexibleCard/types';
import { JsonLd } from 'json-ld-types';

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
  id?: string;
  analytics: AnalyticsFacade;
  cardActions?: LinkAction[];
  cardState: CardState;
  renderers?: CardProviderRenderers;
  onActionClick: (actionId: string) => void;
  onResolve: () => void;
  url: string;
};

export type HoverCardLoadingViewProps = {
  flexibleCardProps: FlexibleCardProps;
  titleBlockProps: TitleBlockProps;
};

export type SnippetOrPreviewProps = {
  data: JsonLd.Data.BaseData;
  snippetHeight: number;
};
