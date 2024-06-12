import React, { Fragment } from 'react';

import Button from '@atlaskit/button/new';
import Form, { Field, FormFooter } from '@atlaskit/form';

import Textfield from '../../src';

export default function TextFieldFormNativeValidationExample() {
	return (
		<Form onSubmit={(formData) => console.log('form data', formData)}>
			{({ formProps }) => (
				<form {...formProps} name="native-validation-example">
					<Field
						label="Input must contain less than 20 characters"
						name="command"
						isRequired
						defaultValue=""
					>
						{({ fieldProps }: any) => (
							<Fragment>
								<Textfield
									{...fieldProps}
									pattern=".{0,20}"
									data-testid="nativeFormValidationTest"
								/>
							</Fragment>
						)}
					</Field>
					<Field label="Input must be numeric" name="number" isRequired defaultValue="">
						{({ fieldProps }: any) => (
							<Fragment>
								<Textfield
									{...fieldProps}
									type="number"
									data-testid="nativeFormValidationTestNumber"
								/>
							</Fragment>
						)}
					</Field>
					<Field label="Input must be an email" name="email" isRequired defaultValue="">
						{({ fieldProps }: any) => (
							<Fragment>
								<Textfield
									{...fieldProps}
									type="email"
									data-testid="nativeFormValidationTestEmail"
								/>
							</Fragment>
						)}
					</Field>
					<Field label="Password must not be empty" name="password" isRequired defaultValue="">
						{({ fieldProps }: any) => (
							<Fragment>
								<Textfield
									{...fieldProps}
									type="password"
									data-testid="nativeFormValidationTestPassword"
								/>
							</Fragment>
						)}
					</Field>
					<FormFooter>
						<Button type="submit" appearance="primary">
							Submit
						</Button>
					</FormFooter>
				</form>
			)}
		</Form>
	);
}
