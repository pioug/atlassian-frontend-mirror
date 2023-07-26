import React, { FC, useCallback } from 'react';
import { EmbedCardUnresolvedView } from './UnresolvedView';
import { UnauthorisedImage } from '../constants';
import { ExpandedFrame } from '../components/ExpandedFrame';
import { ImageIcon } from '../components/ImageIcon';
import { ContextViewModel } from '../types';
import UnauthorisedViewContent from '../../common/UnauthorisedViewContent';
import { AnalyticsFacade } from '../../../state/analytics';

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
      <EmbedCardUnresolvedView
        image={context?.image ?? UnauthorisedImage}
        title="connect_link_account_card_name"
        description="connect_unauthorised_account_description"
        context={context && context.text}
        button={
          onAuthorise
            ? {
                appearance: 'primary',
                text: 'connect_unauthorised_account_action',
                testId: 'connect-account',
              }
            : undefined
        }
        onClick={onAuthorise ? handleOnAuthorizeClick : undefined}
        testId={testId}
      >
        <UnauthorisedViewContent
          analytics={analytics}
          providerName={context?.text}
          testId={testId}
        />
      </EmbedCardUnresolvedView>
    </ExpandedFrame>
  );
};
