import React from 'react';

import DropdownItemCheckbox from '@atlaskit/dropdown-menu/dropdown-item-checkbox';
import DropdownItemCheckboxGroup from '@atlaskit/dropdown-menu/dropdown-item-checkbox-group';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import __noop from '@atlaskit/ds-lib/noop';

const DropdownMenuCheckbox = (): React.JSX.Element => (
	<DropdownMenu trigger="Choices" onOpenChange={__noop} testId="lite-mode-ddm" shouldRenderToParent>
		<DropdownItemCheckboxGroup id="cities" title="Some cities">
			<DropdownItemCheckbox id="sydney">Sydney</DropdownItemCheckbox>

			<DropdownItemCheckbox id="melbourne" defaultSelected>
				Melbourne
			</DropdownItemCheckbox>
		</DropdownItemCheckboxGroup>
	</DropdownMenu>
);

export default DropdownMenuCheckbox;
