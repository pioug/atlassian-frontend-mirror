import React from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/default/button';
import Form from '@atlaskit/form/form';
import Field from '@atlaskit/form/field';
import { FormFooter } from '@atlaskit/form/form-footer';
import { FormHeader } from '@atlaskit/form/form-header';
import { RequiredAsterisk } from '@atlaskit/form/required-asterisk';
import { Flex } from '@atlaskit/primitives/compiled';
import RadioGroup from '@atlaskit/radio/radio-group';
import TextField from '@atlaskit/textfield/text-field';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createUser = async (data: { name: string; email: string }) => {
	await sleep(500);
	const errors = {
		name: !data.name ? 'Enter a name' : undefined,
		email: !data.email.includes('@')
			? 'Enter a valid email address. For example: lpeters@atlassian.com'
			: undefined,
	};
	if (!errors.name && !errors.email) {
		console.log(data);
	}
	return errors;
};

const FormSubmissionValidationExample = (): React.JSX.Element => {
	const handleSubmit = (data: { name: string; email: string }) => {
		return createUser(data);
	};

	return (
		<Flex direction="column">
			<Form onSubmit={handleSubmit}>
				{({ formProps }) => (
					<form noValidate {...formProps}>
						<FormHeader title="Add permissions">
							<p aria-hidden="true">
								Required fields are marked with an asterisk <RequiredAsterisk />
							</p>
						</FormHeader>
						<Field
							name="name"
							label="Name"
							defaultValue=""
							isRequired
							component={({ fieldProps }) => <TextField {...fieldProps} />}
						/>
						<Field
							name="email"
							label="Email"
							defaultValue=""
							isRequired
							helperMessage="Must contain an @ symbol."
							component={({ fieldProps }) => <TextField {...fieldProps} />}
						/>
						<Field
							name="permissions"
							label="Permissions"
							component={({ fieldProps: { value, ...others } }) => (
								<RadioGroup
									options={[
										{ name: 'permissions', value: 'view', label: 'View only' },
										{
											name: 'permissions',
											value: 'edit',
											label: 'Edit',
										},
										{ name: 'permissions', value: 'admin', label: 'Admin' },
									]}
									value={value}
									{...others}
								/>
							)}
						/>
						<FormFooter align="start">
							<ButtonGroup label="Form submit options">
								<Button appearance="primary" id="create-repo-button" type="submit">
									Add
								</Button>
								<Button appearance="subtle" id="create-repo-cancel">
									Cancel
								</Button>
							</ButtonGroup>
						</FormFooter>
					</form>
				)}
			</Form>
		</Flex>
	);
};

export default FormSubmissionValidationExample;
