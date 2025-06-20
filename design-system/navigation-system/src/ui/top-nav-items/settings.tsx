import React, { forwardRef } from 'react';

import SettingsIcon from '@atlaskit/icon/core/settings';

import { EndItem, type EndItemProps } from './end-item';

interface SettingsProps extends Omit<EndItemProps, 'icon'> {}

/**
 * __Settings__
 *
 * The Settings button for the top navigation.
 */
export const Settings = forwardRef<HTMLButtonElement, SettingsProps>((props, ref) => (
	<EndItem {...props} ref={ref} icon={SettingsIcon} />
));
