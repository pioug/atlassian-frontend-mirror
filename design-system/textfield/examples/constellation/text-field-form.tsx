import React, { Fragment } from 'react';

import Button from '@atlaskit/button/new';
import Form, { Field, FormFooter, HelperMessage } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';

export default function TextFieldFormExample() {
	return (
		<Form onSubmit={(formState: unknown) => console.log('form submitted', formState)}>
			{({ formProps }: any) => (
				<form {...formProps}>
					<Field label="Field label" name="example-text">
						{({ fieldProps }: any) => (
							<Fragment>
								<Textfield placeholder="Enter your details here" {...fieldProps} />
								<HelperMessage>Help or instruction text goes here</HelperMessage>
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
