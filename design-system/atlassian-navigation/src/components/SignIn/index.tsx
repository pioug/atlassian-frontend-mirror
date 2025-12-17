import React from 'react';

import LogInIcon from '@atlaskit/icon/core/log-in';

import { IconButton } from '../IconButton';

import { type SignInProps } from './types';

/**
 * __Sign in__
 *
 * A sign-in button that can be passed into `AtlassianNavigation`'s `renderSignIn` prop.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#sign-in)
 * - [Code](https://atlassian.design/components/atlassian-navigation/code)
 */
export const SignIn = (props: SignInProps): React.JSX.Element => {
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
		<div role="listitem">
			<IconButton
				component={component}
				href={href}
				icon={
					<LogInIcon
						color="currentColor"
						spacing="spacious"
						label={typeof tooltip === 'string' ? tooltip : 'Sign-in Icon'}
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
				target={target}
				testId={testId}
				tooltip={tooltip}
				// These are all explicit, leaving it in just in case
				// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
				{...rest}
			/>
		</div>
	);
};
