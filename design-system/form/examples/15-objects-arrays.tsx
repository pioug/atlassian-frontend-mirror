import React from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import Form, { Field, FormFooter, FormHeader, RequiredAsterisk } from '@atlaskit/form';
import { Flex } from '@atlaskit/primitives/compiled';
import TextField from '@atlaskit/textfield';

export default () => (
	<Flex direction="column">
		<Form<{ username: string; password: string; remember: boolean }>
			onSubmit={(data) => {
				console.log('form data', data);
			}}
		>
			{({ formProps, submitting }) => (
				<form {...formProps}>
					<FormHeader title="Register your interest">
						<p aria-hidden="true">
							Required fields are marked with an asterisk <RequiredAsterisk />
						</p>
					</FormHeader>
					<Field
						name="username.name"
						label="User name"
						isRequired
						defaultValue="Mike Cannon-Brookes"
						component={({ fieldProps }) => <TextField autoComplete="username" {...fieldProps} />}
					/>
					<Field
						name="username.email"
						label="Email"
						isRequired
						defaultValue="mike@atlassian.com"
						component={({ fieldProps }) => <TextField {...fieldProps} />}
					/>
					<Field
						name="address[0]"
						label="Address 1"
						isRequired
						defaultValue=""
						component={({ fieldProps }) => <TextField {...fieldProps} />}
					/>
					<Field
						name="address[1]"
						label="Address 2"
						isRequired
						defaultValue=""
						component={({ fieldProps }) => <TextField {...fieldProps} />}
					/>
					<Field
						name="address[2]"
						label="Address 3"
						isRequired
						defaultValue=""
						component={({ fieldProps }) => <TextField {...fieldProps} />}
					/>
					<FormFooter>
						<ButtonGroup label="Form submit options">
							<Button appearance="subtle">Cancel</Button>
							<Button type="submit" appearance="primary" isLoading={submitting}>
								Sign up
							</Button>
						</ButtonGroup>
					</FormFooter>
				</form>
			)}
		</Form>
	</Flex>
);
