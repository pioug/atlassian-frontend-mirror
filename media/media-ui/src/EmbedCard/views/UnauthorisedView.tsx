import React, { FC } from 'react';
import { EmbedCardUnresolvedView } from './UnresolvedView';
import { CelebrationImage } from '../../BlockCard/utils/constants';
import { ExpandedFrame } from '../components/ExpandedFrame';
import { ImageIcon } from '../components/ImageIcon';
import { ContextViewModel } from '../../types';

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
    >
      <EmbedCardUnresolvedView
        image={CelebrationImage}
        title="connect_link_account_card_name"
        description="connect_link_account_card_description"
        context={context && context.text}
        button={{
          appearance: 'primary',
          text: 'connect_link_account_card',
          testId: 'connect-account',
        }}
        onClick={onAuthorise}
        testId={testId}
      />
    </ExpandedFrame>
  );
};
