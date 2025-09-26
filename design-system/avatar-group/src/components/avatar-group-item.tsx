import React, { forwardRef } from 'react';

import Avatar from '@atlaskit/avatar';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import { ButtonItem, CustomItem, type CustomItemComponentProps, LinkItem } from '@atlaskit/menu';

import useRegisterItemWithFocusManager from './internal/hooks/use-register-item-with-focus-manager';
import { type AvatarProps, type onAvatarClickHandler } from './types';

export interface AvatarGroupItemProps {
	avatar: AvatarProps;
	isActive?: boolean;
	isHover?: boolean;
	index: number;
	onAvatarClick?: onAvatarClickHandler;
	testId?: string;
}

const AvatarGroupItem: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<AvatarGroupItemProps> & React.RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, AvatarGroupItemProps>((props, ref) => {
	const { avatar, index, onAvatarClick, testId } = props;
	const {
		analyticsContext,
		appearance,
		as,
		borderColor,
		children,
		href,
		isDisabled,
		key,
		label,
		name,
		onClick,
		presence,
		size,
		src,
		stackIndex,
		status,
		tabIndex,
		target,
		testId: groupItemTestId,
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
				// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
				{...props}
			>
				{children}
			</button>
		);
	};

	const AvatarIcon = (
		<Avatar
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
