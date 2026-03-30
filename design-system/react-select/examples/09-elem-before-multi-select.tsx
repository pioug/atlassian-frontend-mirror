import React from 'react';

import { Label } from '@atlaskit/form';
import PersonIcon from '@atlaskit/icon/core/person';
import Select from '@atlaskit/react-select';

import { cities } from './common/data';

// Example showing elemBefore in multi-select
// The elemBefore appears in both the tags (via auto-rendering) and dropdown menu
const ElemBeforeMultiSelectExample = (): React.JSX.Element => {
	const optionsWithIcon = cities.map((option) => ({
		...option,
		elemBefore: <PersonIcon label={option.label} size="small" />,
	}));

	return (
		<>
			<Label htmlFor="elem-before-multi-select">Select cities with icons:</Label>
			<Select
				inputId="elem-before-multi-select"
				testId="react-select-elem-before"
				options={optionsWithIcon}
				isMulti
				placeholder="Choose cities..."
			/>
		</>
	);
};

export default ElemBeforeMultiSelectExample;
