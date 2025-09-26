import React, { forwardRef, type Ref } from 'react';

import Button from '@atlaskit/button/custom-theme-button';
import Tooltip from '@atlaskit/tooltip';

import { useTheme } from '../../theme';

import { getIconButtonTheme } from './styles';
import { type IconButtonProps } from './types';

/**
 * __Icon button__
 *
 * An icon button is used to create navigation items such as Help, Settings
 * and Notifications. You can use this component to create your own items to
 * pass into `AtlassianNavigation`'s render props, but where possible you should
 * rely on the defaults.
 *
 */
export const IconButton: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<IconButtonProps> & React.RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, IconButtonProps>((props: IconButtonProps, ref: Ref<HTMLElement>) => {
	const {
		icon,
		label,
		testId,
		tooltip,
		component,
		href,
		id,
		isDisabled,
		isSelected,
		onBlur,
		onClick,
		onFocus,
		onMouseDown,
		onMouseEnter,
		onMouseLeave,
		onMouseUp,
		target,
		theme,
		isTooltipAnnouncementDisabled = false,
		...rest
	} = props;
	const themeFromContext = useTheme();

	const button = (
		<Button
			appearance="primary"
			aria-label={label}
			component={component}
			href={href}
			iconBefore={icon}
			id={id}
			isDisabled={isDisabled}
			isSelected={isSelected}
			onBlur={onBlur}
			onClick={onClick}
			onFocus={onFocus}
			onMouseDown={onMouseDown}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onMouseUp={onMouseUp}
			ref={ref}
			target={target}
			testId={testId}
			// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides, @atlaskit/design-system/no-unsafe-style-overrides
			theme={theme || getIconButtonTheme(themeFromContext)}
			// These are all explicit, leaving it in just in case
			{...rest}
		/>
	);

	if (tooltip) {
		return (
			<Tooltip
				content={tooltip}
				hideTooltipOnClick
				isScreenReaderAnnouncementDisabled={isTooltipAnnouncementDisabled}
			>
				{button}
			</Tooltip>
		);
	}

	return button;
});
