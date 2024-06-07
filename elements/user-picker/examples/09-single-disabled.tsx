import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { exampleOptions } from '../example-helpers';
import UserPicker from '../src';

const Example = () => {
	return (
		<IntlProvider locale="en">
			<UserPicker
				fieldId="example"
				options={exampleOptions}
				isDisabled={true}
				value={exampleOptions[0]}
			/>
		</IntlProvider>
	);
};
export default Example;
