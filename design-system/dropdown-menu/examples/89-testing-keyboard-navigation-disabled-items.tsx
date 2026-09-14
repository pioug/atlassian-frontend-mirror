import React from 'react';

import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags/setBooleanFeatureFlagResolver';

const fgs = ['select-avoid-duplicated-registered-ref'];

export default (): React.JSX.Element => {
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
