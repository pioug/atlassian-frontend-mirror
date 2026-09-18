import React from 'react';

import Button from '@atlaskit/button/default/button';
import Field from '@atlaskit/form/field';
import Form from '@atlaskit/form/form';
import { FormFooter } from '@atlaskit/form/form-footer';
import Textfield from '@atlaskit/textfield/text-field';

export default function TextFieldFormExample(): React.JSX.Element {
	return (
		<Form onSubmit={(formState: unknown) => console.log('form submitted', formState)}>
			<Field
				label="Field label"
				name="example-text"
				helperMessage="Help or instruction text goes here"
				component={({ fieldProps }: any) => <Textfield {...fieldProps} />}
			/>
			<FormFooter>
				<Button type="submit" appearance="primary">
					Submit
				</Button>
			</FormFooter>
		</Form>
	);
}
