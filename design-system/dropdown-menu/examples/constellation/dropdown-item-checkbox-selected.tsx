import React, { useState } from 'react';

import DropdownMenu, {
	DropdownItemCheckbox,
	DropdownItemCheckboxGroup,
} from '@atlaskit/dropdown-menu';

const DropdownItemCheckboxExample = (): React.JSX.Element => {
	const [checked, setChecked] = useState<Record<string, boolean>>({
		todo: true,
	});
	const toggle = (name: string) => {
		setChecked((prev) => ({
			...prev,
			[name]: !prev[name],
		}));
	};

	return (
		<DropdownMenu trigger="Status" shouldRenderToParent>
			<DropdownItemCheckboxGroup title="Categories" id="actions">
				<DropdownItemCheckbox
					id="todo"
					onClick={() => toggle('todo')}
					isSelected={checked['todo']}
				>
					To do
				</DropdownItemCheckbox>
				<DropdownItemCheckbox
					id="inprogress"
					onClick={() => toggle('inprogress')}
					isSelected={checked['inprogress']}
				>
					In progress
				</DropdownItemCheckbox>
				<DropdownItemCheckbox
					id="done"
					onClick={() => toggle('done')}
					isSelected={checked['done']}
				>
					Done
				</DropdownItemCheckbox>
			</DropdownItemCheckboxGroup>
		</DropdownMenu>
	);
};

export default DropdownItemCheckboxExample;
