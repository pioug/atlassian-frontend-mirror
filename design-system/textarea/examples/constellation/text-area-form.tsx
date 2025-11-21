import React, { Fragment } from 'react';

import Button from '@atlaskit/button/new';
import Form, { Field, FormFooter, HelperMessage } from '@atlaskit/form';
import TextArea from '@atlaskit/textarea';

export default function TextAreaFormExample(): React.JSX.Element {
	return (
		<Form onSubmit={(formState: unknown) => console.log('form submitted', formState)}>
			<Field label="Field label" name="example-text">
				{({ fieldProps }: any) => (
					<Fragment>
						<TextArea placeholder="Enter long form text here" {...fieldProps} />
						<HelperMessage>Help or instruction text goes here</HelperMessage>
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
