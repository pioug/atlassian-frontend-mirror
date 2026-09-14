import React from 'react';

import Button from '@atlaskit/button/default/button';
import Form from '@atlaskit/form/form';
import Field from '@atlaskit/form/field';
import { FormFooter } from '@atlaskit/form/form-footer';
import TextArea from '@atlaskit/textarea/text-area';

export default function TextAreaFormExample(): React.JSX.Element {
	return (
		<Form onSubmit={(formState: unknown) => console.log('form submitted', formState)}>
			<Field
				label="Field label"
				name="example-text"
				helperMessage="Help or instruction text goes here"
				component={({ fieldProps }: any) => <TextArea {...fieldProps} />}
			/>
			<FormFooter>
				<Button type="submit" appearance="primary">
					Submit
				</Button>
			</FormFooter>
		</Form>
	);
}
