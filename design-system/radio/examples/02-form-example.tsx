import React from 'react';

import Button from '@atlaskit/button/new';
import Form, { CheckboxField, Field, FormFooter } from '@atlaskit/form';
import { Radio, RadioGroup } from '@atlaskit/radio';
import { type OptionsPropType } from '@atlaskit/radio/types';

const colorItems: OptionsPropType = [
	{ name: 'color', value: 'red', label: 'Red', testId: 'color-red' },
	{ name: 'color', value: 'blue', label: 'Blue', testId: 'color-blue' },
	{ name: 'color', value: 'yellow', label: 'Yellow', testId: 'color-yellow' },
	{ name: 'color', value: 'green', label: 'Green', testId: 'color-green' },
];
const fruitItems: OptionsPropType = [
	{ name: 'fruit', value: 'apple', label: 'Apple', testId: 'fruit-apple' },
	{ name: 'fruit', value: 'orange', label: 'Orange', testId: 'fruit-orange' },
	{ name: 'fruit', value: 'peach', label: 'Peach', testId: 'fruit-peach' },
	{ name: 'fruit', value: 'pair', label: 'Pair', testId: 'fruit-pair' },
];
const cityItems: OptionsPropType = [
	{ name: 'city', value: 'sydney', label: 'Sydney', testId: 'city-sydney' },
	{ name: 'city', value: 'mountain-view', label: 'Mountain View', testId: 'city-mv' },
	{ name: 'city', value: 'new-york-city', label: 'New York City', testId: 'city-nyc' },
	{
		name: 'city',
		value: 'gallifrey',
		label: 'Gallifrey',
		isDisabled: true,
		testId: 'city-gallifrey',
	},
];
const weatherItems: OptionsPropType = [
	{ name: 'weather', value: 'sunny', label: 'Sunny', isDisabled: true, testId: 'weather-sunny' },
	{ name: 'weather', value: 'cloudy', label: 'Cloudy', isDisabled: true, testId: 'weather-cloudy' },
	{ name: 'weather', value: 'windy', label: 'Windy', testId: 'weather-windy' },
];

export default function FormExample() {
	return (
		<div>
			<Form onSubmit={(data: object) => console.log('form data', data)}>
				{({ formProps }: { formProps: object }) => {
					return (
						<form {...formProps} name="form-example">
							<CheckboxField name="standalone">
								{({ fieldProps }: { fieldProps: object }) => (
									<Radio {...fieldProps} label="standalone radio" testId="standalone" />
								)}
							</CheckboxField>
							<Field label="Required radio group" name="color" defaultValue="blue" isRequired>
								{({ fieldProps }: { fieldProps: object }) => (
									<RadioGroup {...fieldProps} options={colorItems} />
								)}
							</Field>
							<Field label="Regular radio group" name="fruit" defaultValue="peach">
								{({ fieldProps }: { fieldProps: object }) => (
									<RadioGroup {...fieldProps} options={fruitItems} />
								)}
							</Field>
							<Field
								label="Radio group with individual field disabled"
								name="city"
								defaultValue="sydney"
							>
								{({ fieldProps }: { fieldProps: object }) => (
									<RadioGroup {...fieldProps} isDisabled={undefined} options={cityItems} />
								)}
							</Field>
							<Field
								label="Radio group with individual field enabled"
								name="weather"
								defaultValue="sunny"
							>
								{({ fieldProps }: { fieldProps: object }) => (
									<RadioGroup {...fieldProps} isDisabled={undefined} options={weatherItems} />
								)}
							</Field>
							<FormFooter>
								<Button type="submit" appearance="primary">
									Submit
								</Button>
							</FormFooter>
						</form>
					);
				}}
			</Form>
		</div>
	);
}
