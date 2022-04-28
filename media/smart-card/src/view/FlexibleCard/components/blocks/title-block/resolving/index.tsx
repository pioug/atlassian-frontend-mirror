/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/core';
import Spinner from '@atlaskit/spinner';

import { TitleBlockViewProps } from '../types';
import Block from '../../block';
import { SmartLinkSize } from '../../../../../../constants';

const getSpinnerSize = (size: SmartLinkSize) => {
  // Spinner sizes should be equivalent or smaller than Icon size
  // to avoid the jumping.
  switch (size) {
    case SmartLinkSize.XLarge:
      return 28;
    case SmartLinkSize.Large:
      return 24;
    case SmartLinkSize.Medium:
      return 16;
    case SmartLinkSize.Small:
    default:
      return 12;
  }
};

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
  ...blockProps
}) => {
  const { size = SmartLinkSize.Medium } = blockProps;
  return (
    <Block {...blockProps} testId={`${testId}-resolving-view`}>
      <Spinner
        size={getSpinnerSize(size)}
        testId={`${testId}-resolving-spinner`}
      />
      {title}
      {actionGroup}
    </Block>
  );
};

export default TitleBlockResolvingView;
