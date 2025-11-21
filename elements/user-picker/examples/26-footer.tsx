import Button from '@atlaskit/button/new';
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
							placeholder={'Options with a footer'}
							footer={
								<div>
									<Button appearance="primary">Have a nice day!</Button>
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
							placeholder={'No option with a footer'}
							footer={
								<div>
									<Button appearance="primary">Have a nice day!</Button>
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
