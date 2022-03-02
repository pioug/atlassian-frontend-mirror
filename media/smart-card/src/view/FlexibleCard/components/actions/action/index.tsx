/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';
import { Spacing } from '@atlaskit/button';
import Button from '@atlaskit/button/custom-theme-button';
import { SmartLinkSize } from '../../../../../constants';
import Tooltip from '@atlaskit/tooltip';
import { DropdownItem } from '@atlaskit/dropdown-menu';
import { getIconSizeStyles } from '../../utils';
import { tokens } from '../../../../../utils/token';
import { handleOnClick } from '../../../../../utils';
import { ActionProps, ActionIconProps } from './types';

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

const getButtonStyle = (size?: SmartLinkSize, iconOnly?: boolean) =>
  size === SmartLinkSize.Small
    ? css`
        font-size: 0.75rem;
        font-weight: 500;
        line-height: 1rem;
        button,
        button:hover,
        button:focus,
        button:active {
          line-height: 1rem;
          ${iconOnly
            ? `
            padding: 0.125rem;
          `
            : `
            padding-left: 0.25rem;
            padding-right: 0.25rem;
          `}
        }
      `
    : '';

const ActionIcon: React.FC<ActionIconProps> = ({ size, testId, icon }) => (
  <span css={getIconStyles(size)} data-testid={`${testId}-icon`}>
    {icon}
  </span>
);

export const sizeToSpacing: Record<SmartLinkSize, Spacing> = {
  [SmartLinkSize.Small]: 'none',
  [SmartLinkSize.Medium]: 'compact',
  [SmartLinkSize.Large]: 'compact',
  [SmartLinkSize.XLarge]: 'default',
};

const Action: React.FC<ActionProps> = ({
  appearance = 'subtle',
  content,
  onClick,
  size = SmartLinkSize.Medium,
  testId = 'smart-action',
  icon,
  iconPosition = 'before',
  tooltipMessage,
  asDropDownItem,
}: ActionProps) => {
  if (!onClick) {
    return null;
  }
  const iconBefore =
    icon && iconPosition === 'before' ? (
      <ActionIcon size={size} testId={testId} icon={icon} />
    ) : undefined;
  const iconAfter =
    icon && iconPosition === 'after' ? (
      <ActionIcon size={size} testId={testId} icon={icon} />
    ) : undefined;
  const iconOnly = !content;
  if (asDropDownItem) {
    return (
      <DropdownItem
        elemBefore={iconBefore}
        elemAfter={iconAfter}
        testId={testId}
        onClick={handleOnClick(onClick)}
      >
        {content}
      </DropdownItem>
    );
  } else {
    return (
      <Tooltip content={tooltipMessage}>
        <div css={getButtonStyle(size, iconOnly)}>
          <Button
            spacing={sizeToSpacing[size]}
            appearance={appearance}
            testId={testId}
            onClick={handleOnClick(onClick)}
            iconBefore={iconBefore}
            iconAfter={iconAfter}
          >
            {content}
          </Button>
        </div>
      </Tooltip>
    );
  }
};

export default Action;
