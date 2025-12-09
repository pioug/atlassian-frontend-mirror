import React, { Fragment } from 'react';

import Button from '@atlaskit/button/new';
import Form, {
	ErrorMessage,
	Field,
	FormFooter,
	FormHeader,
	MessageWrapper,
	RequiredAsterisk,
} from '@atlaskit/form';
import { Flex, Text } from '@atlaskit/primitives/compiled';
import Select, { type ValueType } from '@atlaskit/select';
import TextField from '@atlaskit/textfield';

interface Option {
	label: string;
	value: string;
}

const members = [
	{ label: 'Arni Singh', value: 'asingh' },
	{ label: 'Hermione Walters', value: 'hwalters' },
	{ label: 'Parvi Karan', value: 'pkaran' },
	{ label: 'Charlie Li', value: 'cli' },
	{ label: 'Silus Graham', value: 'sgraham' },
	{ label: 'Jorge Oroza', value: 'joroza' },
];

const userNameData = ['jsmith', 'mchan'];

const errorMessages = {
	shortUsername: 'Enter a team name longer than 4 characters.',
	usernameInUse: 'This team name is already taken. Use a different name',
	usernameIsRequired: 'A team name is required.',
	selectError: 'Select at least one team member.',
};

const checkUserName = (value: string | undefined) => {
	return value && userNameData.includes(value);
};

export default function FieldLevelValidationExample(): React.JSX.Element {
	const handleSubmit = (formState: { command: string }) => {
		console.log('form state', formState);
	};

	return (
		<Flex direction="column">
			<Form noValidate onSubmit={handleSubmit}>
				<FormHeader title="Create team">
					<Text as="p" aria-hidden={true}>
						Required fields are marked with an asterisk <RequiredAsterisk />
					</Text>
				</FormHeader>
				<Field
					name="team"
					label="Team name"
					defaultValue=""
					isRequired
					validate={(value) => {
						if (!value) {
							return errorMessages.usernameIsRequired;
						} else if (value.length <= 5) {
							return errorMessages.shortUsername;
						} else if (checkUserName(value)) {
							return errorMessages.usernameInUse;
						}
					}}
					component={({ fieldProps }) => <TextField {...fieldProps} />}
				/>
				<Field<ValueType<Option, true>>
					name="members"
					label="Team members"
					defaultValue={[]}
					isRequired
					validate={(value) => {
						if (!value || value.length === 0) {
							return errorMessages.selectError;
						}
					}}
				>
					{({ fieldProps: { id, ...rest }, error }) => {
						return (
							<Fragment>
								<Select<Option, true>
									placeholder=""
									inputId={id}
									{...rest}
									options={members}
									isMulti
									isClearable
									clearControlLabel="Clear color"
									descriptionId={error ? `${id}-error` : undefined}
								/>
								<MessageWrapper>{error && <ErrorMessage>{error}</ErrorMessage>}</MessageWrapper>
							</Fragment>
						);
					}}
				</Field>
				<FormFooter align="start">
					<Button type="submit" appearance="primary">
						Create
					</Button>
				</FormFooter>
			</Form>
		</Flex>
	);
}
