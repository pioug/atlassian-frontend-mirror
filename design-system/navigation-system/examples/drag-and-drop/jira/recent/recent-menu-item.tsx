/**
 * @jsxFrag
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';

import ClockIcon from '@atlaskit/icon/core/clock';

import { SharedTopLevelFlyout } from '../shared-top-level-flyout';

export function RecentMenuItem({
	index,
	amountOfMenuItems,
}: {
	index: number;
	amountOfMenuItems: number;
}) {
	return (
		<SharedTopLevelFlyout
			label="Recent"
			value="recent"
			testId="recent-menu-item"
			icon={<ClockIcon label="" />}
			index={index}
			amountOfMenuItems={amountOfMenuItems}
		/>
	);
}
