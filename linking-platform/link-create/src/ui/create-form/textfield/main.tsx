import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';
import AkTextfield from '@atlaskit/textfield';

import { CreateField } from '../../../controllers/create-field';

import { TextFieldOld } from './old/main';
import { type TextFieldProps } from './types';

export const TEST_ID = 'link-create-text-field';

/**
 * A text field utilising the Atlaskit Textfield and CreateField.
 * Validation is handled by the form as it is on form submission. Any errors returned by
 * the handleSubmit function passed to the form <Form> that have a key matching the `name`
 * of this text field are shown above the field.
 */
const TextFieldNew = ({
	id,
	name,
	label,
	isRequired,
	validators,
	validationHelpText,
	testId = TEST_ID,
	...restProps
}: TextFieldProps): JSX.Element => {
	return (
		<CreateField
			id={id}
			name={name}
			label={label}
			isRequired={isRequired}
			validators={validators}
			validationHelpText={validationHelpText}
			testId={testId}
		>
			{({ fieldId, ...fieldProps }) => {
				return <AkTextfield id={fieldId} {...fieldProps} {...restProps} />;
			}}
		</CreateField>
	);
};

export const TextField = (props: TextFieldProps) => {
	if (fg('platform_bandicoots-link-create-css')) {
		return <TextFieldNew {...props} />;
	}
	return <TextFieldOld {...props} />;
};
