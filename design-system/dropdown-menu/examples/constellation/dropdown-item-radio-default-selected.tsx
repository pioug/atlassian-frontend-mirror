import React from 'react';

import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItemRadio from '@atlaskit/dropdown-menu/dropdown-item-radio';
import DropdownItemRadioGroup from '@atlaskit/dropdown-menu/dropdown-item-radio-group';

const DropdownItemRadioExample = (): React.JSX.Element => {
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
