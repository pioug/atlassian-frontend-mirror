import React from 'react';

import Button from '@atlaskit/button/new';
import { PopupSelect } from '@atlaskit/select';

const options = [
	{ label: 'Adelaide', value: 'adelaide' },
	{ label: 'Brisbane', value: 'brisbane' },
	{ label: 'Canberra', value: 'canberra' },
	{ label: 'Darwin', value: 'darwin' },
	{ label: 'Hobart', value: 'hobart' },
	{ label: 'Melbourne', value: 'melbourne' },
	{ label: 'Perth', value: 'perth' },
	{ label: 'Sydney', value: 'sydney' },
];

export default (): React.JSX.Element => {
	return (
		<PopupSelect
			isSearchable={false}
			options={options}
			menuPlacement="bottom"
			popperProps={{
				modifiers: [
					{ name: 'offset', options: { offset: [0, 8] } },
					{
						name: 'preventOverflow',
						enabled: false,
					},
				],
			}}
			target={({ ref }) => (
				<Button ref={ref} testId="popup-trigger">
					Choose
				</Button>
			)}
			isOpen
		/>
	);
};
