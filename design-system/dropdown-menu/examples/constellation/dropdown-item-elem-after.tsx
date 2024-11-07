import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import CheckIcon from '@atlaskit/icon/glyph/check';

const DropdownItemElemAfterExample = () => {
	return (
		<DropdownMenu trigger="Open" shouldRenderToParent>
			<DropdownItemGroup>
				<DropdownItem elemAfter={<CheckIcon label="" />}>Kelly</DropdownItem>
				<DropdownItem elemAfter={<CheckIcon label="" />}>Matt</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
};

export default DropdownItemElemAfterExample;
