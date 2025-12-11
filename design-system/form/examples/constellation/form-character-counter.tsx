import React from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import Form, {
	CharacterCounterField,
	type FieldProps,
	FormFooter,
	FormHeader,
	FormSection,
	RequiredAsterisk,
} from '@atlaskit/form';
import { Flex } from '@atlaskit/primitives/compiled';
import TextArea from '@atlaskit/textarea';
import TextField from '@atlaskit/textfield';

/**
 * Mock i18n setup - in a real app, these would come from your i18n library
 * Example: import { useIntl } from 'react-intl';
 */
const messages = {
	'bio.underMinimum': 'Enter at least {minimum} characters.',
	'bio.overMaximum': 'Your bio exceeds the maximum length of {maximum} characters',
};

// Mock formatMessage - in a real app: const { formatMessage } = useIntl();
const formatMessage = (
	messageDescriptor: { id: keyof typeof messages },
	values?: Record<string, string | number>,
): string => {
	let message = messages[messageDescriptor.id];
	if (values) {
		Object.entries(values).forEach(([key, value]) => {
			message = message.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
		});
	}
	return message;
};

const FormCharacterCounterExample = () => (
	<Flex direction="column">
		<Form
			noValidate
			onSubmit={(data) => {
				console.log('form data', data);
			}}
		>
			<FormHeader title="Profile">
				<p aria-hidden="true">
					Required fields are marked with an asterisk <RequiredAsterisk />
				</p>
			</FormHeader>
			<FormSection>
				{/* Example 1: Maximum characters only with default messages */}
				<CharacterCounterField
					name="displayName"
					label="Display name"
					isRequired
					maxCharacters={50}
					helperMessage="The name you’d like other people to see."
					validate={(value) =>
						value === 'Atlas' ? 'Atlas is already in use, try something else' : undefined
					}
				>
					{({ fieldProps }: { fieldProps: FieldProps<string> }) => (
						<TextField autoComplete="name" {...fieldProps} />
					)}
				</CharacterCounterField>

				{/* Example 2: Minimum characters only with default messages */}
				<CharacterCounterField<string, HTMLTextAreaElement>
					name="tagline"
					label="Professional tagline"
					minCharacters={10}
					helperMessage="A short headline that describes what you do."
				>
					{({ fieldProps }) => <TextArea {...fieldProps} resize="auto" minimumRows={2} />}
				</CharacterCounterField>

				{/* Example 3: Using i18n messages with character counter */}
				<CharacterCounterField<string, HTMLTextAreaElement>
					name="bio"
					label="Bio"
					isRequired
					minCharacters={10}
					maxCharacters={200}
					helperMessage="Tell us about yourself, your interests, and experience."
					underMinimumMessage={formatMessage({ id: 'bio.underMinimum' }, { minimum: 10 })}
					overMaximumMessage={formatMessage({ id: 'bio.overMaximum' }, { maximum: 200 })}
				>
					{({ fieldProps }) => <TextArea {...fieldProps} resize="auto" minimumRows={3} />}
				</CharacterCounterField>
			</FormSection>

			<FormFooter align="start">
				<ButtonGroup label="Form submit options">
					<Button type="submit" appearance="primary">
						Save profile
					</Button>
					<Button appearance="subtle">Cancel</Button>
				</ButtonGroup>
			</FormFooter>
		</Form>
	</Flex>
);

export default FormCharacterCounterExample;
