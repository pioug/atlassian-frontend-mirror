import React from 'react';

import { TopNavMiddle } from '@atlaskit/navigation-system/layout/top-nav';
import { Search } from '@atlaskit/navigation-system/top-nav-items';
import { CreateButton } from '@atlaskit/navigation-system/top-nav-items/create-button';

import { MockTopBar } from '../common/mock-top-bar';

export function TopNavMiddleLayoutExample(): React.JSX.Element {
	return (
		<MockTopBar>
			<TopNavMiddle>
				<Search label="Search" />
				<CreateButton>Create</CreateButton>
			</TopNavMiddle>
		</MockTopBar>
	);
}

export default TopNavMiddleLayoutExample;
