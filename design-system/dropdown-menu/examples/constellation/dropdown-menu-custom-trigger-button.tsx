import React from 'react';

import IconButton from '@atlaskit/button/icon/button';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import ShowMoreIcon from '@atlaskit/icon/core/show-more-horizontal';

const DropdownMenuCustomTriggerButtonExample = (): React.JSX.Element => {
	return (
		<DropdownMenu<HTMLButtonElement>
			trigger={({ triggerRef, ...props }) => (
				<IconButton {...props} icon={ShowMoreIcon} label="more" ref={triggerRef} />
			)}
			shouldRenderToParent
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

export default DropdownMenuCustomTriggerButtonExample;
