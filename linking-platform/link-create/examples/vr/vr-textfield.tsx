import React from 'react';

import { Form } from 'react-final-form';

import { TextField } from '@atlaskit/link-create';

import { FormContextProvider } from '../../src/controllers/form-context';
import { type TextFieldProps } from '../../src/ui/create-form/textfield/types';

const createExample = (props: Partial<TextFieldProps> = {}): React.ComponentType => {
	return function Example() {
		return (
			<FormContextProvider>
				<Form onSubmit={() => {}}>
					{() => (
						<form>
							<TextField name={'exampleTextField'} {...props} />
						</form>
					)}
				</Form>
			</FormContextProvider>
		);
	};
};

export const DefaultTextField: React.ComponentType<{}> = createExample();
export const TextFieldWithMultiProps: React.ComponentType<{}> = createExample({
	label: 'This is a label',
	validationHelpText: 'This is a validation help text',
	value: 'hello, this is a value for the text field',
});
