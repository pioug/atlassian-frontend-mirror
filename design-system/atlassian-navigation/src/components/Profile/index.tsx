import React, { forwardRef, type Ref } from 'react';

import { IconButton } from '../IconButton';

import { type ProfileProps } from './types';

/**
 * __Profile__
 *
 * A profile button which takes an icon/avatar component can be that can be
 * passed into `AtlassianNavigation`'s `renderProfile` prop.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#profile)
 * - [Code](https://atlassian.design/components/atlassian-navigation/code)
 */
export const Profile: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<ProfileProps> & React.RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, ProfileProps>((props: ProfileProps, ref: Ref<HTMLElement>) => {
	const {
		component,
		href,
		icon,
		id,
		isDisabled,
		isSelected,
		label: labelProp,
		onBlur,
		onClick,
		onFocus,
		onMouseDown,
		onMouseEnter,
		onMouseLeave,
		onMouseUp,
		target,
		testId,
		theme,
		tooltip,
		...rest
	} = props;
	const label = labelProp || (typeof tooltip === 'string' ? tooltip : 'Your profile and settings');

	return (
		<div role="listitem">
			<IconButton
				component={component}
				href={href}
				icon={icon}
				id={id}
				isDisabled={isDisabled}
				isSelected={isSelected}
				label={label}
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
				// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
				theme={theme}
				tooltip={tooltip}
				isTooltipAnnouncementDisabled
				// These are mostly explicit, leaving it in just in case
				{...rest}
			/>
		</div>
	);
});

// This exists only to extract props.
// eslint-disable-next-line import/no-anonymous-default-export
export default (props: ProfileProps) => {};
