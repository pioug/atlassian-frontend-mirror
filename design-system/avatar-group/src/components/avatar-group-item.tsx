import React, { type ElementType, forwardRef } from 'react';

import Avatar from '@atlaskit/avatar';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import { ButtonItem, CustomItem, type CustomItemComponentProps, LinkItem } from '@atlaskit/menu';
import { fg } from '@atlaskit/platform-feature-flags';

import { type getOverrides } from './get-overrides';
import useRegisterItemWithFocusManager from './internal/hooks/use-register-item-with-focus-manager';
import { type AvatarProps, type onAvatarClickHandler } from './types';

export interface AvatarGroupItemProps {
	avatar: AvatarProps;
	/**
	 * Custom component used to render the avatar inside the dropdown menu item.
	 * When not provided, defaults to the standard Avatar component.
	 */
	avatarComponent?: typeof Avatar | ElementType<AvatarProps>;
	isActive?: boolean;
	isHover?: boolean;
	avatarOverrides?: ReturnType<typeof getOverrides>['Avatar'];
	index: number;
	onAvatarClick?: onAvatarClickHandler;
	testId?: string;
	/**
	 * Use this to override the accessibility role for the element.
	 * When used inside a dropdown menu, this should be set to "menuitem".
	 */
	role?: string;
}

const AvatarGroupItem: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<AvatarGroupItemProps> & React.RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, AvatarGroupItemProps>((props, ref) => {
	const { avatar, avatarComponent, index, onAvatarClick, testId, avatarOverrides, role } = props;

	const {
		analyticsContext,
		appearance,
		as,
		borderColor: _borderColor,
		children,
		href,
		isDisabled,
		key: _key,
		label,
		name,
		onClick,
		presence,
		size: _size,
		src,
		stackIndex,
		status,
		tabIndex,
		target,
		testId: _groupItemTestId,
		...rest
	} = avatar;
	const itemRef = useRegisterItemWithFocusManager();

	const CustomComponent = ({
		children,
		className,
		disabled,
		draggable,
		onClick,
		onDragStart,
		onMouseDown,
		ref,
		tabIndex,
		'data-testid': testId,
		...props
	}: CustomItemComponentProps) => {
		return (
			<button
				type="button"
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className={className}
				disabled={disabled}
				draggable={draggable}
				onClick={onClick}
				// eslint-disable-next-line @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop
				onDragStart={onDragStart}
				onMouseDown={onMouseDown}
				ref={ref}
				tabIndex={tabIndex}
				data-testid={testId}
				role={role}
				// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
				{...props}
			>
				{children}
			</button>
		);
	};

	const AvatarComponent = fg('platform-avatar-group-pass-avatar-to-item')
		? (avatarComponent ?? Avatar)
		: Avatar;

	const AvatarIcon =
		avatarOverrides && fg('platform-avatar-group-pass-avatar-to-item') ? (
			avatarOverrides.render(
				AvatarComponent,
				{
					...rest,
					analyticsContext,
					appearance,
					as,
					borderColor: 'transparent',
					children,
					isDisabled,
					label,
					name: '',
					presence,
					size: 'small',
					src,
					stackIndex,
					status,
					tabIndex,
					testId: testId && `${testId}--avatar`,
				},
				0,
			)
		) : (
			<AvatarComponent
				{...rest}
				analyticsContext={analyticsContext}
				appearance={appearance}
				as={as}
				borderColor="transparent"
				children={children}
				isDisabled={isDisabled}
				label={label}
				name=""
				presence={presence}
				size="small"
				src={src}
				stackIndex={stackIndex}
				status={status}
				tabIndex={tabIndex}
				testId={testId && `${testId}--avatar`}
			/>
		);

	// onClick handler provided with avatar data takes precedence, same as with the normal avatar item
	const callback = onClick || onAvatarClick;

	if (href) {
		return (
			<LinkItem
				ref={mergeRefs([ref, itemRef])}
				href={href}
				target={target}
				rel={target === '_blank' ? 'noopener noreferrer' : undefined}
				iconBefore={AvatarIcon}
				testId={testId}
				role={role}
				onClick={(event) =>
					callback && callback(event as React.MouseEvent<Element>, undefined, index)
				}
			>
				{name}
			</LinkItem>
		);
	}
	if (typeof callback === 'function') {
		return (
			<ButtonItem
				ref={mergeRefs([ref, itemRef])}
				onClick={(event) =>
					callback && callback(event as React.MouseEvent<Element>, undefined, index)
				}
				iconBefore={AvatarIcon}
				testId={testId}
				role={role}
			>
				{name}
			</ButtonItem>
		);
	}
	return (
		<CustomItem iconBefore={AvatarIcon} component={CustomComponent} testId={testId}>
			{name}
		</CustomItem>
	);
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default AvatarGroupItem;
