/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { SmartLinkSize } from '../../../../../constants';
import { ActionProps } from './types';
import ActionButton from './action-button';
import ActionDropdownItem from './action-dropdown-item';
import ActionIcon from './action-icon';

/**
 * A base action that can be triggered with an on click.
 * @internal
 * @param {ActionProps} ActionProps - The props necessary for the Action.
 * @see DeleteAction
 * @see EditAction
 * @see CustomAction
 */
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
  overrideCss,
}: ActionProps) => {
  if (!onClick) {
    return null;
  }

  const actionIcon = icon && (
    <ActionIcon icon={icon} size={size} testId={testId} />
  );
  const iconBefore = icon && iconPosition === 'before' ? actionIcon : undefined;
  const iconAfter = icon && iconPosition === 'after' ? actionIcon : undefined;

  if (asDropDownItem) {
    return (
      <ActionDropdownItem
        content={content}
        iconAfter={iconAfter}
        iconBefore={iconBefore}
        onClick={onClick}
        testId={testId}
      />
    );
  } else {
    return (
      <ActionButton
        appearance={appearance}
        content={content}
        iconAfter={iconAfter}
        iconBefore={iconBefore}
        onClick={onClick}
        overrideCss={overrideCss}
        size={size}
        testId={testId}
        tooltipMessage={tooltipMessage}
      />
    );
  }
};

export default Action;
