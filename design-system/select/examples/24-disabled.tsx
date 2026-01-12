import React from 'react';

import { Label } from '@atlaskit/form';
import Select from '@atlaskit/select';

import { cities } from './common/data';

const DisabledSelects = (): React.JSX.Element => (
	<>
		<Label htmlFor="disabled-single">Disabled Single Select</Label>
		<Select
			inputId="disabled-single"
			isDisabled
			testId="react-select-single-disabled"
			options={[
				{ label: 'Brisbane', value: 'brisbane' },
				{ label: 'Canberra', value: 'canberra' },
				{ label: 'Melbourne', value: 'melbourne' },
				{ label: 'Sydney', value: 'sydney' },
			]}
			placeholder=""
		/>
		<Label htmlFor="disabled-multi">Disabled Multi Select</Label>
		<Select
			inputId="disabled-multi"
			isDisabled
			testId="react-select-multi-disabled"
			options={[
				{ label: 'Brisbane', value: 'brisbane' },
				{ label: 'Canberra', value: 'canberra' },
				{ label: 'Melbourne', value: 'melbourne' },
				{ label: 'Sydney', value: 'sydney' },
			]}
			isMulti
			isSearchable={false}
			placeholder=""
		/>
		<Label htmlFor="disabled-options-single">Single Select with disabled options</Label>
		<Select
			inputId="disabled-options-single"
			testId="react-select-single-disabled-options"
			options={[
				{ label: 'Brisbane', value: 'brisbane', isDisabled: true },
				{ label: 'Canberra', value: 'canberra' },
				{ label: 'Melbourne', value: 'melbourne' },
				{ label: 'Sydney', value: 'sydney' },
			]}
			placeholder=""
		/>
		<Label htmlFor="disabled-options-multi">Multi Select with disabled options</Label>
		<Select
			inputId="disabled-options-multi"
			testId="react-select-multi-disabled-options"
			options={[
				{ label: 'Brisbane', value: 'brisbane' },
				{ label: 'Canberra', value: 'canberra', isDisabled: true },
				{ label: 'Melbourne', value: 'melbourne', isDisabled: true },
				{ label: 'Sydney', value: 'sydney' },
			]}
			isMulti
			isSearchable={false}
			placeholder=""
		/>
		<Label htmlFor="disabled-multi-clear">
			Disabled Multi Select showing selections have no "clear" icon
		</Label>
		<Select
			inputId="disabled-multi-clear"
			isDisabled
			testId="react-select"
			defaultValue={cities.slice(3, 5)}
			options={cities}
			isMulti
			isSearchable={false}
			placeholder=""
		/>
		<Label htmlFor="disabled-options-single-displayed">
			Single Select with disabled options displayed
		</Label>
		<Select
			inputId="disabled-options-single-displayed"
			menuIsOpen
			options={[
				{ label: 'Brisbane', value: 'brisbane', isDisabled: true },
				{ label: 'Canberra', value: 'canberra' },
				{ label: 'Melbourne', value: 'melbourne' },
				{ label: 'Sydney', value: 'sydney' },
			]}
			placeholder=""
		/>
	</>
);

export default DisabledSelects;
