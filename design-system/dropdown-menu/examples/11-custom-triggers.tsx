import React from 'react';

import Button from '@atlaskit/button/default/button';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import MoreIcon from '@atlaskit/icon/core/show-more-horizontal';

const DropdownMenuCustomTrigger = (): React.JSX.Element => {
	return (
		<DropdownMenu<HTMLButtonElement>
			placement="bottom-end"
			testId="lite-mode-ddm"
			shouldRenderToParent
			trigger={({ triggerRef, ...triggerProps }) => (
				<Button ref={triggerRef} {...triggerProps} iconBefore={MoreIcon}>
					Click to open
				</Button>
			)}
		>
			<DropdownItemGroup>
				<DropdownItem>Move</DropdownItem>
				<DropdownItem>Clone</DropdownItem>
				<DropdownItem>Delete</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
};

export default DropdownMenuCustomTrigger;
