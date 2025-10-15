import React, { Fragment } from 'react';

import Button from '@atlaskit/button/new';
import Form, { Field, FormFooter, HelperMessage } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';

export default function TextFieldMaxValueExample() {
	return (
		<Form onSubmit={(formData) => console.log('form data', formData)} name="max-length-example">
			<Field label="Example for using maxLength" name="max-length" defaultValue="">
				{({ fieldProps }: any) => (
					<Fragment>
						<Textfield {...fieldProps} maxLength={5} />
						<HelperMessage>Max length of 5</HelperMessage>
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
