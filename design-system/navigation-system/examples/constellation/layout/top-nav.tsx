import React from 'react';

import { Root } from '@atlaskit/navigation-system/layout/root';
import {
	TopNav,
	TopNavEnd,
	TopNavMiddle,
	TopNavStart,
} from '@atlaskit/navigation-system/layout/top-nav';

export function TopNavLayoutExample() {
	return (
		<Root>
			<TopNav>
				<TopNavStart>123</TopNavStart>
				<TopNavMiddle>456</TopNavMiddle>
				<TopNavEnd>789</TopNavEnd>
			</TopNav>
		</Root>
	);
}
