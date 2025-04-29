import React, { Fragment } from 'react';

import Avatar from '@atlaskit/avatar';
import Form, { Field } from '@atlaskit/form';
import ErrorIcon from '@atlaskit/icon/core/migration/error';
import Textfield from '@atlaskit/textfield';

export default function TextFieldElementsBeforeAndAfterExample() {
	return (
		<Form onSubmit={(formData) => console.log('form data', formData)}>
			{({ formProps }) => (
				<form {...formProps} name="elements-before-and-after-example">
					<Field label="After input" name="after-input" defaultValue="">
						{({ fieldProps }: any) => (
							<Fragment>
								<Textfield {...fieldProps} elemAfterInput={<ErrorIcon label="error" />} />
							</Fragment>
						)}
					</Field>
					<Field label="Before input" name="before-input" defaultValue="">
						{({ fieldProps }: any) => (
							<Fragment>
								<Textfield
									{...fieldProps}
									elemBeforeInput={<Avatar size="small" borderColor="transparent" />}
								/>
							</Fragment>
						)}
					</Field>
				</form>
			)}
		</Form>
	);
}
