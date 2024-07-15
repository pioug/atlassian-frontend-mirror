import React, { forwardRef, type Ref } from 'react';

import AppSwitcherIcon from '@atlaskit/icon/glyph/app-switcher';

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
			icon={<AppSwitcherIcon label={typeof tooltip === 'string' ? tooltip : 'Appswitcher Icon'} />}
			tooltip={tooltip}
			ref={ref}
			{...iconButtonProps}
		/>
	);
});

// exists only to extract props
// eslint-disable-next-line @repo/internal/react/use-noop, import/no-anonymous-default-export
export default (props: AppSwitcherProps) => {};
