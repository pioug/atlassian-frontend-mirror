import React from 'react';

import Button from '@atlaskit/button/new';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';

import { PopupSelect } from '../../src';

const options = [
	{ label: 'Blocked', value: 'blocked' },
	{ label: 'Gathering interest', value: 'gathering' },
	{ label: 'To do', value: 'todo' },
	{ label: 'Ready for sprint', value: 'ready' },
	{ label: 'In progress', value: 'progress' },
	{ label: 'Cancelled', value: 'cancelled' },
];

const PopupSelectExample = () => {
	return (
		<PopupSelect
			searchThreshold={10}
			value={options[2]}
			options={options}
			target={({ isOpen, ...triggerProps }) => (
				<Button {...triggerProps} iconAfter={ChevronDownIcon}>
					To do
				</Button>
			)}
		/>
	);
};

export default PopupSelectExample;
