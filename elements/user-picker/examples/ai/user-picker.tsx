import React from 'react';

import { UserPicker } from '@atlaskit/user-picker/components/user-picker';
import type { OptionData } from '@atlaskit/user-picker/types';
import type { Value } from '@atlaskit/user-picker/types';

const options: OptionData[] = [
	{ id: 'account-123', name: 'Avery Chen', type: 'user' },
	{ id: 'account-456', name: 'Jordan Lee', type: 'user' },
];

export default function UserPickerExample(): React.JSX.Element {
	const [value, setValue] = React.useState<Value>(null);
	const [selected, setSelected] = React.useState('No assignee selected');

	return (
		<div>
			<label htmlFor="issue-assignee">Assignee</label>
			<UserPicker
				fieldId="issue-assignee"
				inputId="issue-assignee"
				ariaLabel="Assignee"
				options={options}
				value={value}
				onChange={(nextValue) => {
					setValue(nextValue);
					setSelected(
						nextValue && !Array.isArray(nextValue) ? nextValue.name : 'No assignee selected',
					);
				}}
			/>
			<p role="status">{selected}</p>
		</div>
	);
}
