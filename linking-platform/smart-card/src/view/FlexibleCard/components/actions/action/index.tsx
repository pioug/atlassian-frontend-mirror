/** @jsx jsx */
import { type FC } from 'react';
import { jsx } from '@emotion/react';
import { SmartLinkSize } from '../../../../../constants';
import ActionStackItem from './action-stack-item';
import { ActionProps } from './types';
import ActionButton from './action-button';
import ActionDropdownItem from './action-dropdown-item';
import ActionIcon from './action-icon';

/**
 * A base action that can be triggered with an on click.
 * @internal
 * @param {ActionProps} ActionProps - The props necessary for the Action.
 */
const Action: FC<ActionProps> = ({
  as,
  appearance = 'subtle',
  content,
  isLoading = false,
  onClick,
  size = SmartLinkSize.Medium,
  testId = 'smart-action',
  icon,
  iconPosition = 'before',
  spaceInline,
  tooltipMessage,
  tooltipOnHide,
  xcss,
  asDropDownItem,
  overrideCss,
  isDisabled,
  href,
  ariaLabel,
  wrapper: Wrapper,
}: ActionProps) => {
  if (!onClick) {
    return null;
  }

  const isStackItem = as === 'stack-item';
  const isDropdownItem = as === 'dropdown-item' || asDropDownItem;

  const actionIcon = icon && (
    <ActionIcon
      isDisabled={isDisabled}
      icon={icon}
      size={size}
      showBackground={isStackItem}
      testId={testId}
    />
  );
  const iconBefore = icon && iconPosition === 'before' ? actionIcon : undefined;
  const iconAfter = icon && iconPosition === 'after' ? actionIcon : undefined;

  if (isStackItem) {
    return (
      <ActionStackItem
        content={content}
        icon={actionIcon}
        space={spaceInline}
        isDisabled={isDisabled}
        isLoading={isLoading}
        onClick={onClick}
        size={size}
        testId={testId}
        tooltipMessage={tooltipMessage || content}
        xcss={xcss}
        tooltipOnHide={tooltipOnHide}
      />
    );
  }

  if (isDropdownItem) {
    return (
      <ActionDropdownItem
        content={content}
        iconAfter={iconAfter}
        iconBefore={iconBefore}
        isLoading={isLoading}
        onClick={onClick}
        testId={testId}
      />
    );
  }

  const button = (
    <ActionButton
      appearance={appearance}
      content={content}
      iconAfter={iconAfter}
      iconBefore={iconBefore}
      isLoading={isLoading}
      onClick={onClick}
      overrideCss={overrideCss}
      size={size}
      testId={testId}
      tooltipMessage={tooltipMessage || content}
      isDisabled={isDisabled}
      href={href}
      ariaLabel={ariaLabel}
    />
  );
  return Wrapper !== undefined ? <Wrapper>{button}</Wrapper> : button;
};

export default Action;
