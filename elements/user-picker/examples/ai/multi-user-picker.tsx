import React from 'react';

import { UserPicker } from '@atlaskit/user-picker/components/user-picker';
import type { OptionData } from '@atlaskit/user-picker/types';
import type { Value } from '@atlaskit/user-picker/types';

const options: OptionData[] = [
	{ id: 'account-123', name: 'Avery Chen', type: 'user' },
	{ id: 'account-456', name: 'Jordan Lee', type: 'user' },
	{ id: 'account-789', name: 'Morgan Patel', type: 'user' },
];

export default function MultiUserPickerExample(): React.JSX.Element {
	const [value, setValue] = React.useState<Value>([]);
	const names = Array.isArray(value) ? value.map((person) => person.name).join(', ') : '';

	return (
		<div>
			<label htmlFor="reviewers">Reviewers</label>
			<UserPicker
				fieldId="issue-reviewers"
				inputId="reviewers"
				ariaLabel="Reviewers"
				isMulti
				options={options}
				value={value}
				onChange={setValue}
			/>
			<p role="status">Selected reviewers: {names || 'None'}</p>
		</div>
	);
}
