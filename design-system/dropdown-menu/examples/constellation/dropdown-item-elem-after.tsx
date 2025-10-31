import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import CheckCircleIcon from '@atlaskit/icon/core/check-circle';

const DropdownItemElemAfterExample = () => {
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
