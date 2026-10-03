import React, { Fragment } from 'react';

import Button from '@atlaskit/button/default/button';
import Field from '@atlaskit/form/field';
import Form from '@atlaskit/form/form';
import { FormFooter } from '@atlaskit/form/form-footer';
import Textfield from '@atlaskit/textfield/text-field';

export default function TextFieldFormNativeValidationExample(): React.JSX.Element {
	return (
		<Form
			onSubmit={(formData) => console.log('form data', formData)}
			name="native-validation-example"
		>
			{/* eslint-disable-next-line @atlaskit/design-system/use-simple-field */}
			<Field
				label="Input must contain less than 20 characters"
				name="command"
				isRequired
				defaultValue=""
			>
				{({ fieldProps }: any) => (
					<Fragment>
						<Textfield {...fieldProps} pattern=".{0,20}" data-testid="nativeFormValidationTest" />
					</Fragment>
				)}
			</Field>
			{/* eslint-disable-next-line @atlaskit/design-system/use-simple-field */}
			<Field label="Input must be numeric" name="number" isRequired defaultValue="">
				{({ fieldProps }: any) => (
					<Fragment>
						<Textfield {...fieldProps} type="number" data-testid="nativeFormValidationTestNumber" />
					</Fragment>
				)}
			</Field>
			{/* eslint-disable-next-line @atlaskit/design-system/use-simple-field */}
			<Field label="Input must be an email" name="email" isRequired defaultValue="">
				{({ fieldProps }: any) => (
					<Fragment>
						<Textfield
							{...fieldProps}
							type="email"
							data-testid="nativeFormValidationTestEmail"
							autoComplete="email"
						/>
					</Fragment>
				)}
			</Field>
			{/* eslint-disable-next-line @atlaskit/design-system/use-simple-field */}
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
		</Form>
	);
}
