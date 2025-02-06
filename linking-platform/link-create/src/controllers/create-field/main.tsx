/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';
import { Field } from 'react-final-form';

import { Label, RequiredAsterisk } from '@atlaskit/form';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { Message } from '../../common/ui/message';
import { shouldShowValidationErrors } from '../../common/utils/form';

import { CreateFieldOld } from './old/main';
import { type CreateFieldProps } from './types';

const fieldWrapperStyles = css({
	marginTop: token('space.100', '8px'),
});

const CreateFieldNew = ({
	id,
	name,
	label,
	isRequired,
	validators,
	validationHelpText,
	testId,
	children,
}: CreateFieldProps): JSX.Element => {
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
				const showErrorMessage = hasError && isInvalid;
				const describedById = `${fieldId}-description`;
				const errorMessageId = `${fieldId}-error`;
				const ariaErrorMessage = showErrorMessage ? errorMessageId : undefined;

				return (
					<div css={fieldWrapperStyles} data-testid={testId}>
						{label && (
							<Label htmlFor={fieldId} id={`${fieldId}-label`} testId={`${testId}-label`}>
								{label}
								{isRequired && <RequiredAsterisk />}
							</Label>
						)}

						{children({
							...input,
							fieldId,
							isInvalid,
							isRequired,
							'aria-errormessage': ariaErrorMessage,
							'aria-describedby': describedById,
						})}
						<div id={describedById}>
							{!hasError && validationHelpText && (
								<Message testId={`${testId}-helper-message`}>{validationHelpText}</Message>
							)}
							<div aria-live="polite">
								{showErrorMessage && (
									<Message
										id={errorMessageId}
										appearance="error"
										testId={`${testId}-error-message`}
									>
										{submitError || error}
									</Message>
								)}
							</div>
						</div>
					</div>
				);
			}}
		</Field>
	);
};

export const CreateField = (props: CreateFieldProps) => {
	if (fg('platform_bandicoots-link-create-css')) {
		return <CreateFieldNew {...props} />;
	}
	return <CreateFieldOld {...props} />;
};
