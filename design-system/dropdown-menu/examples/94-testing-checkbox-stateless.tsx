import React, { useState } from 'react';

import DropdownItemCheckbox from '@atlaskit/dropdown-menu/dropdown-item-checkbox';
import DropdownItemCheckboxGroup from '@atlaskit/dropdown-menu/dropdown-item-checkbox-group';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';

const DropdownMenuCheckboxStateless = (): React.JSX.Element => {
	const [selected, setSelected] = useState<string[]>([]);

	const selectOption = (option: string) => {
		if (selected.includes(option)) {
			setSelected(selected.filter((x) => x !== option));
		} else {
			setSelected([...selected, option]);
		}
	};

	return (
		<DropdownMenu trigger="Choices" testId="lite-mode-ddm" shouldRenderToParent>
			<DropdownItemCheckboxGroup id="cities" title="Some cities">
				<DropdownItemCheckbox
					id="sydney"
					isSelected={selected.includes('sydney')}
					onClick={() => {
						selectOption('sydney');
					}}
				>
					Sydney
				</DropdownItemCheckbox>

				<DropdownItemCheckbox
					id="melbourne"
					isSelected={selected.includes('melbourne')}
					onClick={() => {
						selectOption('melbourne');
					}}
				>
					Melbourne
				</DropdownItemCheckbox>
			</DropdownItemCheckboxGroup>
		</DropdownMenu>
	);
};

export default DropdownMenuCheckboxStateless;
