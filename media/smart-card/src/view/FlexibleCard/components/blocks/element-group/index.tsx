/** @jsx jsx */
import React from 'react';

import { css, jsx, SerializedStyles } from '@emotion/core';

import { ElementGroupProps } from './types';
import {
  SmartLinkAlignment,
  SmartLinkDirection,
  SmartLinkSize,
  SmartLinkWidth,
} from '../../../../../constants';
import { getBaseStyles, renderChildren } from '../utils';

const getFlexJustifyContent = (align?: SmartLinkAlignment) => {
  switch (align) {
    case SmartLinkAlignment.Right:
      return 'flex-end';
    case SmartLinkAlignment.Left:
    default:
      return 'flex-start';
  }
};

export const getElementGroupStyles = (
  direction: SmartLinkDirection,
  size: SmartLinkSize,
  align: SmartLinkAlignment,
  width: SmartLinkWidth,
): SerializedStyles => css`
  ${getBaseStyles(direction, size)}
  justify-content: ${getFlexJustifyContent(align)};
  min-width: 10%;
  ${width === SmartLinkWidth.Flexible ? `flex: 1 3;` : ''}
`;

const ElementGroup: React.FC<ElementGroupProps> = ({
  align = SmartLinkAlignment.Left,
  children,
  direction = SmartLinkDirection.Horizontal,
  size = SmartLinkSize.Medium,
  testId = 'smart-element-group',
  width = SmartLinkWidth.FitToContent,
}) => (
  <div
    css={getElementGroupStyles(direction, size, align, width)}
    data-smart-element-group
    data-testid={testId}
  >
    {renderChildren(children, size)}
  </div>
);

export default ElementGroup;
