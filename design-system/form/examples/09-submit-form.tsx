import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import Form, { Field, FormFooter, FormHeader, RequiredAsterisk } from '@atlaskit/form';
import { Flex } from '@atlaskit/primitives/compiled';
import TextArea from '@atlaskit/textarea';
import TextField from '@atlaskit/textfield';

const FormWithoutField = () => {
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
					<Field name="name" defaultValue="" label="Name" isRequired>
						{({ fieldProps }) => <TextField autoComplete="name" {...fieldProps} />}
					</Field>

					<Field<string, HTMLTextAreaElement>
						name="description"
						defaultValue=""
						label="Description"
					>
						{({ fieldProps }) => <TextArea {...fieldProps} />}
					</Field>

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
