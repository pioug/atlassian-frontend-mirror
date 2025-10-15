import React, { Fragment } from 'react';

import Button from '@atlaskit/button/new';
import Form, {
	ErrorMessage,
	Field,
	FormFooter,
	HelperMessage,
	MessageWrapper,
} from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';

export default function FormExample() {
	const validate = (value: string = '') => {
		if (value.toLowerCase().includes('error')) {
			return 'CONTAINS_ERROR';
		}
		return undefined;
	};

	return (
		<Form onSubmit={(formState: unknown) => console.log('form submitted', formState)}>
			<Field
				name="example-text"
				defaultValue="a default value"
				label="With default value"
				validate={validate}
			>
				{({ fieldProps, error }: any) => (
					<Fragment>
						<Textfield {...fieldProps} />
						<MessageWrapper>
							<HelperMessage>Check the console to see the submitted data</HelperMessage>
							{error && <ErrorMessage>Please remove the word "error" from the input</ErrorMessage>}
						</MessageWrapper>
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
