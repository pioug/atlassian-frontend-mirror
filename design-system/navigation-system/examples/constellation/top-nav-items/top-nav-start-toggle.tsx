import React from 'react';

import { SideNavToggleButton } from '@atlaskit/navigation-system/layout/side-nav';
import { TopNavStart } from '@atlaskit/navigation-system/layout/top-nav';

import { MockTopBar } from '../common/mock-top-bar';

export function TopNavStartToggleExample(): React.JSX.Element {
	return (
		<MockTopBar>
			<TopNavStart
				sideNavToggleButton={
					<SideNavToggleButton
						defaultCollapsed
						collapseLabel="Collapse sidebar"
						expandLabel="Expand sidebar"
					/>
				}
			>
				{' '}
				{null}
			</TopNavStart>
		</MockTopBar>
	);
}

export default TopNavStartToggleExample;
