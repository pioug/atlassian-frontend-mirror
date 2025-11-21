import React from 'react';

import Button from '@atlaskit/button/new';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import { PopupSelect } from '@atlaskit/select';

const options = [
	{
		label: 'States',
		options: [
			{ label: 'Adelaide', value: 'adelaide' },
			{ label: 'Brisbane', value: 'brisbane' },
			{ label: 'Melbourne', value: 'melbourne' },
			{ label: 'Perth', value: 'perth' },
			{ label: 'Sydney', value: 'sydney' },
			{ label: 'Hobart', value: 'hobart' },
		],
	},
	{
		label: 'Territories',
		options: [
			{ label: 'Canberra', value: 'canberra' },
			{ label: 'Darwin', value: 'darwin' },
		],
	},
];

const PopupSelectExample = (): React.JSX.Element => {
	return (
		<PopupSelect
			searchThreshold={10}
			placeholder="Choose a city"
			options={options}
			popperProps={{ placement: 'right-start' }}
			target={({ isOpen, ...triggerProps }) => (
				<Button {...triggerProps} isSelected={isOpen} iconAfter={ChevronDownIcon}>
					Open
				</Button>
			)}
		/>
	);
};

export default PopupSelectExample;
