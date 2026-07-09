import React from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { CharacterCounterField } from '@atlaskit/form/character-counter-field';
import { type FieldProps } from '@atlaskit/form/field';
import Form from '@atlaskit/form/form';
import { FormFooter } from '@atlaskit/form/form-footer';
import { FormHeader } from '@atlaskit/form/form-header';
import { FormSection } from '@atlaskit/form/form-section';
import { RequiredAsterisk } from '@atlaskit/form/required-asterisk';
import { Flex } from '@atlaskit/primitives/compiled/flex';
import { Text } from '@atlaskit/primitives/compiled/text';
import TextArea from '@atlaskit/textarea/text-area';
import TextField from '@atlaskit/textfield/text-field';

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

const FormCharacterCounterExample = (): React.JSX.Element => (
	<Flex direction="column">
		<Form
			noValidate
			onSubmit={(data) => {
				console.log('form data', data);
			}}
		>
			<FormHeader title="Profile">
				<Text as="p" aria-hidden="true">
					Required fields are marked with an asterisk <RequiredAsterisk />
				</Text>
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
