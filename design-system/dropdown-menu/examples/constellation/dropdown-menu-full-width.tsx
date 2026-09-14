import React from 'react';

import Button from '@atlaskit/button/default/button';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';

const DropdownMenuFullWidth = (): React.JSX.Element => {
	return (
		<DropdownMenu<HTMLButtonElement>
			shouldFitContainer
			shouldRenderToParent
			trigger={({ triggerRef, ...triggerProps }) => (
				<Button ref={triggerRef} {...triggerProps} shouldFitContainer>
					Page actions
				</Button>
			)}
		>
			<DropdownItemGroup>
				<DropdownItem>Edit</DropdownItem>
				<DropdownItem>Share</DropdownItem>
				<DropdownItem>Move</DropdownItem>
				<DropdownItem>Clone</DropdownItem>
				<DropdownItem>Delete</DropdownItem>
				<DropdownItem>Report</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
};

export default DropdownMenuFullWidth;
