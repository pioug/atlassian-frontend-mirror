import React, { FC, useCallback, useMemo } from 'react';
import { di } from 'react-magnetic-di';

import { EmbedCardUnresolvedView } from './UnresolvedView';
import { ExpandedFrame } from '../components/ExpandedFrame';
import { ImageIcon } from '../components/ImageIcon';
import { ContextViewModel } from '../types';
import UnauthorisedViewContent from '../../common/UnauthorisedViewContent';
import { AnalyticsFacade } from '../../../state/analytics';
import { getUnresolvedEmbedCardImage } from '../utils';

export interface EmbedCardUnauthorisedViewProps {
  analytics: AnalyticsFacade;
  context?: ContextViewModel;
  link: string;
  isSelected?: boolean;
  testId?: string;
  onAuthorise?: () => void;
  inheritDimensions?: boolean;
  onClick?: (evt: React.MouseEvent) => void;
  extensionKey?: string;
}

export const EmbedCardUnauthorisedView: FC<EmbedCardUnauthorisedViewProps> = ({
  analytics,
  link,
  context,
  isSelected,
  testId = 'embed-card-unauthorized-view',
  onAuthorise,
  inheritDimensions,
  onClick,
  extensionKey,
}) => {
  di(getUnresolvedEmbedCardImage);

  const icon = context && context.icon && (
    <ImageIcon
      src={typeof context.icon === 'string' ? context.icon : undefined}
    />
  );

  const handleOnAuthorizeClick = useCallback(() => {
    if (onAuthorise) {
      analytics.track.appAccountAuthStarted({
        extensionKey: extensionKey,
      });

      onAuthorise();
    }
  }, [onAuthorise, analytics.track, extensionKey]);

  const view = useMemo(() => {
    if (onAuthorise) {
      return (
        <EmbedCardUnresolvedView
          button={{
            appearance: 'primary',
            text: 'connect_unauthorised_account_action',
            testId: 'connect-account',
          }}
          context={context && context.text}
          description="connect_unauthorised_account_description"
          image={context?.image ?? getUnresolvedEmbedCardImage('unauthorized')}
          onClick={handleOnAuthorizeClick}
          testId={testId}
          title="connect_link_account_card_name"
        >
          <UnauthorisedViewContent
            analytics={analytics}
            providerName={context?.text}
            testId={testId}
          />
        </EmbedCardUnresolvedView>
      );
    }

    return (
      <EmbedCardUnresolvedView
        description={
          context?.text
            ? 'unauthorised_account_description'
            : 'unauthorised_account_description_no_provider'
        }
        image={context?.image ?? getUnresolvedEmbedCardImage('forbidden')}
        context={context?.text}
        testId={testId}
        title={
          context?.text
            ? 'unauthorised_account_name'
            : 'unauthorised_account_name_no_provider'
        }
      />
    );
  }, [analytics, context, handleOnAuthorizeClick, onAuthorise, testId]);

  return (
    <ExpandedFrame
      href={link}
      icon={icon}
      text={context && context.text}
      frameStyle="show"
      isSelected={isSelected}
      inheritDimensions={inheritDimensions}
      onClick={onClick}
      testId={testId}
      allowScrollBar={true}
    >
      {view}
    </ExpandedFrame>
  );
};
