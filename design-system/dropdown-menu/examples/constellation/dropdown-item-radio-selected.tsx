import React, { useState } from 'react';

import DropdownItemRadio from '@atlaskit/dropdown-menu/dropdown-item-radio';
import DropdownItemRadioGroup from '@atlaskit/dropdown-menu/dropdown-item-radio-group';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';

const DropdownItemRadioExample = (): React.JSX.Element => {
	const [selected, setSelected] = useState<string>('detail');

	return (
		<DropdownMenu trigger="Views" shouldRenderToParent>
			<DropdownItemRadioGroup title="Views" id="actions">
				<DropdownItemRadio
					id="detail"
					onClick={() => setSelected('detail')}
					isSelected={selected === 'detail'}
				>
					Detail view
				</DropdownItemRadio>
				<DropdownItemRadio
					id="list"
					onClick={() => setSelected('list')}
					isSelected={selected === 'list'}
				>
					List view
				</DropdownItemRadio>
			</DropdownItemRadioGroup>
		</DropdownMenu>
	);
};

export default DropdownItemRadioExample;
