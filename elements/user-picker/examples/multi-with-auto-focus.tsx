import React from 'react';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import UserPicker from '../src';

const Example = (): React.JSX.Element => {
	return (
		<ExampleWrapper>
			{({ options, onInputChange, onSelection }) => (
				<UserPicker
					fieldId="example"
					options={options}
					onChange={console.log}
					onInputChange={onInputChange}
					onSelection={onSelection}
					defaultValue={options.slice(0, 2)}
					autoFocus
					isMulti
				/>
			)}
		</ExampleWrapper>
	);
};
export default Example;
