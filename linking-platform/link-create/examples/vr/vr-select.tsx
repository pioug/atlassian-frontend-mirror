import React from 'react';

import { Form } from 'react-final-form';

import { Select } from '@atlaskit/link-create';

import { FormContextProvider } from '../../src/controllers/form-context';
import { type SelectProps } from '../../src/ui/create-form/select/types';

const createExample = (props: Partial<SelectProps> = {}): React.ComponentType => {
	return function Example() {
		return (
			<FormContextProvider>
				<Form onSubmit={() => {}}>
					{() => (
						<form>
							<Select name={'exampleAsyncSelectProps'} label={'Async Select'} {...props} />
						</form>
					)}
				</Form>
			</FormContextProvider>
		);
	};
};

export const DefaultSelect = createExample();
export const SelectorAllProps = createExample({
	validationHelpText: 'this is a validation help text',
	isRequired: true,
});
