import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Button from '@atlaskit/button/new';
import __noop from '@atlaskit/ds-lib/noop';
import Range from '@atlaskit/range';

import Form, { RangeField } from '../../index';

describe('RangeField', () => {
	const user = userEvent.setup();

	it('renders without errors', () => {
		const error = jest.spyOn(console, 'error');
		const warn = jest.spyOn(console, 'warn');

		render(
			<Form onSubmit={__noop}>
				{({ formProps }) => (
					<form {...formProps} data-testid="form">
						<RangeField name="light" defaultValue={30} label="Adjust brightness">
							{({ fieldProps }) => <Range {...fieldProps} testId="form--range" min={0} max={100} />}
						</RangeField>
						<RangeField name="loaded" defaultValue={30} isDisabled id="test" label="Label">
							{({ fieldProps }) => <Range {...fieldProps} testId="form--range" min={0} max={100} />}
						</RangeField>
					</form>
				)}
			</Form>,
		);

		expect(error).not.toHaveBeenCalled();
		expect(warn).toHaveBeenCalledTimes(1);

		warn.mockRestore();
		error.mockRestore();
	});

	it('passes through defaultValue correctly', async () => {
		const spy = jest.fn();
		render(
			<Form onSubmit={(data) => spy(data)}>
				{({ formProps }) => (
					<form {...formProps} data-testid="form">
						<RangeField name="volume" defaultValue={30} label="Adjust brightness">
							{({ fieldProps }) => <Range {...fieldProps} testId="form--range" min={0} max={100} />}
						</RangeField>
						<Button type="submit" testId="form--submit">
							Submit
						</Button>
					</form>
				)}
			</Form>,
		);

		const range = screen.getByTestId('form--range');

		expect(range).toHaveValue('30');

		const submit = screen.getByTestId('form--submit');
		await user.click(submit);

		expect(spy).toHaveBeenCalledWith({ volume: 30 });
	});

	it('updates value when range changes', () => {
		const spy = jest.fn();
		render(
			<Form onSubmit={(data) => spy(data)}>
				{({ formProps }) => (
					<form {...formProps} data-testid="form">
						<RangeField name="volume" defaultValue={30} label="Adjust brightness">
							{({ fieldProps }) => <Range {...fieldProps} testId="form--range" min={0} max={100} />}
						</RangeField>
						<Button type="submit" testId="form--submit">
							Submit
						</Button>
					</form>
				)}
			</Form>,
		);

		const range = screen.getByTestId('form--range');
		fireEvent.change(range, { target: { value: 70 } });
		expect(range).toHaveValue('70');

		const submit = screen.getByTestId('form--submit');
		fireEvent.click(submit);
		expect(spy).toHaveBeenCalledWith({ volume: 70 });
	});
});
