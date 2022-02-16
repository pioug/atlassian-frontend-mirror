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

const getAlignmentStyles = (align?: SmartLinkAlignment) => {
  switch (align) {
    case SmartLinkAlignment.Right:
      return css`
        justify-content: flex-end;
        text-align: right;
      `;
    case SmartLinkAlignment.Left:
    default:
      return css`
        justify-content: flex-start;
        text-align: left;
      `;
  }
};

export const getElementGroupStyles = (
  direction: SmartLinkDirection,
  size: SmartLinkSize,
  align: SmartLinkAlignment,
  width: SmartLinkWidth,
): SerializedStyles => css`
  ${getBaseStyles(direction, size)}
  ${getAlignmentStyles(align)}
  min-width: 10%;
  ${width === SmartLinkWidth.Flexible ? `flex: 1 3;` : ''}
`;

const ElementGroup: React.FC<ElementGroupProps> = ({
  align = SmartLinkAlignment.Left,
  children,
  css,
  direction = SmartLinkDirection.Horizontal,
  size = SmartLinkSize.Medium,
  testId = 'smart-element-group',
  width = SmartLinkWidth.FitToContent,
}) => (
  <div
    css={[getElementGroupStyles(direction, size, align, width), css]}
    data-smart-element-group
    data-testid={testId}
  >
    {renderChildren(children, size)}
  </div>
);

export default ElementGroup;
