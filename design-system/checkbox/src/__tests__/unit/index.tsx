import React, { type ChangeEvent, createRef } from 'react';

import { fireEvent, render, screen, within } from '@testing-library/react';

import { shouldIgnoreLog } from '@af/suppress-react-warnings';
import __noop from '@atlaskit/ds-lib/noop';

import Checkbox from '../../checkbox';

declare var global: any;

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('@atlaskit/checkbox', () => {
	const renderCheckbox = (overridingProps: any) =>
		render(
			<Checkbox
				label="stub"
				onChange={__noop}
				name="stub"
				value="stub value"
				// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
				{...overridingProps}
			/>,
		);
	describe('console errors', () => {
		it('should not log console error on mount', () => {
			jest.spyOn(global.console, 'error');
			renderCheckbox({});
			const errorCalls = (global.console.error as jest.Mock).mock.calls.filter(
				(call) => !shouldIgnoreLog(call),
			);
			expect(errorCalls).toHaveLength(0);
			// @ts-ignore - Property 'mockRestore' does not exist
			global.console.error.mockRestore();
		});
	});
	describe('<Checkbox />', () => {
		describe('<Checkbox /> stateless: should not use state isChecked property when passing it as props', () => {
			it('keeps isChecked state when passed as prop and clicking', () => {
				// Test isChecked false remains false
				const { unmount } = renderCheckbox({ isChecked: false });
				let checkbox = screen.getByLabelText(/stub/);

				checkbox.click();

				expect(checkbox).not.toBeChecked();
				unmount();

				// Test isChecked true remains true
				renderCheckbox({ isChecked: true });
				checkbox = screen.getByLabelText(/stub/);

				checkbox.click();

				expect(checkbox).toBeChecked();
			});
		});
		it('should be unchecked by default', () => {
			renderCheckbox({});
			const checkbox = screen.getByLabelText(/stub/);

			expect(checkbox).not.toBeChecked();
		});
		it('should call onchange on change', () => {
			const onChange = jest.fn();
			renderCheckbox({ onChange: onChange });
			const checkbox = screen.getByLabelText(/stub/);

			checkbox.click();

			expect(onChange).toBeCalledTimes(1);
		});
		it('should call onChange and change variable', () => {
			let value = '';
			let checked = false;
			renderCheckbox({
				onChange: (e: ChangeEvent<HTMLInputElement>) => {
					value = e.currentTarget.value;
					checked = e.currentTarget.checked;
				},
			});
			const checkbox = screen.getByLabelText(/stub/);

			checkbox.click();

			expect(value).toBe('stub value');
			expect(checked).toBe(true);
		});
		it('should set the checked state when checked', () => {
			renderCheckbox({});
			const checkbox = screen.getByLabelText(/stub/);

			checkbox.click();

			expect(checkbox).toBeChecked();
		});
		it('should set the indeterminate state', () => {
			renderCheckbox({
				isIndeterminate: true,
				isChecked: true,
			});
			const checkbox = screen.getByRole('checkbox');
			expect(checkbox).toBeChecked();
		});
		it('should set the indeterminate state on the checkbox on update', () => {
			const { rerender } = renderCheckbox({
				isChecked: false,
				isIndeterminate: false,
			});
			const checkbox = screen.getByLabelText(/stub/);

			expect(checkbox).not.toBeChecked();

			rerender(
				<Checkbox
					label="stub"
					onChange={__noop}
					name="stub"
					value="stub value"
					isChecked={false}
					isIndeterminate={true}
				/>,
			);

			expect(checkbox).not.toBeChecked();
		});
		it('should show required indicator when isRequired prop is used', () => {
			renderCheckbox({ isRequired: true });

			const requiredIndicator = screen.getByText('*');

			expect(requiredIndicator).toBeVisible();
		});
		it('should set aria-invalid attr to input when isInvalid is true', () => {
			renderCheckbox({ isInvalid: true });

			const checkbox = screen.getByLabelText(/stub/);
			expect(checkbox).toHaveAttribute('aria-invalid', 'true');
		});
		it('should pass input props as attributes on the checkbox', () => {
			const onFocus = jest.fn();
			renderCheckbox({
				onFocus: onFocus,
			});
			const checkbox = screen.getByLabelText(/stub/);

			fireEvent.focus(checkbox);

			expect(onFocus).toBeCalled();
		});
		it('should set the reference on the checkbox', () => {
			const ref = createRef<HTMLInputElement>();
			renderCheckbox({
				ref: ref,
			});

			const input = screen.getByLabelText(/stub/);
			expect(input).toBe(ref.current);
		});
		it('should accept a function as a reference', () => {
			let ourNode: HTMLInputElement | undefined;
			renderCheckbox({
				ref: (node: HTMLInputElement) => {
					ourNode = node;
				},
			});

			const input = screen.getByLabelText(/stub/);
			expect(input).toBe(ourNode);
		});
	});
	describe('<Checkbox defaultChecked/>', () => {
		it('should be checked when defaultChecked is set to checked', () => {
			renderCheckbox({ defaultChecked: true });
			const checkbox = screen.getByLabelText(/stub/);

			expect(checkbox).toBeChecked();
		});
		it('should change checked after defaultChecked is set to true', () => {
			renderCheckbox({ defaultChecked: true });
			const checkbox = screen.getByLabelText(/stub/);

			expect(checkbox).toBeChecked();

			checkbox.click();

			expect(checkbox).not.toBeChecked();
		});
	});

	describe('<Checkbox /> label text should be present conditionally', () => {
		it('should be checked when defaultChecked is set to checked', () => {
			renderCheckbox({
				label: undefined, // Not having a visible label is a legit use case for things like table row selection
				testId: 'test',
				'aria-label': /stub/,
			});
			const checkbox = screen.getByTestId('test--checkbox-label');
			const label = within(checkbox).queryByText('', {
				selector: 'span',
			});
			expect(label).not.toBeInTheDocument();
		});
		it('should change checked after defaultChecked is set to true', () => {
			renderCheckbox({ testId: 'test' });
			const checkbox = screen.getByTestId('test--checkbox-label');

			const label = within(checkbox).queryByText(/stub/, {
				selector: 'span',
			});
			expect(label).toBeInTheDocument();
		});
	});
});
