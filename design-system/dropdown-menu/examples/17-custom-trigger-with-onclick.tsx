import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import type { OnOpenChangeArgs } from '@atlaskit/dropdown-menu/types';

const DropdownMenuCustomTriggerWithOnClick = (): React.JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);

	const onClick = () => {
		console.log('Custom trigger clicked');
		setIsOpen(!isOpen);
	};

	return (
		<DropdownMenu<HTMLButtonElement>
			placement="bottom-end"
			testId="lite-mode-ddm"
			shouldRenderToParent
			trigger={({ triggerRef, ...triggerProps }) => {
				return (
					<Button ref={triggerRef} {...triggerProps} onClick={onClick}>
						Click to open
					</Button>
				);
			}}
			isOpen={isOpen}
			onOpenChange={(attrs: OnOpenChangeArgs) => {
				setIsOpen(attrs.isOpen);
			}}
		>
			<DropdownItemGroup>
				<DropdownItem>Move</DropdownItem>
				<DropdownItem>Clone</DropdownItem>
				<DropdownItem>Delete</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
};

export default DropdownMenuCustomTriggerWithOnClick;
