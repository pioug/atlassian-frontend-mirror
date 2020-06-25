import React, { FC } from 'react';
import { EmbedCardUnresolvedView } from './UnresolvedView';
import { NotFoundImage } from '../../BlockCard/utils/constants';
import { ExpandedFrame } from '../components/ExpandedFrame';
import { ImageIcon } from '../components/ImageIcon';
import { ContextViewModel } from '../../types';

export interface EmbedCardNotFoundViewProps {
  context?: ContextViewModel;
  link: string;
  isSelected?: boolean;
  testId?: string;
  inheritDimensions?: boolean;
  onClick?: (evt: React.MouseEvent) => void;
}

export const EmbedCardNotFoundView: FC<EmbedCardNotFoundViewProps> = ({
  link,
  context,
  isSelected,
  inheritDimensions,
  testId = 'embed-card-not-found-view',
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
        image={NotFoundImage}
        title="not_found_title"
        description="not_found_description"
        context={context && context.text}
        testId={testId}
      />
    </ExpandedFrame>
  );
};
