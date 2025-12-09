import React, { Fragment } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import Form, {
	CheckboxField,
	ErrorMessage,
	Field,
	FormFooter,
	FormHeader,
	HelperMessage,
	MessageWrapper,
	RequiredAsterisk,
} from '@atlaskit/form';
import { Flex, Text } from '@atlaskit/primitives/compiled';
import TextField from '@atlaskit/textfield';

export default (): React.JSX.Element => {
	const simpleMemoize = <T, U>(fn: (arg: T) => U): ((arg: T) => U) => {
		let lastArg: T;
		let lastResult: U;
		return (arg: T): U => {
			if (arg !== lastArg) {
				lastArg = arg;
				lastResult = fn(arg);
			}
			return lastResult;
		};
	};

	const validateName = (value: string = '') => {
		if (!value) {
			return 'A name is required.';
		}
		if (value.length < 6) {
			return 'The name must be longer than 5 characters.';
		}
		return undefined;
	};

	const validateDescription = simpleMemoize((value: string = '') => {
		if (!value) {
			return 'A description is required.';
		}
		if (value.length < 8) {
			return new Promise((resolve) => setTimeout(resolve, 300)).then(
				() => 'The description must be longer than 7 characters.',
			);
		}
		return undefined;
	});

	return (
		<Flex direction="column">
			<Form<{ name: string; description: string; remember: boolean }>
				noValidate
				onSubmit={(data) => {
					console.log('form data', data);
					return new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>
						data.name === 'error' ? { name: 'This name has been used. Try again.' } : undefined,
					);
				}}
			>
				{({ formProps, submitting }) => (
					<form {...formProps}>
						<FormHeader title="Add work type">
							<Text as="p" aria-hidden="true">
								Required fields are marked with an asterisk <RequiredAsterisk />
							</Text>
						</FormHeader>
						<Field
							name="name"
							label="Name"
							isRequired
							defaultValue=""
							helperMessage="Must be 5 or more characters."
							validate={validateName}
							component={({ fieldProps }) => <TextField autoComplete="name" {...fieldProps} />}
						/>
						<Field
							name="description"
							label="Description"
							defaultValue=""
							isRequired
							validate={validateDescription}
						>
							{({ fieldProps, error, meta }) => (
								<Fragment>
									<TextField type="description" {...fieldProps} />
									<MessageWrapper>
										{error && <ErrorMessage>{error}</ErrorMessage>}
										{meta.validating && meta.dirty ? (
											<HelperMessage>Checking...</HelperMessage>
										) : null}
									</MessageWrapper>
								</Fragment>
							)}
						</Field>
						<CheckboxField name="remember">
							{({ fieldProps }) => <Checkbox {...fieldProps} label="Add another work item" />}
						</CheckboxField>
						<FormFooter>
							<ButtonGroup label="Form submit options">
								<Button appearance="subtle">Cancel</Button>
								<Button type="submit" appearance="primary" isLoading={submitting}>
									Add
								</Button>
							</ButtonGroup>
						</FormFooter>
					</form>
				)}
			</Form>
		</Flex>
	);
};
