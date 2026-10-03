import React, { Fragment } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/default/button';
import { Checkbox } from '@atlaskit/checkbox/checkbox';
import { CheckboxField } from '@atlaskit/form/checkbox-field';
import { ErrorMessage } from '@atlaskit/form/error-message';
import Field from '@atlaskit/form/field';
import Form from '@atlaskit/form/form';
import { FormFooter } from '@atlaskit/form/form-footer';
import { FormHeader } from '@atlaskit/form/form-header';
import { HelperMessage } from '@atlaskit/form/helper-message';
import { MessageWrapper } from '@atlaskit/form/message-wrapper';
import { RequiredAsterisk } from '@atlaskit/form/required-asterisk';
import { Flex } from '@atlaskit/primitives/compiled/flex';
import { Text } from '@atlaskit/primitives/compiled/text';
import TextField from '@atlaskit/textfield/text-field';

const memoizeByValue = <T, U>(fn: (arg: T) => U): ((arg: T) => U) => {
	const results = new Map<T, U>();
	return (arg: T): U => {
		if (!results.has(arg)) {
			results.set(arg, fn(arg));
		}
		return results.get(arg) as U;
	};
};

const validateName = (value: string = '') => {
	if (!value) {
		return 'A name is required.';
	}
	if (value.length < 6) {
		return 'The name must have at least 6 characters.';
	}
	return undefined;
};

const validateDescription = memoizeByValue((value: string = '') => {
	if (!value) {
		return 'A description is required.';
	}
	if (value.length < 8) {
		return new Promise((resolve) => setTimeout(resolve, 300)).then(
			() => 'The description must have at least 8 characters.',
		);
	}
	return undefined;
});

export default (): React.JSX.Element => {
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
							helperMessage="Must be 6 or more characters."
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
