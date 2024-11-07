import React from 'react';

import DropdownMenu, { DropdownItemRadio, DropdownItemRadioGroup } from '@atlaskit/dropdown-menu';

const DropdownMenuRadio = () => (
	<DropdownMenu trigger="Choices" testId="lite-mode-ddm" shouldRenderToParent>
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

			<DropdownItemRadio id="melbourne">Melbourne</DropdownItemRadio>

			<DropdownItemRadio id="perth">Perth</DropdownItemRadio>
		</DropdownItemRadioGroup>
	</DropdownMenu>
);

export default DropdownMenuRadio;
