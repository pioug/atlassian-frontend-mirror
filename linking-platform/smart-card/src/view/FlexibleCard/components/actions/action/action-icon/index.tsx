/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { SmartLinkSize } from '../../../../../../constants';
import { getIconSizeStyles } from '../../../utils';
import { ActionIconProps } from './types';
import { token } from '@atlaskit/tokens';

const getIconWidth = (size?: SmartLinkSize): string => {
  switch (size) {
    case SmartLinkSize.XLarge:
    case SmartLinkSize.Large:
      return '1.5rem';
    case SmartLinkSize.Medium:
    case SmartLinkSize.Small:
    default:
      return '1rem';
  }
};

const getIconStyles = (isDisabled?: boolean) =>
  css({
    color: isDisabled
      ? token('color.text.disabled', '#6B778C')
      : token('color.icon', '#44546F'),
  });

const backgroundStyles = css({
  backgroundColor: token('color.background.brand.subtlest'),
  borderRadius: token('border.radius.050'),
  color: token('color.icon.brand'),
  display: 'inline-block',
  lineHeight: 0,
  padding: token('space.025'),
  'span,svg,img': {
    lineHeight: 0,
  },
  // Use !important to win over `style` prop specificity in DS Spinner. :(
  circle: {
    stroke: `${token('color.icon.brand')} !important`,
  },
});

const ActionIcon: React.FC<ActionIconProps> = ({
  size,
  testId,
  icon,
  isDisabled,
  showBackground,
}) => (
  <span
    css={[
      getIconStyles(isDisabled),
      getIconSizeStyles(getIconWidth(size)),
      showBackground && backgroundStyles,
    ]}
    data-testid={`${testId}-icon`}
  >
    {icon}
  </span>
);

export default ActionIcon;
