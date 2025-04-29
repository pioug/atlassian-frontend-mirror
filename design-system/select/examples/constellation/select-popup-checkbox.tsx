import React from 'react';

import Button from '@atlaskit/button/new';
import ChevronDownIcon from '@atlaskit/icon/utility/migration/chevron-down';
import { CheckboxOption, PopupSelect } from '@atlaskit/select';
const options = [
	{
		label: 'Standard issue types',
		options: [
			{ label: 'Epic', value: 'epic' },
			{ label: 'Initiative', value: 'initiative' },
			{ label: 'Task', value: 'task' },
		],
	},
	{
		label: 'Sub-task issue types',
		options: [
			{ label: 'Feature', value: 'feature' },
			{ label: 'Bug', value: 'bug' },
		],
	},
];

const PopupSelectExample = () => {
	return (
		<PopupSelect
			components={{ Option: CheckboxOption }}
			options={options}
			closeMenuOnSelect={false}
			hideSelectedOptions={false}
			isMulti
			label="Filter issue types"
			placeholder="Filter issue types..."
			target={({ isOpen, ...triggerProps }) => (
				<Button {...triggerProps} isSelected={isOpen} iconAfter={ChevronDownIcon}>
					Type
				</Button>
			)}
		/>
	);
};

export default PopupSelectExample;
