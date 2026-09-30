import React, { Fragment } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/default/button';
import { ErrorMessage } from '@atlaskit/form/error-message';
import Field from '@atlaskit/form/field';
import Form from '@atlaskit/form/form';
import { FormFooter } from '@atlaskit/form/form-footer';
import { FormHeader } from '@atlaskit/form/form-header';
import { FormSection } from '@atlaskit/form/form-section';
import { HelperMessage } from '@atlaskit/form/helper-message';
import { MessageWrapper } from '@atlaskit/form/message-wrapper';
import { ValidMessage } from '@atlaskit/form/valid-message';
import { Flex } from '@atlaskit/primitives/compiled';
import TextField from '@atlaskit/textfield/text-field';

const FormFieldExample = (): React.JSX.Element => (
	<Flex direction="column">
		<Form onSubmit={(data) => console.log('form data', data)}>
			{({ formProps, submitting }) => (
				<form {...formProps}>
					<FormHeader title="Archive page"></FormHeader>
					<FormSection>
						<Field
							name="note"
							defaultValue=""
							label="Note"
							isRequired
							validate={(value) => (value ? undefined : 'REQUIRED')}
						>
							{({ fieldProps, error, valid, meta }) => (
								<Fragment>
									<TextField {...fieldProps} />
									<MessageWrapper>
										{error && !valid && (
											<HelperMessage>Explain why this page is being archived.</HelperMessage>
										)}
										{error && <ErrorMessage>The archive note must not be empty.</ErrorMessage>}
										{valid && meta.dirty ? <ValidMessage>Thank you!</ValidMessage> : null}
									</MessageWrapper>
								</Fragment>
							)}
						</Field>
					</FormSection>

					<FormFooter>
						<ButtonGroup label="Form submit options">
							<Button appearance="subtle">Cancel</Button>
							<Button type="submit" appearance="primary" isLoading={submitting}>
								Archive
							</Button>
						</ButtonGroup>
					</FormFooter>
				</form>
			)}
		</Form>
	</Flex>
);

export default FormFieldExample;
