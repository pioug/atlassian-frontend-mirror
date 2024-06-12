import React from 'react';

import DropdownMenu, { DropdownItemCheckbox, DropdownItemCheckboxGroup } from '../src';

const DropdownMenuMultipleCheckboxGroup = () => (
	<DropdownMenu trigger="Choices" testId="lite-mode-ddm" shouldRenderToParent>
		<DropdownItemCheckboxGroup id="cities" title="Some cities">
			<DropdownItemCheckbox id="sydney">Sydney</DropdownItemCheckbox>
			<DropdownItemCheckbox id="melbourne" defaultSelected>
				Melbourne
			</DropdownItemCheckbox>
		</DropdownItemCheckboxGroup>

		<DropdownItemCheckboxGroup id="other-cities" title="Some other cities">
			<DropdownItemCheckbox id="adelaide" defaultSelected>
				Adelaide
			</DropdownItemCheckbox>
			<DropdownItemCheckbox id="melbourne">Melbourne</DropdownItemCheckbox>
		</DropdownItemCheckboxGroup>
	</DropdownMenu>
);

export default DropdownMenuMultipleCheckboxGroup;
