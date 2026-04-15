import React from 'react';
import { IntlProvider } from 'react-intl';
import { exampleOptions } from '../example-helpers';
import UserPicker from '../src';

const Example = (): React.JSX.Element => {
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
