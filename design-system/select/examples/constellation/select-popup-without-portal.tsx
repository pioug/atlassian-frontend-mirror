import React from 'react';

import Button from '@atlaskit/button/new';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import { PopupSelect } from '@atlaskit/select';

const options = [
	{ label: 'accessibility', value: 'accessibility' },
	{ label: 'analytics', value: 'analytics' },
	{ label: 'ktlo', value: 'ktlo' },
	{ label: 'testing', value: 'testing' },
	{ label: 'regression', value: 'regression' },
	{ label: 'layering', value: 'layering' },
	{ label: 'innovation', value: 'innovation' },
	{ label: 'new-feature', value: 'new' },
	{ label: 'existing', value: 'existing' },
	{ label: 'wont-do', value: 'wont-do' },
];

const PopupSelectWithoutPortalExample = () => {
	return (
		<PopupSelect
			placeholder="Search labels..."
			searchThreshold={10}
			options={options}
			popperProps={{ strategy: 'fixed' }}
			target={({ isOpen, ...triggerProps }) => (
				<Button {...triggerProps} iconAfter={ChevronDownIcon}>
					Label
				</Button>
			)}
		/>
	);
};

export default PopupSelectWithoutPortalExample;
