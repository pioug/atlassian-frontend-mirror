/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';
import Button from '@atlaskit/button/custom-theme-button';
import { SmartLinkSize } from '../../../../../constants';
import Tooltip from '@atlaskit/tooltip';
import { getIconSizeStyles } from '../../utils';
import { tokens } from '../../../../../utils/token';
import { handleOnClick } from '../../../../../utils';
import { ActionProps, ActionIconProps } from './types';

const getWidth = (size?: SmartLinkSize): string => {
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
  ${getIconSizeStyles(getWidth(size))};
`;

const ActionIcon: React.FC<ActionIconProps> = ({ size, testId, icon }) => (
  <span css={getIconStyles(size)} data-testid={`${testId}-icon`}>
    {icon}
  </span>
);

const Action: React.FC<ActionProps> = ({
  appearance = 'subtle',
  content,
  onClick,
  size = SmartLinkSize.Medium,
  testId = 'smart-action',
  icon,
  iconPosition = 'before',
  tooltipMessage,
}: ActionProps) => {
  if (!onClick) {
    return null;
  }
  const iconBefore =
    iconPosition === 'before' ? (
      <ActionIcon size={size} testId={testId} icon={icon} />
    ) : undefined;
  const iconAfter =
    iconPosition === 'after' ? (
      <ActionIcon size={size} testId={testId} icon={icon} />
    ) : undefined;
  return (
    <Tooltip content={tooltipMessage}>
      <Button
        spacing="none"
        appearance={appearance}
        testId={testId}
        onClick={handleOnClick(onClick)}
        iconBefore={iconBefore}
        iconAfter={iconAfter}
      >
        {content}
      </Button>
    </Tooltip>
  );
};

export default Action;
