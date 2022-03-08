/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/core';
import Spinner from '@atlaskit/spinner';

import { Title } from '../../../elements';
import { TitleBlockProps } from '../types';
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

const TitleBlockResolvingView: React.FC<TitleBlockProps> = ({
  maxLines,
  retry,
  position,
  testId,
  theme,
  text,
  ...blockProps
}) => {
  const { size = SmartLinkSize.Medium } = blockProps;
  const overrideText = !!text ? { text } : {};
  return (
    <Block {...blockProps} testId={`${testId}-resolving-view`}>
      <Spinner
        size={getSpinnerSize(size)}
        testId={`${testId}-resolving-spinner`}
      />

      <Title {...overrideText} maxLines={maxLines} theme={theme} />
    </Block>
  );
};

export default TitleBlockResolvingView;
