import React from 'react';

import Button from '@atlaskit/button/new';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import { CheckboxOption, PopupSelect } from '@atlaskit/select';
const options = [
	{
		label: 'Standard work types',
		options: [
			{ label: 'Epic', value: 'epic' },
			{ label: 'Initiative', value: 'initiative' },
			{ label: 'Task', value: 'task' },
		],
	},
	{
		label: 'Sub-task work types',
		options: [
			{ label: 'Feature', value: 'feature' },
			{ label: 'Bug', value: 'bug' },
		],
	},
];

const PopupSelectExample = (): React.JSX.Element => {
	return (
		<PopupSelect
			components={{ Option: CheckboxOption }}
			options={options}
			closeMenuOnSelect={false}
			hideSelectedOptions={false}
			isMulti
			label="Filter work types"
			placeholder="Filter work types..."
			target={({ isOpen, ...triggerProps }) => (
				<Button {...triggerProps} isSelected={isOpen} iconAfter={ChevronDownIcon}>
					Type
				</Button>
			)}
		/>
	);
};

export default PopupSelectExample;
