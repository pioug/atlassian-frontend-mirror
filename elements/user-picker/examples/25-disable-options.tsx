import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import UserPicker from '../src';

const Example = () => {
	return (
		<IntlProvider locale="en">
			<ExampleWrapper>
				{({ options, onInputChange }) => (
					<UserPicker
						fieldId="example"
						onInputChange={onInputChange}
						options={options.map((option, index) => {
							if (index > 3) {
								return option;
							}

							return { ...option, isDisabled: true };
						})}
						placeholder={'Some options are disabled (read only)'}
					/>
				)}
			</ExampleWrapper>
			<ExampleWrapper>
				{({ options, onInputChange }) => (
					<UserPicker
						fieldId="example"
						isMulti
						onInputChange={onInputChange}
						options={options.map((option, index) => {
							if (index % 2 === 1) {
								return option;
							}

							return { ...option, isDisabled: true };
						})}
						placeholder={'Some options are disabled (read only)'}
					/>
				)}
			</ExampleWrapper>
		</IntlProvider>
	);
};
export default Example;
