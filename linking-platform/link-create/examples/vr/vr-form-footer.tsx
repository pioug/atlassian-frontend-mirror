import React from 'react';

import { Form } from 'react-final-form';
import { IntlProvider } from 'react-intl-next';

import { FormContextProvider } from '../../src/controllers/form-context';
import {
	CreateFormFooter,
	type CreateFormFooterProps,
} from '../../src/ui/create-form/form-footer/main';

const createExample = (
	props: Partial<CreateFormFooterProps>,
	enableEditView?: () => void,
): React.ComponentType => {
	return function Example() {
		return (
			<IntlProvider locale="en">
				<FormContextProvider enableEditView={enableEditView}>
					<Form<FormData> onSubmit={() => {}}>
						{({}) => {
							return (
								<form onSubmit={() => {}}>
									<CreateFormFooter
										formErrorMessage={props.formErrorMessage}
										handleCancel={() => {}}
										testId="link-create-form"
									/>
								</form>
							);
						}}
					</Form>
				</FormContextProvider>
			</IntlProvider>
		);
	};
};

export const CreateFormFooterWithErrorMessage: React.ComponentType<{}> = createExample(
	{
		formErrorMessage: 'This is an error message',
	},
	() => {},
);

export const CreateFormFooterWithoutEdit: React.ComponentType<{}> = createExample(
	{
		formErrorMessage: undefined,
	},
	undefined,
);

export const CreateFormFooterDefault: React.ComponentType<{}> = createExample(
	{
		formErrorMessage: undefined,
	},
	() => {},
);
