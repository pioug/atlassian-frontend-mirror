import React, { Fragment } from 'react';

import Button from '@atlaskit/button/default/button';
import { ErrorMessage } from '@atlaskit/form/error-message';
import Field from '@atlaskit/form/field';
import Form from '@atlaskit/form/form';
import { FormFooter } from '@atlaskit/form/form-footer';
import { HelperMessage } from '@atlaskit/form/helper-message';
import { MessageWrapper } from '@atlaskit/form/message-wrapper';
import Textfield from '@atlaskit/textfield/text-field';

export default function FormExample(): React.JSX.Element {
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
