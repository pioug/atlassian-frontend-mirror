import React from 'react';

import Button from '@atlaskit/button/new';
import Form, { Field, FormFooter, FormHeader, RequiredAsterisk } from '@atlaskit/form';
import { Flex } from '@atlaskit/primitives/compiled';
import TextField from '@atlaskit/textfield';

export default () => (
	<Flex direction="column">
		<Form onSubmit={(data) => console.log(data)} name="text-fields">
			<FormHeader title="Enter your name">
				<p aria-hidden="true">
					Required fields are marked with an asterisk <RequiredAsterisk />
				</p>
			</FormHeader>
			<Field name="firstname" defaultValue="" label="First name" isRequired>
				{({ fieldProps }) => <TextField autoComplete="given-name" {...fieldProps} />}
			</Field>
			<FormFooter align="start">
				<Button type="submit" appearance="primary">
					Submit
				</Button>
			</FormFooter>
		</Form>
	</Flex>
);
