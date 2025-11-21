import React from 'react';

import Button from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import MoreIcon from '@atlaskit/icon/glyph/more';

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
