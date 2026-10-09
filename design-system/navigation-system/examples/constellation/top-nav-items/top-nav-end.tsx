import React from 'react';

import Badge from '@atlaskit/badge/badge';
import { TopNavEnd } from '@atlaskit/navigation-system/layout/top-nav';
import { Help } from '@atlaskit/navigation-system/top-nav-items/help';
import { Notifications } from '@atlaskit/navigation-system/top-nav-items/notifications';
import { Settings } from '@atlaskit/navigation-system/top-nav-items/settings';

import { MockTopBar } from '../common/mock-top-bar';

export function TopNavEndLayoutExample(): React.JSX.Element {
	return (
		<MockTopBar>
			<TopNavEnd>
				<Notifications
					label="Notifications"
					badge={() => <Badge appearance="dangerBold">{3}</Badge>}
				/>
				<Help label="Help" />
				<Settings label="Settings" />
			</TopNavEnd>
		</MockTopBar>
	);
}

export default TopNavEndLayoutExample;
