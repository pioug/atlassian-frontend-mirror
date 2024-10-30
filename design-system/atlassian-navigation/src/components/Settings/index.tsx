import React, { forwardRef } from 'react';

import SettingsIcon from '@atlaskit/icon/core/migration/settings';

import { IconButton } from '../IconButton';

import { type SettingsProps } from './types';

/**
 * __Settings__
 *
 * A settings button that can be passed into `AtlassianNavigation`'s `renderSettings` prop.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#settings)
 * - [Code](https://atlassian.design/components/atlassian-navigation/code)
 */
export const Settings = forwardRef((props: SettingsProps, ref: React.Ref<any>) => {
	const { tooltip, ...iconButtonProps } = props;

	return (
		<div role="listitem">
			<IconButton
				icon={
					<SettingsIcon
						color="currentColor"
						spacing="spacious"
						label={typeof tooltip === 'string' ? tooltip : 'Settings Icon'}
					/>
				}
				ref={ref}
				tooltip={tooltip}
				{...iconButtonProps}
			/>
		</div>
	);
});

export default Settings;
