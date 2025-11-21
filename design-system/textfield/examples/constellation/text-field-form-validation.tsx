import React, { Fragment, useState } from 'react';

import Button from '@atlaskit/button/new';
import Form, {
	ErrorMessage,
	Field,
	FormFooter,
	MessageWrapper,
	ValidMessage,
} from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';

export default function FormValidationExample(): React.JSX.Element {
	const [fieldValue, setFieldValue] = useState<string | undefined>('');
	const [fieldHasError, setFieldHasError] = useState(false);

	function validate(value: string | undefined) {
		setFieldValue(value);
		if (value === 'regular user') {
			setFieldHasError(false);
		} else {
			return 'INCORRECT_PHRASE';
		}
		return undefined;
	}

	const handleSubmit = (formState: { command: string }) => {
		console.log('form state', formState);
	};

	const handleBlurEvent = () => {
		if (fieldValue !== 'regular user') {
			setFieldHasError(true);
		}
	};

	return (
		<Form onSubmit={handleSubmit} name="validation-example">
			<Field
				label="Validates entering existing role"
				isRequired
				name="command"
				validate={validate}
				defaultValue=""
			>
				{({ fieldProps: { onBlur: fieldOnBlur, ...fieldProps }, meta: { valid } }: any) => (
					<Fragment>
						<Textfield
							{...fieldProps}
							testId="formValidationTest"
							onBlur={() => {
								// When defining your own onBlur handler, additionally call onBlur from the fieldProps to propagate internal field state
								handleBlurEvent();
								fieldOnBlur();
							}}
						/>
						<MessageWrapper>
							{valid && <ValidMessage>Your role is valid</ValidMessage>}
							{fieldHasError && (
								<ErrorMessage>Incorrect, try &lsquo;regular user&rsquo;</ErrorMessage>
							)}
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
