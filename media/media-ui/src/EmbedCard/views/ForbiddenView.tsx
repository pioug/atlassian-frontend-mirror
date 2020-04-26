import React, { FC } from 'react';
import { EmbedCardUnresolvedView } from './UnresolvedView';
import { LockImage } from '../../BlockCard/utils/constants';
import { ExpandedFrame } from '../components/ExpandedFrame';
import { ImageIcon } from '../components/ImageIcon';
import { ContextViewModel } from '../../types';

export interface EmbedCardForbiddenViewProps {
  context?: ContextViewModel;
  link: string;
  isSelected?: boolean;
  testId?: string;
  onAuthorise?: () => void;
}

export const EmbedCardForbiddenView: FC<EmbedCardForbiddenViewProps> = ({
  link,
  context,
  isSelected,
  testId = 'embed-forbidden-view',
  onAuthorise,
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
    >
      <EmbedCardUnresolvedView
        image={LockImage}
        title="invalid_permissions"
        description="invalid_permissions_description"
        context={context && context.text}
        testId={testId}
        button={{
          appearance: 'default',
          text: 'try_another_account',
        }}
        onClick={onAuthorise}
      />
    </ExpandedFrame>
  );
};
