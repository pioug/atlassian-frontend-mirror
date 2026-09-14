import React from 'react';

import {
	AsyncSelect,
	CreateForm,
	type CreateFormProps,
	Select,
	TextField,
} from '@atlaskit/link-create';

const createTextFieldExample = (props: Partial<CreateFormProps<FormData>>): React.ComponentType => {
	return function Example() {
		return (
			<div>
				<CreateForm onSubmit={() => {}} {...props}>
					<TextField name={'textfield'} label={'This is a text field'} />
				</CreateForm>
			</div>
		);
	};
};
const createAsyncSelectExample = (
	props: Partial<CreateFormProps<FormData>>,
): React.ComponentType => {
	return function Example() {
		return (
			<div>
				<CreateForm onSubmit={() => {}} {...props}>
					<AsyncSelect name={'asyncselect'} label={'This is a select field'} />
				</CreateForm>
			</div>
		);
	};
};

const createMultiChildrenExample = (
	props: Partial<CreateFormProps<FormData>>,
): React.ComponentType => {
	return function Example() {
		return (
			<div>
				<CreateForm onSubmit={() => {}} {...props}>
					<TextField name={'textfield'} label={'This is a text field'} />
					<AsyncSelect name={'asyncselect'} label={'This is a select field'} />
				</CreateForm>
			</div>
		);
	};
};

const createFormWithRequiredFieldsExamples = (
	props: Partial<CreateFormProps<FormData>>,
): React.ComponentType => {
	return function Example() {
		return (
			<div>
				<CreateForm
					onSubmit={() => {
						return {
							textfield: 'Textfield is invalid',
							select: 'Select field is invalid',
							asyncselect: 'AsyncSelect is invalid',
						};
					}}
					{...props}
				>
					<TextField name={'textfield'} isRequired label={'This is a text field'} />
					<Select name={'select'} isRequired label={'This is a select field'} />
					<AsyncSelect name={'asyncselect'} isRequired label={'This is a select field'} />
				</CreateForm>
			</div>
		);
	};
};

export const CreateFormWithTextField: React.ComponentType<{}> = createTextFieldExample({});
export const CreateFormWithAsyncSelect: React.ComponentType<{}> = createAsyncSelectExample({});
export const DefaultCreateForm: React.ComponentType<{}> = createMultiChildrenExample({});
export const CreateFormIsLoading: React.ComponentType<{}> = createMultiChildrenExample({
	isLoading: true,
});
export const CreateFormHideFooter: React.ComponentType<{}> = createMultiChildrenExample({
	hideFooter: true,
});
export const CreateFormWithRequiredFields: React.ComponentType<{}> =
	createFormWithRequiredFieldsExamples({});
