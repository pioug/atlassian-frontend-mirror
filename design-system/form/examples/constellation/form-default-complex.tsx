import React, { Fragment } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import Form, {
	ErrorMessage,
	Field,
	FormFooter,
	FormHeader,
	FormSection,
	HelperMessage,
	MessageWrapper,
	RequiredAsterisk,
	ValidMessage,
} from '@atlaskit/form';
import { Flex } from '@atlaskit/primitives/compiled';
import { RadioGroup } from '@atlaskit/radio';
import TextField from '@atlaskit/textfield';

const FormDefaultExample = (): React.JSX.Element => (
	<Flex direction="column">
		<Form<{ schema: string; key: string; type: string }>
			noValidate
			onSubmit={(data) => {
				console.log('form data', data);
				return new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>
					!data.schema ? { schema: 'A schema name is required' } : undefined,
				);
			}}
		>
			{({ formProps, submitting }) => (
				<form {...formProps} name="create">
					<FormHeader title="Create schema">
						<p aria-hidden="true">
							Required fields are marked with an asterisk <RequiredAsterisk />
						</p>
					</FormHeader>
					<FormSection>
						<Field
							name="schema"
							label="Schema name"
							isRequired
							defaultValue=""
							validate={(value) => (!value ? 'A schema name is required' : undefined)}
						>
							{({ fieldProps, error }) => {
								return (
									<Fragment>
										<TextField autoComplete="off" {...fieldProps} />
										<MessageWrapper>{error && <ErrorMessage>{error}</ErrorMessage>}</MessageWrapper>
									</Fragment>
								);
							}}
						</Field>
						<Field
							name="key"
							label="Key"
							defaultValue=""
							isRequired
							validate={(value) => {
								if (!value) {
									return 'A key is required';
								}
								if (value.length < 8) {
									return 'Key needs to be at least 8 characters.';
								}
							}}
						>
							{({ fieldProps, error, valid, meta }) => {
								return (
									<Fragment>
										<TextField type="key" {...fieldProps} />
										<MessageWrapper>
											<HelperMessage>
												Create a unique key, minimum of 8 characters. Example key: IT-infrastructure
											</HelperMessage>
											{error && <ErrorMessage>{error}</ErrorMessage>}
											{valid && meta.dirty ? <ValidMessage>Key is unique</ValidMessage> : null}
										</MessageWrapper>
									</Fragment>
								);
							}}
						</Field>
						<Field
							name="type"
							defaultValue=""
							label="Schema type"
							component={({ fieldProps }) => (
								<RadioGroup
									options={[
										{
											name: 'type',
											value: 'project-admin',
											label: 'Public',
										},
										{
											name: 'type',
											value: 'admin',
											label: 'Private',
										},
									]}
									{...fieldProps}
								/>
							)}
						/>
					</FormSection>

					<FormFooter align="start">
						<ButtonGroup label="Form submit options">
							<Button type="submit" appearance="primary">
								Create
							</Button>
							<Button appearance="subtle" isLoading={submitting}>
								Cancel
							</Button>
						</ButtonGroup>
					</FormFooter>
				</form>
			)}
		</Form>
	</Flex>
);

export default FormDefaultExample;
