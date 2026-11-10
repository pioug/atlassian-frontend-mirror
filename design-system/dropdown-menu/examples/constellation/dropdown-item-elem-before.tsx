import React from 'react';

import Avatar from '@atlaskit/avatar/avatar';
import { DropdownItem } from '@atlaskit/dropdown-menu/dropdown-item';
import { DropdownItemGroup } from '@atlaskit/dropdown-menu/dropdown-item-group';
import { DropdownMenu } from '@atlaskit/dropdown-menu/dropdown-menu';

const DropdownItemElemBeforeExample = (): React.JSX.Element => {
	return (
		<DropdownMenu trigger="Open" shouldRenderToParent>
			<DropdownItemGroup>
				<DropdownItem elemBefore={<Avatar size="small" />}>Kelly</DropdownItem>
				<DropdownItem elemBefore={<Avatar size="small" />}>Matt</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
};

export default DropdownItemElemBeforeExample;
