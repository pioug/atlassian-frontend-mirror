import React from 'react';

import { SmartLinkSize } from '../../../../../constants';

import ActionButton from './action-button';
import ActionDropdownItem from './action-dropdown-item';
import ActionIcon from './action-icon';
import ActionStackItem from './action-stack-item';
import { type ActionProps } from './types';

/**
 * A base action that can be triggered with an on click.
 * @internal
 * @param {ActionProps} ActionProps - The props necessary for the Action.
 */
const Action = ({
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
	hideTooltip,
	hideTooltipOnMouseDown,
	style,
	asDropDownItem,
	className,
	isDisabled,
	href,
	ariaLabel,
	wrapper: Wrapper,
}: ActionProps): React.JSX.Element | null => {
	if (!onClick) {
		return null;
	}

	const isStackItem = as === 'stack-item';
	const isDropdownItem = as === 'dropdown-item' || asDropDownItem;

	const actionIcon = icon ? (
		<ActionIcon
			asStackItemIcon={isStackItem}
			isDisabled={isDisabled}
			icon={icon}
			size={size}
			testId={testId}
		/>
	) : undefined;
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
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				style={style}
				tooltipOnHide={tooltipOnHide}
				hideTooltipOnMouseDown={hideTooltipOnMouseDown}
				hideTooltip={hideTooltip}
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
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={className}
			size={size}
			testId={testId}
			tooltipMessage={tooltipMessage || content}
			isDisabled={isDisabled}
			href={href}
			ariaLabel={ariaLabel}
		/>
	);
	// @ts-ignore - Workaround for help-center local consumption
	return Wrapper !== undefined ? <Wrapper>{button}</Wrapper> : button;
};

export default Action;
