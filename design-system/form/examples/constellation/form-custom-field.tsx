/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css } from '@compiled/react';

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

const baseStyles = css({
	display: 'inline-block',
	width: '40px',
	height: '40px',
	margin: '0px 5px',
	color: 'transparent',
	overflow: 'hidden',
});

const ColorButton = ({ backgroundColor, changeHandler }: ColorButtonProps) => (
	<button
		type="submit"
		css={baseStyles}
		style={{
			backgroundColor,
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

const paragraphStyles = css({ margin: '10px 0' });

const FormCustomFieldExample = () => {
	return (
		<Flex direction="column">
			<Form onSubmit={(data) => console.log(data)}>
				<Field
					name="favorite-color"
					defaultValue=""
					label="Favorite color"
					component={({ fieldProps }) => (
						<Box data-name={fieldProps.id} data-value={fieldProps.value}>
							<p css={paragraphStyles}>
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
				/>
				<FormFooter>
					<Button type="submit" appearance="primary">
						Submit
					</Button>
				</FormFooter>
			</Form>
		</Flex>
	);
};

export default FormCustomFieldExample;
