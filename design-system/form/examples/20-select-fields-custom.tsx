import React, { Fragment } from 'react';

import Button from '@atlaskit/button/new';
import Form, { ErrorMessage, Field, FormFooter, MessageWrapper } from '@atlaskit/form';
import { Flex } from '@atlaskit/primitives/compiled';
import Select, {
	components,
	type OptionProps,
	type SingleValueProps,
	type ValueType,
} from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

interface Option {
	label: string;
	value: string;
}

interface Category {
	colors?: ValueType<Option>;
	icecream?: ValueType<Option[]>;
	suit?: ValueType<Option[]>;
}

const colors = [
	{ label: 'blue', value: 'blue' },
	{ label: 'red', value: 'red' },
	{ label: 'purple', value: 'purple' },
	{ label: 'black', value: 'black' },
	{ label: 'white', value: 'white' },
	{ label: 'gray', value: 'gray' },
	{ label: 'yellow', value: 'yellow' },
	{ label: 'orange', value: 'orange' },
	{ label: 'teal', value: 'teal' },
];

const flavors = [
	{ label: 'vanilla', value: 'vanilla' },
	{ label: 'strawberry', value: 'strawberry' },
	{ label: 'chocolate', value: 'chocolate' },
	{ label: 'mango', value: 'mango' },
	{ label: 'rum', value: 'rum' },
	{ label: 'hazelnut', value: 'hazelnut' },
	{ label: 'durian', value: 'durian' },
];

const validateOnSubmit = (data: Category) => {
	let errors;
	errors = colorsValidation(data, errors);
	errors = flavorValidation(data, errors);
	return errors;
};

const colorsValidation = (data: Category, errors?: Record<string, string>) => {
	if (data.colors && !(data.colors instanceof Array)) {
		return (data.colors as Option).value === 'dog'
			? {
					...errors,
					colors: `${(data.colors as Option).value} is not a color`,
				}
			: errors;
	}
	return errors;
};

const flavorValidation = (data: Category, errors?: Record<string, string>) => {
	if (data.icecream && data.icecream.length >= 3) {
		return {
			...errors,
			icecream: `${data.icecream.length} is too many flavors, please select a maximum of 2 flavors.`,
		};
	}

	return errors;
};

const ColorBox = ({ color }: { color: string }) => (
	<span
		style={{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			width: '10px',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			height: '10px',
			backgroundColor: color,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			display: 'inline-block',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			marginRight: token('space.100', '8px'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			marginBottom: token('space.050', '4px'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			verticalAlign: 'middle',
		}}
	/>
);

type ColorOption = (typeof colors)[number];

/**
 * NOTE this is not declared inline with the Select
 * If you declare inline you'll have issues with refs
 */
const CustomColorOption = ({ children, ...props }: OptionProps<ColorOption>) => (
	// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
	<components.Option {...props}>
		<ColorBox color={children as string} /> {children}
	</components.Option>
);

/**
 * NOTE this is not declared inline with the Select
 * If you declare inline you'll have issues with refs
 */
const CustomValueOption = ({ children, ...props }: SingleValueProps<Option, false>) => (
	// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
	<components.SingleValue {...props}>
		<ColorBox color={children as string} /> {children}
	</components.SingleValue>
);

export default () => (
	<Flex direction="column">
		<Form<Category>
			onSubmit={(data) => {
				console.log('form data', data);
				return Promise.resolve(validateOnSubmit(data));
			}}
		>
			{({ formProps }) => (
				<form {...formProps}>
					<Field<ValueType<Option>> name="colors" label="Select a colour">
						{({ fieldProps: { id, ...rest }, error }) => (
							<Fragment>
								<Select<Option>
									inputId={id}
									components={{
										Option: CustomColorOption,
										SingleValue: CustomValueOption,
									}}
									{...rest}
									options={colors}
									isClearable
									clearControlLabel="Clear colour"
								/>
								<MessageWrapper>{error && <ErrorMessage>{error}</ErrorMessage>}</MessageWrapper>
							</Fragment>
						)}
					</Field>
					<Field<ValueType<Option, true>> name="icecream" label="Select a flavor" defaultValue={[]}>
						{({ fieldProps: { id, ...rest }, error }) => (
							<Fragment>
								<Select
									inputId={id}
									{...rest}
									options={flavors}
									isMulti
									clearControlLabel="Clear flavor"
								/>
								<MessageWrapper>{error && <ErrorMessage>{error}</ErrorMessage>}</MessageWrapper>
							</Fragment>
						)}
					</Field>
					<FormFooter>
						<Button type="submit" appearance="primary">
							Submit
						</Button>
					</FormFooter>
				</form>
			)}
		</Form>
	</Flex>
);
