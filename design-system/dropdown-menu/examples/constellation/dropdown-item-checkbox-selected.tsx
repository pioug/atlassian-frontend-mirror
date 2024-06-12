import React, { useState } from 'react';

import DropdownMenu, { DropdownItemCheckbox, DropdownItemCheckboxGroup } from '../../src';

const DropdownItemCheckboxExample = () => {
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
					onClick={(e) => toggle('todo')}
					isSelected={checked['todo']}
				>
					To do
				</DropdownItemCheckbox>
				<DropdownItemCheckbox
					id="inprogress"
					onClick={(e) => toggle('inprogress')}
					isSelected={checked['inprogress']}
				>
					In progress
				</DropdownItemCheckbox>
				<DropdownItemCheckbox
					id="done"
					onClick={(e) => toggle('done')}
					isSelected={checked['done']}
				>
					Done
				</DropdownItemCheckbox>
			</DropdownItemCheckboxGroup>
		</DropdownMenu>
	);
};

export default DropdownItemCheckboxExample;
