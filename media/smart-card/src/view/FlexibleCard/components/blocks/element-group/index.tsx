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
import { getBaseStyles, getGapSize, renderChildren } from '../utils';
import { getMaxLineHeight, getTruncateStyles } from '../../utils';

const getAlignmentStyles = (align?: SmartLinkAlignment) => {
  switch (align) {
    case SmartLinkAlignment.Right:
      return css`
        -webkit-box-align: end;
        -ms-flex-align: end;
        justify-content: flex-end;
        text-align: right;
      `;
    case SmartLinkAlignment.Left:
    default:
      return css`
        -webkit-box-align: start;
        -ms-flex-align: start;
        justify-content: flex-start;
        text-align: left;
      `;
  }
};

const getGapStyles = (
  size: SmartLinkSize,
  align: SmartLinkAlignment,
): SerializedStyles => {
  const gap = getGapSize(size);
  if (align === SmartLinkAlignment.Right) {
    return css`
      > span {
        margin-left: ${gap}rem;
        &:first-child {
          margin-left: initial;
        }
      }
    `;
  }

  return css`
    > span {
      margin-right: ${gap}rem;
      &:last-child {
        margin-right: initial;
      }
    }
  `;
};

const getHorizontalDirectionStyles = (
  size: SmartLinkSize,
  align: SmartLinkAlignment,
) => {
  const lineHeight = getMaxLineHeight(size);
  return css`
    display: block;
    vertical-align: middle;
    ${getTruncateStyles(1, lineHeight + 'rem')}

    > span, > div {
      vertical-align: middle;

      &[data-smart-element-date-time],
      &[data-smart-element-text] {
        // Show all/wrapped/truncated
        display: inline;
      }
    }

    ${getGapStyles(size, align)}
  `;
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
  ${direction === SmartLinkDirection.Horizontal
    ? getHorizontalDirectionStyles(size, align)
    : ''}
`;

/**
 * Creates a group of Action components. Accepts an array of Actions, in addition to some styling
 * preferences.
 * @internal
 * @param {ActionGroupProps} ActionGroupProps
 * @see Action
 */
const ElementGroup: React.FC<ElementGroupProps> = ({
  align = SmartLinkAlignment.Left,
  children,
  overrideCss,
  direction = SmartLinkDirection.Horizontal,
  size = SmartLinkSize.Medium,
  testId = 'smart-element-group',
  width = SmartLinkWidth.FitToContent,
}) => (
  <div
    css={[getElementGroupStyles(direction, size, align, width), overrideCss]}
    data-smart-element-group
    data-testid={testId}
  >
    {renderChildren(children, size)}
  </div>
);

export default ElementGroup;
