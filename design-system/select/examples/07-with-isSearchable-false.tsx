/* eslint-disable @repo/internal/fs/filename-pattern-match */
import React from 'react';

import { Label } from '@atlaskit/form';
import { type AriaLiveMessages, type GroupBase } from '@atlaskit/react-select';
import Select from '@atlaskit/select';

interface Option {
	label: string;
	value: string;
}

const ariaLiveMessages: AriaLiveMessages<Option, boolean, GroupBase<Option>> = {
	onChange: (props) => {
		const { action, isDisabled, label } = props;
		if (action === 'select-option' && !isDisabled) {
			return `CUSTOM: option ${label} is selected.`;
		}
		return '';
	},
};

const SingleExample = (): React.JSX.Element => (
	<>
		<Label htmlFor="is-searchable-false-example">Which city do you live in?</Label>
		<Select
			inputId="is-searchable-false-example"
			options={[
				{ label: 'Adelaide', value: 'adelaide' },
				{ label: 'Brisbane', value: 'brisbane' },
				{ label: 'Canberra', value: 'canberra' },
				{ label: 'Darwin', value: 'darwin' },
				{ label: 'Hobart', value: 'hobart' },
				{ label: 'Melbourne', value: 'melbourne' },
				{ label: 'Perth', value: 'perth' },
				{ label: 'Sydney', value: 'sydney' },
			]}
			isSearchable={false}
			placeholder="Choose a City"
			ariaLiveMessages={ariaLiveMessages}
			testId="react-select"
		/>
	</>
);

export default SingleExample;
