import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import Field from '@atlaskit/form/field';
import Form from '@atlaskit/form/form';
import { FormFooter } from '@atlaskit/form/form-footer';
import { FormHeader } from '@atlaskit/form/form-header';
import { RequiredAsterisk } from '@atlaskit/form/required-asterisk';
import { Flex } from '@atlaskit/primitives/compiled';
import TextArea from '@atlaskit/textarea/text-area';
import TextField from '@atlaskit/textfield/text-field';

const FormWithoutField = (): React.JSX.Element => {
	const [hasSubmitted, setHasSubmitted] = useState(false);

	const handleSubmit = () => {
		setHasSubmitted(true);
	};

	return (
		<Flex justifyContent="center">
			{!hasSubmitted ? (
				<Form onSubmit={handleSubmit} name="submit-form">
					<FormHeader title="Leave feedback">
						<p aria-hidden="true">
							Required fields are marked with an asterisk <RequiredAsterisk />
						</p>
					</FormHeader>
					<Field
						name="name"
						defaultValue=""
						label="Name"
						isRequired
						component={({ fieldProps }) => <TextField autoComplete="name" {...fieldProps} />}
					/>

					<Field<string, HTMLTextAreaElement>
						name="description"
						defaultValue=""
						label="Description"
						component={({ fieldProps }) => <TextArea {...fieldProps} />}
					/>

					<FormFooter>
						<Button type="submit" appearance="primary">
							Submit
						</Button>
					</FormFooter>
				</Form>
			) : (
				<div id="submitted" aria-live="polite">
					You have successfully submitted!
				</div>
			)}
		</Flex>
	);
};

export default FormWithoutField;
