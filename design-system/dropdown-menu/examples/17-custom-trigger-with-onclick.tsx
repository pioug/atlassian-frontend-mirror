import React, { useState } from 'react';

import Button from '@atlaskit/button/new';

import DropdownMenu, { DropdownItem, DropdownItemGroup, type OnOpenChangeArgs } from '../src';

const DropdownMenuCustomTriggerWithOnClick = () => {
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
