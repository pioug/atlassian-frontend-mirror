import React from 'react';

import Button from '@atlaskit/button/default/button';
import { ErrorMessage } from '@atlaskit/form/error-message';
import Field from '@atlaskit/form/field';
import Form from '@atlaskit/form/form';
import { FormFooter } from '@atlaskit/form/form-footer';
import { MessageWrapper } from '@atlaskit/form/message-wrapper';
import { ValidMessage } from '@atlaskit/form/valid-message';
import TextField from '@atlaskit/textfield/text-field';

/**
 * This English-only placeholder demonstrates the prop wiring. In an application,
 * obtain formatMessage from the app's i18n library.
 */
const formatMessage = (message: { defaultMessage: string }): string => message.defaultMessage;

const FormMessageLabelsI18nExample = (): React.JSX.Element => (
	<Form
		errorMessageLabel={formatMessage({ defaultMessage: 'Error' })}
		onSubmit={() => {}}
		validMessageLabel={formatMessage({ defaultMessage: 'Valid' })}
	>
		<Field
			defaultValue=""
			label="Project name"
			name="project-name"
			validate={(value) => (!value ? 'Enter a project name.' : undefined)}
		>
			{({ fieldProps, error, valid, meta }) => (
				<>
					<TextField {...fieldProps} />
					<MessageWrapper>
						{error && <ErrorMessage>{error}</ErrorMessage>}
						{valid && meta.dirty ? <ValidMessage>Project name is available.</ValidMessage> : null}
					</MessageWrapper>
				</>
			)}
		</Field>
		<FormFooter align="start">
			<Button appearance="primary" type="submit">
				Create project
			</Button>
		</FormFooter>
	</Form>
);

export default FormMessageLabelsI18nExample;
