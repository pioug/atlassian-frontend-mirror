import React from 'react';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import type { Email } from '../src';
import UserPicker from '../src';

const Example = (): React.JSX.Element => {
	const options: Email[] = ['spiderman', 'hulk', 'thor']
		.map((hero) => `${hero}@avengers.com`)
		.map((email, index) => ({
			id: email,
			name: email,
			type: 'email',
			isPendingAction: index % 2 === 0,
		}));

	return (
		<ExampleWrapper>
			{({ onInputChange, onSelection }) => (
				<UserPicker
					fieldId="example"
					onChange={console.log}
					onInputChange={onInputChange}
					onSelection={onSelection}
					isMulti
					maxPickerHeight={120}
					options={options}
					autoFocus
				/>
			)}
		</ExampleWrapper>
	);
};
export default Example;
