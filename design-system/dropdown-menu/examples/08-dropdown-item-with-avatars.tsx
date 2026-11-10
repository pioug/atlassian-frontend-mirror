import React from 'react';

import Avatar from '@atlaskit/avatar/avatar';
import { DropdownItem } from '@atlaskit/dropdown-menu/dropdown-item';
import { DropdownItemGroup } from '@atlaskit/dropdown-menu/dropdown-item-group';
import { DropdownMenu } from '@atlaskit/dropdown-menu/dropdown-menu';

export default (): React.JSX.Element => (
	<DropdownMenu defaultOpen trigger="Assign to" shouldRenderToParent>
		<DropdownItemGroup>
			<DropdownItem elemBefore={<Avatar size="small" />}>Some text</DropdownItem>
			<DropdownItem elemBefore={<Avatar size="small" />}>Some text also</DropdownItem>
		</DropdownItemGroup>
	</DropdownMenu>
);
