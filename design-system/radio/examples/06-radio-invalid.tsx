import React, { Fragment } from 'react';

import Button from '@atlaskit/button/new';
import Form, { ErrorMessage, Field, FormFooter, MessageWrapper } from '@atlaskit/form';
import { RadioGroup } from '@atlaskit/radio';
import { type OptionsPropType } from '@atlaskit/radio/types';

interface FormData {
	[key: string]: string;
	'radio-group-invalid': string;
}

const validateOnSubmit = (data: FormData) => {
	let errors;
	errors = requiredValidator(data, 'radio-group-invalid');
	return errors;
};

const requiredValidator = (data: FormData, key: string) => {
	if (data[key] === 'invalid') {
		return {
			[key]: `This field is invalid.`,
		};
	}
};

const options: OptionsPropType = [
	{ name: 'radio-group-invalid', value: 'valid', label: 'Valid' },
	{ name: 'radio-group-invalid', value: 'invalid', label: 'Invalid' },
];

export default function RadioInvalid(): React.JSX.Element {
	return (
		<Form<FormData>
			onSubmit={(data) => {
				console.log('form data', data);
				return Promise.resolve(validateOnSubmit(data));
			}}
		>
			<Field label="Radio group with validation" name="radio-group-invalid" defaultValue="valid">
				{({ fieldProps, error }) => (
					<Fragment>
						<RadioGroup {...fieldProps} options={options} />
						<MessageWrapper>{error && <ErrorMessage>{error}</ErrorMessage>}</MessageWrapper>
					</Fragment>
				)}
			</Field>
			<FormFooter>
				<Button type="submit">Submit</Button>
			</FormFooter>
		</Form>
	);
}
