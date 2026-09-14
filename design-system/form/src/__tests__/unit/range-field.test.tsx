import React from 'react';

import { fireEvent, render, screen, userEvent } from '@atlassian/testing-library';
import { shouldIgnoreLog } from '@af/suppress-react-warnings';
import Button from '@atlaskit/button/default/button';
import __noop from '@atlaskit/ds-lib/noop';
import Range from '@atlaskit/range/range';

import Form from '../../form';
import { RangeField } from '../../range-field';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
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

		const errorCalls = (error as jest.Mock).mock.calls.filter((call) => !shouldIgnoreLog(call));

		expect(errorCalls).toHaveLength(0);
		expect(warn).toHaveBeenCalledTimes(0);

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
