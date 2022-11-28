import React, { FC } from 'react';
import { FormattedMessage } from 'react-intl-next';
import { EmbedCardUnresolvedView } from './UnresolvedView';
import { UnauthorisedImage } from '../constants';
import { ExpandedFrame } from '../components/ExpandedFrame';
import { ImageIcon } from '../components/ImageIcon';
import { ContextViewModel } from '../types';
import { messages } from '../../../messages';
import { CONTENT_URL_SECURITY_AND_PERMISSIONS } from '../../../constants';

export interface EmbedCardUnauthorisedViewProps {
  context?: ContextViewModel;
  link: string;
  isSelected?: boolean;
  testId?: string;
  onAuthorise?: () => void;
  inheritDimensions?: boolean;
  onClick?: (evt: React.MouseEvent) => void;
}

export const EmbedCardUnauthorisedView: FC<EmbedCardUnauthorisedViewProps> = ({
  link,
  context,
  isSelected,
  testId = 'embed-card-unauthorized-view',
  onAuthorise,
  inheritDimensions,
  onClick,
}) => {
  const icon = context && context.icon && (
    <ImageIcon
      src={typeof context.icon === 'string' ? context.icon : undefined}
    />
  );

  return (
    <ExpandedFrame
      href={link}
      icon={icon}
      text={context && context.text}
      isVisible={true}
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
        button={{
          appearance: 'primary',
          text: 'connect_unauthorised_account_action',
          testId: 'connect-account',
        }}
        onClick={onAuthorise}
        testId={testId}
      >
        <FormattedMessage
          {...messages.connect_unauthorised_account_description}
          values={{ context: context?.text }}
        />{' '}
        <a
          href={CONTENT_URL_SECURITY_AND_PERMISSIONS}
          target="_blank"
          data-testid={`${testId}-learn-more`}
        >
          <FormattedMessage
            {...messages.learn_more_about_smart_links_security}
          />
        </a>
      </EmbedCardUnresolvedView>
    </ExpandedFrame>
  );
};
