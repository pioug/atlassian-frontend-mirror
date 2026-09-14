import React from 'react';

import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItemCheckbox from '@atlaskit/dropdown-menu/dropdown-item-checkbox';
import DropdownItemCheckboxGroup from '@atlaskit/dropdown-menu/dropdown-item-checkbox-group';

const DropdownItemCheckboxExample = (): React.JSX.Element => {
	return (
		<DropdownMenu trigger="Status" shouldRenderToParent>
			<DropdownItemCheckboxGroup title="Categories" id="actions">
				<DropdownItemCheckbox id="todo" defaultSelected>
					To do
				</DropdownItemCheckbox>
				<DropdownItemCheckbox id="inprogress">In progress</DropdownItemCheckbox>
				<DropdownItemCheckbox id="done">Done</DropdownItemCheckbox>
			</DropdownItemCheckboxGroup>
		</DropdownMenu>
	);
};

export default DropdownItemCheckboxExample;
