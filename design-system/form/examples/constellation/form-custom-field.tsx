/* eslint-disable @atlaskit/ui-styling-standard/enforce-style-prop */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import Button from '@atlaskit/button/new';
import { jsx } from '@atlaskit/css';
import Form, { Field, FormFooter } from '@atlaskit/form';
import { Box, Flex } from '@atlaskit/primitives/compiled';

interface ColorButtonProps {
	backgroundColor: string;
	changeHandler: Function;
}

interface ColorButtonsProps {
	colors: Array<string>;
	changeHandler: Function;
}

const ColorButton = ({ backgroundColor, changeHandler }: ColorButtonProps) => (
	<button
		type="submit"
		style={{
			backgroundColor,
			margin: '0px 5px',
			color: 'transparent',
			display: 'inline-block',
			height: '40px',
			width: '40px',
			overflow: 'hidden',
		}}
		onClick={(e) => {
			e.preventDefault();
			/*
			 *
			 * For custom non-form-field fields, this event handler calls the onChange method that is passed to the render prop's fieldProps (i.e. fieldProps.onChange).
			 * It is called with the new value of the field, which will propagate the value up to the Form and back to the Field.
			 */
			changeHandler(backgroundColor);
		}}
	>
		{backgroundColor}
	</button>
);

const ColorButtons = ({ colors, changeHandler }: ColorButtonsProps) => (
	<React.Fragment>
		{colors.map((color) => (
			<ColorButton backgroundColor={color} changeHandler={changeHandler} key={color} />
		))}
	</React.Fragment>
);

const FormCustomFieldExample = () => {
	return (
		<Flex direction="column">
			<Form onSubmit={(data) => console.log(data)}>
				{({ formProps }) => (
					<form {...formProps}>
						<Field name="favorite-color" defaultValue="" label="Favorite color">
							{({ fieldProps }) => (
								<Box data-name={fieldProps.id} data-value={fieldProps.value}>
									<p style={{ margin: '10px 0' }}>
										Selected color:{' '}
										{fieldProps.value ? (
											<span style={{ color: fieldProps.value }}>{fieldProps.value}</span>
										) : (
											'none'
										)}
									</p>
									<ColorButtons
										colors={['Red', 'Green', 'Orange', 'Blue']}
										changeHandler={fieldProps.onChange}
									/>
								</Box>
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
};

export default FormCustomFieldExample;
