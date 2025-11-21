import { Flex } from '@atlaskit/primitives/compiled';
import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import UserPicker from '../src';

const Example = (): React.JSX.Element => {
	return (
		<IntlProvider locale="en">
			<Flex gap="space.200" alignItems="center">
				<ExampleWrapper>
					{({ options, onInputChange }) => (
						<UserPicker
							fieldId="example"
							isMulti
							onInputChange={onInputChange}
							options={options}
							placeholder={'Options with a header'}
							header={
								<div>
									<h3>Menu header</h3>
								</div>
							}
							autoFocus
						/>
					)}
				</ExampleWrapper>
				<ExampleWrapper>
					{({ options, onInputChange }) => (
						<UserPicker
							fieldId="example"
							isMulti
							onInputChange={onInputChange}
							placeholder={'No option with a header'}
							header={
								<div>
									<h3>Menu header</h3>
								</div>
							}
							autoFocus
						/>
					)}
				</ExampleWrapper>
			</Flex>
		</IntlProvider>
	);
};
export default Example;
