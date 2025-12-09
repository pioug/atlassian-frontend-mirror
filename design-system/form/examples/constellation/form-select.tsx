import React from 'react';

import Button from '@atlaskit/button/new';
import Form, { Field, FormFooter } from '@atlaskit/form';
import { Flex } from '@atlaskit/primitives/compiled';
import Select, { type ValueType as Value } from '@atlaskit/select';

interface Option {
	label: string;
	value: string;
}
interface Category {
	type?: Value<Option>;
	owner?: Value<Option[]>;
	suit?: Value<Option[]>;
}

const types = [
	{ label: 'Library', value: 'library' },
	{ label: 'Application', value: 'application' },
	{ label: 'Capability', value: 'capability' },
	{ label: 'Cloud resource', value: 'cloud resource' },
	{ label: 'Data pipeline', value: 'data pipeline' },
	{ label: 'Machine learning model', value: 'Mmchine learning model' },
	{ label: 'UI element', value: 'ui element' },
];

const owners = [
	{ label: 'Design System Team', value: 'Design System Team' },
	{ label: 'Accessibility', value: 'Accessibility' },
	{ label: 'Design Ops', value: 'Design Ops' },
	{ label: 'Experience', value: 'Experience' },
];

const status = [
	{ label: 'To do', value: 'to do' },
	{ label: 'In progress', value: 'in progress' },
	{ label: 'In review', value: 'in review' },
	{ label: 'Done', value: 'done' },
];

const validateOnSubmit = (data: Category) => {
	let errors;
	errors = typeValidation(data, errors);
	errors = ownerValidation(data, errors);
	return errors;
};

const typeValidation = (data: Category, errors?: Record<string, string>) => {
	if (data.type && !(data.type instanceof Array)) {
		return (data.type as Option).value === 'dog'
			? {
					...errors,
					type: `${(data.type as Option).value} is not a type`,
				}
			: errors;
	}
	return errors;
};

const ownerValidation = (data: Category, errors?: Record<string, string>) => {
	if (data.owner && data.owner.length >= 2) {
		return {
			...errors,
			owner: `${data.owner.length} is too many owners. Select a maximum of 1 owner.`,
		};
	}

	return errors;
};

const FormSelectExample = (): React.JSX.Element => {
	return (
		<Flex direction="column">
			<Form<Category>
				onSubmit={(data) => {
					console.log('form data', data);
					return Promise.resolve(validateOnSubmit(data));
				}}
			>
				<Field<Value<Option>>
					name="type"
					label="Type"
					defaultValue={null}
					component={({ fieldProps: { id, ...rest } }) => (
						<Select<Option>
							inputId={id}
							{...rest}
							options={types}
							isClearable
							clearControlLabel="Clear type"
						/>
					)}
				/>
				<Field<Value<Option, true>>
					name="owner"
					label="Owner"
					defaultValue={[]}
					component={({ fieldProps: { id, ...rest } }) => (
						<Select inputId={id} {...rest} options={owners} isMulti />
					)}
				/>
				<Field<Value<Option, true>>
					name="status"
					label="Status"
					defaultValue={status.slice(2)}
					component={({ fieldProps: { id, ...rest } }) => (
						<Select inputId={id} {...rest} options={status} isMulti />
					)}
				/>
				<FormFooter align="start">
					<Button type="submit" appearance="primary">
						Submit
					</Button>
				</FormFooter>
			</Form>
		</Flex>
	);
};

export default FormSelectExample;
