import React from 'react';

import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox/checkbox';
import { CheckboxField } from '@atlaskit/form/checkbox-field';
import Field from '@atlaskit/form/field';
import Form from '@atlaskit/form/form';
import { FormFooter } from '@atlaskit/form/form-footer';
import { FormHeader } from '@atlaskit/form/form-header';
import TextField from '@atlaskit/textfield/text-field';

const Example = (): React.JSX.Element => (
	<Form onSubmit={(data) => console.log('validated form', data)}>
		<FormHeader title="Basic Form">
			<p>Fill out the form below</p>
		</FormHeader>
		<Field
			name="username"
			label="Username"
			isRequired
			validate={(value) =>
				value && value.length < 3 ? 'Username must be at least 3 characters' : undefined
			}
			component={({ fieldProps }) => <TextField {...fieldProps} />}
		/>
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
