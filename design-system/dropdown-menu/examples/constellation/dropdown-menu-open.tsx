import React, { useState } from 'react';

import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItemRadio from '@atlaskit/dropdown-menu/dropdown-item-radio';
import DropdownItemRadioGroup from '@atlaskit/dropdown-menu/dropdown-item-radio-group';
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
