/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import Form, { Field, FormFooter } from '@atlaskit/form';
import { Box, Flex } from '@atlaskit/primitives/compiled';

interface ColorButtonProps {
	color: string;
	changeHandler: Function;
}

interface ColorButtonsProps {
	colors: Array<string>;
	changeHandler: Function;
}

const colorButtonStyles = cssMap({
	root: {
		color: 'transparent',
		display: 'inline-block',
		height: '40px',
		width: '40px',
		overflow: 'hidden',
	},
});

const ColorButton = ({ color, changeHandler }: ColorButtonProps) => (
	<button
		type="submit"
		style={{
			backgroundColor: color,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			margin: '0px 5px',
		}}
		css={colorButtonStyles.root}
		onClick={(e) => {
			e.preventDefault();
			/*
			 *
			 * For custom non-form-field fields, this event handler calls the onChange method that is passed to the render prop's fieldProps (i.e. fieldProps.onChange).
			 * It is called with the new value of the field, which will propagate the value up to the Form and back to the Field.
			 */
			changeHandler(color);
		}}
	>
		{color}
	</button>
);

const ColorButtons = ({ colors, changeHandler }: ColorButtonsProps) => (
	<React.Fragment>
		{colors.map((color) => (
			<ColorButton color={color} changeHandler={changeHandler} key={color} />
		))}
	</React.Fragment>
);

const formContainerStyle = cssMap({
	root: {
		width: '400px',
		maxWidth: '100%',
		margin: '0 auto',
	},
});

const FormCustomFieldExample = () => {
	return (
		<Flex xcss={formContainerStyle.root} direction="column">
			<Form onSubmit={(data) => console.log(data)}>
				{({ formProps }) => (
					<form {...formProps}>
						<Field name="favorite-color" defaultValue="" label="Favorite color">
							{({ fieldProps }) => (
								<Box data-name={fieldProps.id} data-value={fieldProps.value}>
									{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
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
