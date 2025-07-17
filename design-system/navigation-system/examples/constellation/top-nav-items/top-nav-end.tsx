import React from 'react';

import Badge from '@atlaskit/badge';
import { Help } from '@atlaskit/navigation-system';
import { TopNavEnd } from '@atlaskit/navigation-system/layout/top-nav';
import { Notifications, Settings } from '@atlaskit/navigation-system/top-nav-items';

import { MockTopBar } from '../common/mock-top-bar';

export function TopNavEndLayoutExample() {
	return (
		<MockTopBar>
			<TopNavEnd>
				<Notifications
					label="Notifications"
					badge={() => <Badge appearance="important">{3}</Badge>}
				/>
				<Help label="Help" />
				<Settings label="Settings" />
			</TopNavEnd>
		</MockTopBar>
	);
}

export default TopNavEndLayoutExample;
