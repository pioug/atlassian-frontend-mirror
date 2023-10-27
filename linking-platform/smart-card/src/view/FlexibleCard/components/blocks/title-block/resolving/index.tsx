/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import { TitleBlockViewProps } from '../types';
import Block from '../../block';
import { SmartLinkSize } from '../../../../../../constants';
import LoadingSkeleton from '../../../common/loading-skeleton';
import { getIconSizeStyles, getIconWidth } from '../../../utils';

/**
 * This represents a TitleBlock for a Smart Link that is currently waiting
 * for a request to finish.
 * This should render when a Smart Link has sent a request.
 * @see TitleBlock
 */
const TitleBlockResolvingView: React.FC<TitleBlockViewProps> = ({
  actionGroup,
  testId,
  title,
  hideIcon,
  ...blockProps
}) => {
  const { size = SmartLinkSize.Medium } = blockProps;
  const iconWidth = getIconWidth(size);
  const iconStyles = getIconSizeStyles(iconWidth);

  return (
    <Block {...blockProps} testId={`${testId}-resolving-view`}>
      {!hideIcon && (
        <span css={iconStyles} data-testid={`${testId}-icon`}>
          <LoadingSkeleton testId={`${testId}-icon-loading`} />
        </span>
      )}
      {title}
      {actionGroup}
    </Block>
  );
};

export default TitleBlockResolvingView;
