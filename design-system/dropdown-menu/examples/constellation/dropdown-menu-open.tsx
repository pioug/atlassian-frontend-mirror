import React, { useState } from 'react';

import DropdownMenu, { DropdownItemRadio, DropdownItemRadioGroup } from '@atlaskit/dropdown-menu';
import { type OnOpenChangeArgs } from '@atlaskit/dropdown-menu/types';

const DropdownOpenExample = (): React.JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<DropdownMenu
			isOpen={isOpen}
			onOpenChange={(attrs: OnOpenChangeArgs) => {
				setIsOpen(attrs.isOpen);
			}}
			trigger="Page actions"
			shouldRenderToParent
		>
			<DropdownItemRadioGroup id="actions">
				<DropdownItemRadio id="edit">Edit</DropdownItemRadio>
				<DropdownItemRadio id="move">Move</DropdownItemRadio>
			</DropdownItemRadioGroup>
		</DropdownMenu>
	);
};

export default DropdownOpenExample;
