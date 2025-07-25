import React, { forwardRef, useCallback } from 'react';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import ButtonItem from '@atlaskit/menu/button-item';
import CustomItem from '@atlaskit/menu/custom-item';
import LinkItem from '@atlaskit/menu/link-item';

import useRegisterItemWithFocusManager from './internal/hooks/use-register-item-with-focus-manager';
import { type CustomItemHtmlProps, type DropdownItemProps } from './types';

/**
 * __Dropdown menu item__
 *
 * A dropdown item populates the dropdown menu with items. Every item should be inside a dropdown item group.
 *
 * - [Examples](https://atlassian.design/components/dropdown-menu/dropdown-item/examples)
 * - [Code](https://atlassian.design/components/dropdown-menu/dropdown-item/code)
 * - [Usage](https://atlassian.design/components/dropdown-menu/dropdown-item/usage)
 */
const DropdownMenuItem = forwardRef<HTMLElement, DropdownItemProps>(
	(
		{
			children,
			component,
			description,
			elemAfter,
			elemBefore,
			href,
			isDisabled,
			isSelected,
			onClick,
			rel,
			shouldDescriptionWrap = true,
			shouldTitleWrap = true,
			target,
			testId,
			UNSAFE_shouldDisableRouterLink,
			returnFocusRef,
			interactionName,
			role,
			...rest
		}: DropdownItemProps,
		ref,
	) => {
		// if the dropdown item has aria-haspopup, we won't register with focus manager
		// since it is a nested trigger, we have registered inside dropdown-menu
		const itemRef = useRegisterItemWithFocusManager(!!rest['aria-haspopup']);

		const handleItemClick = useCallback(
			(event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
				if (returnFocusRef?.current) {
					returnFocusRef.current.focus();
				}
				if (onClick) {
					onClick(event);
				}
			},
			[onClick, returnFocusRef],
		);

		if (component) {
			return (
				<CustomItem<CustomItemHtmlProps>
					component={component}
					description={description}
					iconAfter={elemAfter}
					iconBefore={elemBefore}
					isDisabled={isDisabled}
					isSelected={isSelected}
					onClick={handleItemClick}
					ref={mergeRefs([ref, itemRef])}
					shouldDescriptionWrap={shouldDescriptionWrap}
					shouldTitleWrap={shouldTitleWrap}
					testId={testId}
					href={href}
					// Thanks to spread props, these attributes are passed to CustomItem, even though
					// it's not in the component's prop types.
					// @ts-expect-error
					target={target}
					rel={rel}
					interactionName={interactionName}
					// DSP-13312 TODO: remove spread props in future major release
					{...rest}
				>
					{children}
				</CustomItem>
			);
		} else if (href) {
			return (
				<LinkItem
					description={description}
					href={href}
					iconAfter={elemAfter}
					iconBefore={elemBefore}
					isDisabled={isDisabled}
					isSelected={isSelected}
					onClick={handleItemClick}
					ref={mergeRefs([ref, itemRef])}
					rel={rel}
					role="menuitem"
					shouldDescriptionWrap={shouldDescriptionWrap}
					shouldTitleWrap={shouldTitleWrap}
					target={target}
					testId={testId}
					UNSAFE_shouldDisableRouterLink={UNSAFE_shouldDisableRouterLink}
					interactionName={interactionName}
					// DSP-13312 TODO: remove spread props in future major release
					{...rest}
				>
					{children}
				</LinkItem>
			);
		} else {
			return (
				<ButtonItem
					description={description}
					iconAfter={elemAfter}
					iconBefore={elemBefore}
					isDisabled={isDisabled}
					isSelected={isSelected}
					onClick={handleItemClick}
					ref={mergeRefs([ref, itemRef])}
					role={role || 'menuitem'}
					shouldDescriptionWrap={shouldDescriptionWrap}
					shouldTitleWrap={shouldTitleWrap}
					testId={testId}
					// Thanks to spread props, these attributes are passed to CustomItem, even though
					// it's not in the component's prop types.
					// @ts-expect-error
					target={target}
					rel={rel}
					interactionName={interactionName}
					// DSP-13312 TODO: remove spread props in future major release
					{...rest}
				>
					{children}
				</ButtonItem>
			);
		}
	},
);

export default DropdownMenuItem;
