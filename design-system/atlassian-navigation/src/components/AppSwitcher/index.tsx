import React, { forwardRef, type Ref } from 'react';

import Nav4AppSwitcherIcon from '@atlaskit/icon/core/app-switcher';
import AppSwitcherIcon from '@atlaskit/icon/core/migration/app-switcher';
import { token } from '@atlaskit/tokens';

import { IconButton } from '../IconButton';

import { type AppSwitcherProps } from './types';

/**
 * _App switcher__
 *
 * An AppSwitcher button that can be passed into `AtlassianNavigation`'s
 * `renderAppSwitcher` prop.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#app-switcher)
 * - [Code](https://atlassian.design/components/atlassian-navigation/code)
 */
export const AppSwitcher: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<AppSwitcherProps> & React.RefAttributes<any>
> = forwardRef((props: AppSwitcherProps, ref: Ref<any>) => {
	const {
		component,
		href,
		id,
		isDisabled,
		isSelected,
		label,
		onBlur,
		onClick,
		onFocus,
		onMouseDown,
		onMouseEnter,
		onMouseLeave,
		onMouseUp,
		target,
		testId,
		tooltip,
		...rest
	} = props;

	return (
		<IconButton
			component={component}
			href={href}
			icon={
				<AppSwitcherIcon
					color="currentColor"
					spacing="spacious"
					label={typeof tooltip === 'string' ? tooltip : 'Switch apps'}
				/>
			}
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
			tooltip={tooltip}
			// These are all explicit, leaving it in just in case
			{...rest}
		/>
	);
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const AppSwitcherNav4: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<AppSwitcherProps> & React.RefAttributes<any>
> = forwardRef((props: AppSwitcherProps, ref: Ref<any>) => {
	const {
		component,
		href,
		id,
		isDisabled,
		isSelected,
		label,
		onBlur,
		onClick,
		onFocus,
		onMouseDown,
		onMouseEnter,
		onMouseLeave,
		onMouseUp,
		target,
		testId,
		tooltip,
		...rest
	} = props;

	return (
		<IconButton
			icon={
				<Nav4AppSwitcherIcon
					label={typeof tooltip === 'string' ? tooltip : 'Switch apps'}
					color={token('color.icon')}
				/>
			}
			component={component}
			href={href}
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
			tooltip={tooltip}
			// These are all explicit, leaving it in just in case
			{...rest}
		/>
	);
});

// exists only to extract props
// eslint-disable-next-line import/no-anonymous-default-export
export default (_props: AppSwitcherProps): void => {};
