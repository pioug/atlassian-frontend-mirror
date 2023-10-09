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

const getIconStyles = (size?: SmartLinkSize, isDisabled?: boolean) => css`
  color: ${isDisabled
    ? token('color.text.disabled', '#6B778C')
    : token('color.icon', '#44546F')};
  ${getIconSizeStyles(getIconWidth(size))};
`;

const ActionIcon: React.FC<ActionIconProps> = ({
  size,
  testId,
  icon,
  isDisabled,
}) => (
  <span css={getIconStyles(size, isDisabled)} data-testid={`${testId}-icon`}>
    {icon}
  </span>
);

export default ActionIcon;
