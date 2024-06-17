/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { Field } from 'react-final-form';

import { ErrorMessage, HelperMessage, Label, RequiredAsterisk } from '@atlaskit/form';
import { token } from '@atlaskit/tokens';

import { shouldShowValidationErrors } from '../../common/utils/form';

import { type CreateFieldProps } from './types';

const fieldWrapperStyles = css({
	marginTop: token('space.100', '8px'),
});

export function CreateField({
	id,
	name,
	label,
	isRequired,
	validators,
	validationHelpText,
	testId,
	children,
}: CreateFieldProps) {
	const fieldId = id ? id : `link-create-field-${name}`;

	return (
		<Field
			name={name}
			validate={(value) => {
				return (validators ?? []).find((validator) => {
					return !validator.isValid(value);
				})?.errorMessage;
			}}
		>
			{({ input, meta }) => {
				const isInvalid = shouldShowValidationErrors(meta);
				const { submitError, error } = meta;
				const hasError = !!submitError || !!error;

				return (
					<div css={fieldWrapperStyles} data-testid={testId}>
						{label && (
							<Label htmlFor={fieldId} id={`${fieldId}-label`} testId={`${testId}-label`}>
								{label}
								{isRequired && <RequiredAsterisk />}
							</Label>
						)}

						{children({ ...input, fieldId, isInvalid })}

						{!hasError && validationHelpText && (
							<HelperMessage testId={`${testId}-helper-message`}>
								{validationHelpText}
							</HelperMessage>
						)}
						{hasError && isInvalid && (
							<ErrorMessage testId={`${testId}-error-message`}>{submitError || error}</ErrorMessage>
						)}
					</div>
				);
			}}
		</Field>
	);
}
