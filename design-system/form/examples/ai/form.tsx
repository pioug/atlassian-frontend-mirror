import React from 'react';

import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import Form, { CheckboxField, ErrorMessage, Field, FormFooter, FormHeader } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';

const Example = (): React.JSX.Element => (
	<Form onSubmit={(data) => console.log('validated form', data)}>
		<FormHeader title="Basic Form">
			<p>Fill out the form below</p>
		</FormHeader>
		<Field
			name="username"
			label="Username"
			isRequired
			validate={(value) => (value && value.length < 3 ? 'Too short' : undefined)}
		>
			{({ fieldProps, error }) => (
				<>
					<TextField {...fieldProps} />
					{error && <ErrorMessage>Username must be at least 3 characters</ErrorMessage>}
				</>
			)}
		</Field>
		<CheckboxField name="terms" value="terms">
			{({ fieldProps }) => <Checkbox {...fieldProps} label="I accept the terms" />}
		</CheckboxField>
		<FormFooter>
			<Button type="submit" appearance="primary">
				Create Account
			</Button>
		</FormFooter>
	</Form>
);
export default Example;
