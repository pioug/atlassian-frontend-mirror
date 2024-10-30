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
export const AppSwitcher = forwardRef((props: AppSwitcherProps, ref: Ref<any>) => {
	const { tooltip, ...iconButtonProps } = props;

	return (
		<IconButton
			icon={
				<AppSwitcherIcon
					color="currentColor"
					spacing="spacious"
					label={typeof tooltip === 'string' ? tooltip : 'Switch apps'}
				/>
			}
			tooltip={tooltip}
			ref={ref}
			{...iconButtonProps}
		/>
	);
});

// TODO: Fill in the component {description} and ensure links point to the correct {packageName} location.
// Remove links that the component does not have (such as usage). If there are no links remove them all.
/**
 * __App switcher nav 4__
 *
 * An app switcher nav 4 {description}.
 *
 * - [Examples](https://atlassian.design/components/{packageName}/examples)
 * - [Code](https://atlassian.design/components/{packageName}/code)
 * - [Usage](https://atlassian.design/components/{packageName}/usage)
 */
export const AppSwitcherNav4 = forwardRef((props: AppSwitcherProps, ref: Ref<any>) => {
	const { tooltip, ...iconButtonProps } = props;

	return (
		<IconButton
			icon={
				<Nav4AppSwitcherIcon
					label={typeof tooltip === 'string' ? tooltip : 'Switch apps'}
					color={token('color.icon')}
				/>
			}
			tooltip={tooltip}
			ref={ref}
			{...iconButtonProps}
		/>
	);
});

// exists only to extract props
// eslint-disable-next-line @repo/internal/react/use-noop, import/no-anonymous-default-export
export default (props: AppSwitcherProps) => {};
