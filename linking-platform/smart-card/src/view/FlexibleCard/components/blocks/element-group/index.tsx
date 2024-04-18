/** @jsx jsx */
import { css, jsx, SerializedStyles } from '@emotion/react';

import { ElementGroupProps } from './types';
import {
  SmartLinkAlignment,
  SmartLinkDirection,
  SmartLinkPosition,
  SmartLinkSize,
  SmartLinkWidth,
} from '../../../../../constants';
import { getBaseStyles, getGapSize, renderChildren } from '../utils';
import { getMaxLineHeight, getTruncateStyles } from '../../utils';

const getAlignmentStyles = (align?: SmartLinkAlignment) => {
  switch (align) {
    case SmartLinkAlignment.Right:
      return css({
        WebkitBoxAlign: 'end',
        MsFlexAlign: 'end',
        justifyContent: 'flex-end',
        textAlign: 'right',
      });
    case SmartLinkAlignment.Left:
    default:
      return css({
        WebkitBoxAlign: 'start',
        MsFlexAlign: 'start',
        justifyContent: 'flex-start',
        textAlign: 'left',
      });
  }
};

const getGapStyles = (
  size: SmartLinkSize,
  align: SmartLinkAlignment,
): SerializedStyles => {
  const gap = getGapSize(size);
  if (align === SmartLinkAlignment.Right) {
    return css({
      '> span': {
        marginLeft: `${gap}rem`,
      },
      '> span:first-child': {
        marginLeft: 'initial',
      },
    });
  }

  return css({
    '> span': {
      marginRight: `${gap}rem`,
      '&:last-child': {
        marginRight: 'initial',
      },
    },
  });
};

const getHorizontalDirectionStyles = (
  size: SmartLinkSize,
  align: SmartLinkAlignment,
) => {
  const lineHeight = getMaxLineHeight(size);
  // eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
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
  position: SmartLinkPosition,
): SerializedStyles =>
  css(
    getBaseStyles(direction, size),
    getAlignmentStyles(align),
    {
      minWidth: '10%',
    },
    width === SmartLinkWidth.Flexible ? `flex: 1 3;` : '',
    direction === SmartLinkDirection.Horizontal
      ? getHorizontalDirectionStyles(size, align)
      : '',
    position === SmartLinkPosition.Top ? 'align-self: flex-start;' : '',
  );

/**
 * Creates a group of Action components. Accepts an array of Actions, in addition to some styling
 * preferences.
 * @internal
 * @param {ActionGroupProps} ActionGroupProps
 * @see Action
 */
const ElementGroup = ({
  align = SmartLinkAlignment.Left,
  children,
  overrideCss,
  direction = SmartLinkDirection.Horizontal,
  size = SmartLinkSize.Medium,
  testId = 'smart-element-group',
  width = SmartLinkWidth.FitToContent,
  position = SmartLinkPosition.Center,
}: ElementGroupProps) => (
  <div
    css={[
      getElementGroupStyles(direction, size, align, width, position),
      overrideCss,
    ]}
    data-smart-element-group
    data-testid={testId}
  >
    {renderChildren(children, size)}
  </div>
);

export default ElementGroup;
