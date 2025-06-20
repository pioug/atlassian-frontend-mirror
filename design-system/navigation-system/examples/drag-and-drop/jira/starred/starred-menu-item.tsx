/**
 * @jsxFrag
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';

import StarUnstarredIcon from '@atlaskit/icon/core/star-unstarred';

import { SharedTopLevelFlyout } from '../shared-top-level-flyout';

export function StarredMenuItem({
	index,
	amountOfMenuItems,
}: {
	index: number;
	amountOfMenuItems: number;
}) {
	return (
		<SharedTopLevelFlyout
			label="Starred"
			value="starred"
			icon={<StarUnstarredIcon label="" />}
			index={index}
			amountOfMenuItems={amountOfMenuItems}
		/>
	);
}
