import React, { useState } from 'react';

import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import { UserPicker } from '../src/components/UserPicker';
import { type OptionData } from '../src/types';

const Example = (): React.JSX.Element => {
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
					openMenuOnFocus={false}
				/>
			)}
		</ExampleWrapper>
	);
};
export default Example;
