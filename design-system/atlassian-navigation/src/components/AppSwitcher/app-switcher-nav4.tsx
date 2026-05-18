import React, { forwardRef, type Ref } from 'react';

import AppSwitcherIcon from '@atlaskit/icon/core/app-switcher';
import { token } from '@atlaskit/tokens';

import { IconButton } from '../IconButton';

import { type AppSwitcherProps } from './types';

/**
 * @deprecated `@atlaskit/atlassian-navigation` is deprecated. Use `@atlaskit/navigation-system` instead.
 */
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
				<AppSwitcherIcon
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
