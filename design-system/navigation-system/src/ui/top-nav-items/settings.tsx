import React, { forwardRef } from 'react';

import SettingsIcon from '@atlaskit/icon/core/settings';

import { EndItem, type EndItemProps } from './end-item';

interface SettingsProps extends Omit<EndItemProps, 'icon'> {
	/**
	 * Experimental, do not use. May be removed at any time.
	 * Whether the tooltip should be disabled.
	 */
	UNSAFE_isTooltipDisabled?: boolean;
}

/**
 * __Settings__
 *
 * The Settings button for the top navigation.
 */
export const Settings: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<SettingsProps> & React.RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, SettingsProps>((props, ref) => (
	<EndItem {...props} ref={ref} icon={SettingsIcon} />
));
