import React from 'react';

import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import CheckCircleIcon from '@atlaskit/icon/core/check-circle';

const DropdownItemElemAfterExample = (): React.JSX.Element => {
	return (
		<DropdownMenu trigger="Open" shouldRenderToParent>
			<DropdownItemGroup>
				<DropdownItem elemAfter={<CheckCircleIcon label="" />}>Kelly</DropdownItem>
				<DropdownItem elemAfter={<CheckCircleIcon label="" />}>Matt</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
};

export default DropdownItemElemAfterExample;
