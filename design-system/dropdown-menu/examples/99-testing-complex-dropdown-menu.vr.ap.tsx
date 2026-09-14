import React from 'react';

import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItemRadio from '@atlaskit/dropdown-menu/dropdown-item-radio';
import DropdownItemRadioGroup from '@atlaskit/dropdown-menu/dropdown-item-radio-group';

const DropdownMenuRadio = (): React.JSX.Element => (
	<DropdownMenu trigger="Filter cities" testId="lite-mode-ddm" shouldRenderToParent isOpen>
		<DropdownItemRadioGroup id="cities" title="Some cities">
			<DropdownItemRadio id="sydney">Sydney</DropdownItemRadio>
			<DropdownItemRadio id="melbourne" defaultSelected>
				Melbourne
			</DropdownItemRadio>
		</DropdownItemRadioGroup>

		<DropdownItemRadioGroup id="other-cities" title="Some other cities">
			<DropdownItemRadio id="adelaide" defaultSelected>
				Adelaide
			</DropdownItemRadio>
			<DropdownItemRadio id="melbourne1">Melbourne</DropdownItemRadio>
			<DropdownItemRadio id="perth">Perth</DropdownItemRadio>
		</DropdownItemRadioGroup>
	</DropdownMenu>
);

export default DropdownMenuRadio;
