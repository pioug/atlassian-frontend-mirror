import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';

const fgs = ['dropdown-menu-disabled-navigation-fix', 'select-avoid-duplicated-registered-ref'];

export default () => {
	setBooleanFeatureFlagResolver((key) => fgs.includes(key));
	return (
		<DropdownMenu trigger="New behavior" testId="dropdown" shouldRenderToParent>
			<DropdownItemGroup>
				<DropdownItem isDisabled>Disabled Start</DropdownItem>
				<DropdownItem>Move</DropdownItem>
				<DropdownItem>Clone</DropdownItem>
				<DropdownItem isDisabled>Disabled End</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
};
