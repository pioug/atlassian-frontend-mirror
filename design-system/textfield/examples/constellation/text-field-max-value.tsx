import React, { Fragment } from 'react';

import Button from '@atlaskit/button/new';
import Form, { CharacterCounterField, FormFooter, HelperMessage } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';

export default function TextFieldMaxValueExample(): React.JSX.Element {
	return (
		<Form onSubmit={(formData) => console.log('form data', formData)} name="max-length-example">
			<CharacterCounterField
				label="Example for using maxLength"
				name="max-length"
				defaultValue=""
				maxCharacters={5}
			>
				{({ fieldProps }: any) => (
					<Fragment>
						<Textfield {...fieldProps} />
						<HelperMessage>Max length of 5</HelperMessage>
					</Fragment>
				)}
			</CharacterCounterField>
			<FormFooter>
				<Button type="submit" appearance="primary">
					Submit
				</Button>
			</FormFooter>
		</Form>
	);
}
