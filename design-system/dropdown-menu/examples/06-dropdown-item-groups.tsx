import React from 'react';

import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItemCheckbox from '@atlaskit/dropdown-menu/dropdown-item-checkbox';
import DropdownItemCheckboxGroup from '@atlaskit/dropdown-menu/dropdown-item-checkbox-group';

const DropdownMenuMultipleCheckboxGroup = (): React.JSX.Element => (
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
