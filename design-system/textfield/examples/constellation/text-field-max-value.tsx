import React, { Fragment } from 'react';

import Button from '@atlaskit/button/default/button';
import Form from '@atlaskit/form/form';
import { CharacterCounterField } from '@atlaskit/form/character-counter-field';
import { FormFooter } from '@atlaskit/form/form-footer';
import { HelperMessage } from '@atlaskit/form/helper-message';
import Textfield from '@atlaskit/textfield/text-field';

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
