import React from 'react';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import UserPicker from '../src';

const Example = () => {
	return (
		<ExampleWrapper>
			{({ options, onInputChange, onSelection }) => (
				<UserPicker
					fieldId="example"
					options={options}
					onChange={console.log}
					onInputChange={onInputChange}
					onSelection={onSelection}
					placeholderAvatar="team"
				/>
			)}
		</ExampleWrapper>
	);
};
export default Example;
