/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/core';
import Spinner from '@atlaskit/spinner';

import { TitleBlockProps } from '../types';
import { SmartLinkSize } from '../../../../../../constants';
import { BaseTitleBlockComponent } from '../utils';

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

const TitleBlockResolvingView: React.FC<TitleBlockProps> = (props) => {
  const { size = SmartLinkSize.Medium, testId } = props;
  const spinnerIcon = (
    <Spinner
      size={getSpinnerSize(size)}
      testId={`${testId}-resolving-spinner`}
    />
  );
  return (
    <BaseTitleBlockComponent
      {...props}
      blockIcon={spinnerIcon}
      blockTestIdPostfix="resolving-view"
    />
  );
};

export default TitleBlockResolvingView;
