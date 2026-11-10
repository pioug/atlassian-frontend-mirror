import React, { forwardRef, useCallback } from 'react';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import ButtonItem from '@atlaskit/menu/button-item';
import CustomItem from '@atlaskit/menu/custom-item';
import LinkItem from '@atlaskit/menu/link-item';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import NewDropdownMenuItem from './dropdown-item-new';
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
export const DropdownItem: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<DropdownItemProps> & React.RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, DropdownItemProps>(
	(
		{
			children,
			component,
			description,
			elemBefore,
			elemAfter,
			shouldTitleWrap = true,
			shouldDescriptionWrap = true,
			isSelected,
			isDisabled,
			hasNestedMenu,
			shortcut,
			appearance,
			href,
			onClick,
			target,
			rel,
			testId,
			UNSAFE_shouldDisableRouterLink,
			returnFocusRef,
			interactionName,
			role,
			'aria-haspopup': ariaHasPopup,
			'aria-expanded': ariaExpanded,
			...rest
		}: DropdownItemProps,
		ref,
	) => {
		// Nested submenu triggers register with the focus manager inside DropdownMenu.
		// Dialog triggers must register here so arrow navigation can reach them.
		const isNestedTrigger = !!ariaHasPopup && ariaHasPopup !== 'dialog';
		const itemRef = useRegisterItemWithFocusManager(isNestedTrigger);

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

		if (fg('platform-dst-new-menu')) {
			return (
				<NewDropdownMenuItem
					title={children}
					description={description}
					elemBefore={elemBefore}
					elemAfter={elemAfter}
					shouldTitleWrap={shouldTitleWrap}
					shouldDescriptionWrap={shouldDescriptionWrap}
					isSelected={isSelected}
					isDisabled={isDisabled}
					hasNestedMenu={hasNestedMenu}
					shortcut={shortcut}
					appearance={appearance}
					href={href}
					onClick={handleItemClick}
					target={target}
					rel={rel}
					testId={testId}
					aria-haspopup={ariaHasPopup}
					aria-expanded={ariaExpanded}
					ref={mergeRefs([ref, itemRef])}
				/>
			);
		}

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
					aria-haspopup={ariaHasPopup}
					aria-expanded={ariaExpanded}
					// DSP-13312 TODO: remove spread props in future major release
					{...rest}
				>
					{children}
				</CustomItem>
			);
		}
		if (href) {
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
					aria-haspopup={ariaHasPopup}
					aria-expanded={ariaExpanded}
					// DSP-13312 TODO: remove spread props in future major release
					{...rest}
				>
					{children}
				</LinkItem>
			);
		}
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
				aria-haspopup={ariaHasPopup}
				aria-expanded={ariaExpanded}
				// DSP-13312 TODO: remove spread props in future major release
				{...rest}
				// When used as a nested submenu trigger, the item's open state is conveyed via
				// `aria-expanded`. `aria-current` (which ButtonItem sets from `isSelected`) is
				// inappropriate here and misleads screen reader users, so override it. (A11Y-29757)
				{...(isNestedTrigger && fg('platform_dst_dropdown_nested_trigger_aria_current')
					? { 'aria-current': undefined }
					: {})}
			>
				{children}
			</ButtonItem>
		);
	},
);

export default DropdownItem;
