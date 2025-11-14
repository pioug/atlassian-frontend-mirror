import React, { useState } from 'react';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import UserPicker, { type OptionData } from '../src';

const Example = () => {
	const [selectedUser, setSelectedUser] = useState<OptionData>();

	return (
		<ExampleWrapper>
			{({ options, onInputChange, onSelection }) => (
				<UserPicker
					fieldId="example"
					options={options}
					onChange={(option) => {
						if (option) {
							setSelectedUser(option as OptionData);
						}
					}}
					onInputChange={onInputChange}
					onSelection={onSelection}
					value={selectedUser}
				/>
			)}
		</ExampleWrapper>
	);
};
export default Example;
