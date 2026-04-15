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
				isMulti
				isDisabled={true}
				defaultValue={[exampleOptions[27], exampleOptions[37]]}
			/>
		</IntlProvider>
	);
};
export default Example;
