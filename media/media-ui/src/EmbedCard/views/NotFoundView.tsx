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
}

export const EmbedCardNotFoundView: FC<EmbedCardNotFoundViewProps> = ({
  link,
  context,
  isSelected,
  testId = 'embed-not-found-view',
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
        testId={testId}
        image={NotFoundImage}
        title="not_found_title"
        description="not_found_description"
        context={context && context.text}
      />
    </ExpandedFrame>
  );
};
