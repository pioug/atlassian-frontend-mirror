import React from 'react';

import { TopNavMiddle } from '@atlaskit/navigation-system/layout/top-nav';
import { CreateButton, Search } from '@atlaskit/navigation-system/top-nav-items';

import { MockTopBar } from '../common/mock-top-bar';

export function TopNavMiddleLayoutExample() {
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
