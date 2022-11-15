/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { SmartLinkSize } from '../../../../../../constants';
import { tokens } from '../../../../../../utils/token';
import { getIconSizeStyles } from '../../../utils';
import { ActionIconProps } from './types';

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

const getIconStyles = (size?: SmartLinkSize) => css`
  color: ${tokens.actionIcon};
  ${getIconSizeStyles(getIconWidth(size))};
`;

const ActionIcon: React.FC<ActionIconProps> = ({ size, testId, icon }) => (
  <span css={getIconStyles(size)} data-testid={`${testId}-icon`}>
    {icon}
  </span>
);

export default ActionIcon;
