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
export const Settings: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<SettingsProps> & React.RefAttributes<any>
> = forwardRef((props: SettingsProps, ref: React.Ref<any>) => {
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
					<SettingsIcon
						color="currentColor"
						spacing="spacious"
						label={typeof tooltip === 'string' ? tooltip : 'Settings Icon'}
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
				isTooltipAnnouncementDisabled
				{...rest}
			/>
		</div>
	);
});
