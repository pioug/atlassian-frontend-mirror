/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, type ReactNode } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import CharacterCounter from './character-counter';
import Field, { type FieldComponentProps, type FieldProps, type Meta } from './field';
import { ErrorMessage, HelperMessage, MessageWrapper } from './messages';

type SupportedElements = HTMLInputElement | HTMLTextAreaElement;

// Override label specific margin block end to fix double spacing issue
const fieldWrapperStyles = cssMap({
	root: {
		// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors
		'& label[id$="-label"]': {
			marginBlockEnd: token('space.0', '0px'),
		},
	},
});

// Override helper message margins to fix inconsistent spacing issue
const helperMessageWrapperStyles = cssMap({
	root: {
		marginBlockEnd: token('space.050', '4px'),
		// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors
		'& [id$="-helper"]': {
			marginBlockStart: token('space.0', '0px'),
		},
	},
});

export interface CharacterCounterFieldProps<
	FieldValue = string,
	Element extends SupportedElements = HTMLInputElement,
> extends Omit<
		FieldComponentProps<FieldValue, Element>,
		'children' | 'component' | 'helperMessage' | 'errorMessage' | 'validMessage' | 'transform'
	> {
	/**
	 * The input component to render. Use a render function that receives `fieldProps`, `error`, `valid`, and `meta` state.
	 * Spread `fieldProps` onto your input element (such as `TextField` or `TextArea`).
	 */
	children: (args: {
		fieldProps: FieldProps<FieldValue, Element>;
		error?: string;
		// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
		valid: boolean;
		meta: Meta;
	}) => ReactNode;
	/**
	 * Helper text displayed above the input to provide additional context or instructions.
	 */
	helperMessage?: ReactNode;
	/**
	 * Maximum number of characters allowed. When exceeded, the field displays an error message or the message provided by `overMaximumMessage`.
	 */
	maxCharacters?: number;
	/**
	 * Minimum number of characters required. When not met, the character counter displays an error message or the message provided by `underMinimumMessage`.
	 */
	minCharacters?: number;
	/**
	 * Custom message displayed when input exceeds the maximum character limit. Use this to provide context-specific guidance or localized messages. Overrides the default "X characters too many" message.
	 */
	overMaximumMessage?: string;
	/**
	 * Custom message displayed when input is under the maximum limit. Use this to provide context-specific guidance or localized messages. Overrides the default "X characters remaining" message.
	 */
	underMaximumMessage?: string;
	/**
	 * Custom message displayed when input is under the minimum requirement. Use this to guide users on how much more they need to type. Overrides the default "Minimum of X characters required" message.
	 */
	underMinimumMessage?: string;
}

/**
 * __Character Counter Field__
 *
 * A field component that wraps the standard Field with automatic character count validation.
 * Validates minimum and maximum character limits and displays a character counter.
 */
export default function CharacterCounterField<
	FieldValue = string,
	Element extends SupportedElements = HTMLInputElement,
>({
	maxCharacters,
	minCharacters,
	children,
	validate: userValidate,
	overMaximumMessage,
	underMaximumMessage,
	underMinimumMessage,
	helperMessage,
	defaultValue,
	id,
	isRequired,
	isDisabled,
	label,
	elementAfterLabel,
	name,
	testId,
}: CharacterCounterFieldProps<FieldValue, Element>) {
	// Default validation function for character limits
	// __TOO_SHORT__ and __TOO_LONG__ are default error codes recognised by the CharacterCounter component
	const validateCharacterCount = (value: FieldValue | undefined): string | void => {
		const stringValue = String(value || '');
		const length = stringValue.length;

		// Check minimum length
		if (minCharacters !== undefined && length < minCharacters) {
			return '__TOO_SHORT__';
		}

		// Check maximum length
		if (maxCharacters !== undefined && length > maxCharacters) {
			return '__TOO_LONG__';
		}

		return undefined;
	};

	// Combine user validation and character validation
	// Any user defined validation takes priority over character validation
	// If there is no user defined validation for character limits e.g. used maxLength prior to CharacterCounterField,
	// use the default error codes and display the appropriate error message
	const combinedValidate = (
		value: FieldValue | undefined,
		formState: object,
		fieldState: Meta,
	): string | void | Promise<string | void> => {
		// First run character validation
		const characterError = validateCharacterCount(value);

		// Then run user's custom validation if provided
		const userError = userValidate?.(value, formState, fieldState);

		// If user validation returns a promise, handle it
		if (userError instanceof Promise) {
			return userError.then((error) => {
				// User error takes priority over character validation
				return error || characterError;
			});
		}

		// User error takes priority over character validation
		return userError || characterError;
	};

	return (
		<div css={fieldWrapperStyles.root}>
			<Field<FieldValue, Element>
				defaultValue={defaultValue}
				id={id}
				isRequired={isRequired}
				isDisabled={isDisabled}
				label={label}
				elementAfterLabel={elementAfterLabel}
				name={name}
				testId={testId}
				validate={combinedValidate}
			>
				{({ fieldProps: extendedFieldProps, error, valid, meta }) => {
					// Determine if error is a character count violation (handled by CharacterCounter)
					// or an external validation error (needs ErrorMessage)
					const isCharacterCountViolation = error === '__TOO_SHORT__' || error === '__TOO_LONG__';
					const showExternalError = error && !isCharacterCountViolation;
					const showCharacterCounter =
						(maxCharacters !== undefined || minCharacters !== undefined) && !showExternalError;

					// Extend aria-describedby to reference the appropriate message component
					const fieldPropsWithCounter = {
						...extendedFieldProps,
						'aria-describedby': showCharacterCounter
							? `${extendedFieldProps['aria-describedby']} ${extendedFieldProps.id}-character-counter`.trim()
							: extendedFieldProps['aria-describedby'],
					};

					return (
						<Fragment>
							{/* We want a helper message to be rendered above the field component so that screen readers to avoid it being hidden when error is present */}
							<MessageWrapper>
								{helperMessage && (
									<div css={helperMessageWrapperStyles.root}>
										<HelperMessage testId={`${testId}-helper`}>{helperMessage}</HelperMessage>
									</div>
								)}
							</MessageWrapper>

							{/* Render the field component, which would either be a TextField or Textarea */}
							{children({ fieldProps: fieldPropsWithCounter, error, valid, meta })}

							{/* Priority: Show non-character count errors if any */}
							<MessageWrapper>
								{showExternalError && (
									<ErrorMessage testId={`${testId}-error`}>{error}</ErrorMessage>
								)}
							</MessageWrapper>
							{/* CharacterCounter has its own debounced aria-live announcements */}
							{showCharacterCounter && (
								<CharacterCounter
									maxCharacters={maxCharacters}
									minCharacters={minCharacters}
									currentValue={String(extendedFieldProps.value || '')}
									shouldShowAsError={isCharacterCountViolation}
									overMaximumMessage={overMaximumMessage}
									underMaximumMessage={underMaximumMessage}
									underMinimumMessage={underMinimumMessage}
									testId={`${testId}-character-counter`}
								/>
							)}
						</Fragment>
					);
				}}
			</Field>
		</div>
	);
}
