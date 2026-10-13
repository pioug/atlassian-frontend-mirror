import React from 'react';

import { PopupUserPicker } from '@atlaskit/user-picker/components/popup-user-picker';
import type { OptionData } from '@atlaskit/user-picker/types';
import type { Value } from '@atlaskit/user-picker/types';

const options: OptionData[] = [
	{ id: 'account-123', name: 'Avery Chen', type: 'user' },
	{ id: 'account-456', name: 'Jordan Lee', type: 'user' },
];

export default function PopupUserPickerExample(): React.JSX.Element {
	const [value, setValue] = React.useState<Value>(null);
	const [selectedName, setSelectedName] = React.useState('No owner selected');

	return (
		<div>
			<p id="owner-label">Project owner</p>
			<PopupUserPicker
				target={(props) => (
					<button ref={props.ref} type="button" aria-labelledby="owner-label">
						Choose owner
					</button>
				)}
				fieldId="project-owner"
				ariaLabel="Project owner"
				popupTitle="Choose a project owner"
				options={options}
				value={value}
				onChange={(nextValue) => {
					setValue(nextValue);
					setSelectedName(
						nextValue && !Array.isArray(nextValue) ? nextValue.name : 'No owner selected',
					);
				}}
			/>
			<p role="status">{selectedName}</p>
		</div>
	);
}
