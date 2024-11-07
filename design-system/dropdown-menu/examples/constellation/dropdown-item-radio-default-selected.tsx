import React from 'react';

import DropdownMenu, { DropdownItemRadio, DropdownItemRadioGroup } from '@atlaskit/dropdown-menu';

const DropdownItemRadioExample = () => {
	return (
		<DropdownMenu trigger="Views" shouldRenderToParent>
			<DropdownItemRadioGroup title="Views" id="actions">
				<DropdownItemRadio id="detail" defaultSelected>
					Detail view
				</DropdownItemRadio>
				<DropdownItemRadio id="list">List view</DropdownItemRadio>
			</DropdownItemRadioGroup>
		</DropdownMenu>
	);
};

export default DropdownItemRadioExample;
