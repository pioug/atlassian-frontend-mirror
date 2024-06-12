import React, { type ChangeEvent, createRef } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import __noop from '@atlaskit/ds-lib/noop';

import Checkbox from '../../checkbox';

declare var global: any;

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
			expect(global.console.error).not.toHaveBeenCalled();
			// @ts-ignore - Property 'mockRestore' does not exist
			global.console.error.mockRestore();
		});
	});
	describe('<Checkbox />', () => {
		describe('<Checkbox /> stateless: should not use state isChecked property when passing it as props', () => {
			it('keeps isChecked as false when passing it as prop and clicking', () => {
				renderCheckbox({ isChecked: false });
				const checkbox = screen.getByLabelText('stub') as HTMLInputElement;

				checkbox.click();

				expect(checkbox).not.toBeChecked();
			});

			it('keeps isChecked as true when passing it as prop and calling onChange', () => {
				renderCheckbox({ isChecked: true });
				const checkbox = screen.getByLabelText('stub') as HTMLInputElement;

				checkbox.click();

				expect(checkbox).toBeChecked();
			});
		});
		it('should be unchecked by default', () => {
			renderCheckbox({});
			const checkbox = screen.getByLabelText('stub') as HTMLInputElement;

			expect(checkbox).not.toBeChecked();
		});
		it('should call onchange on change', () => {
			const onChange = jest.fn();
			renderCheckbox({ onChange: onChange });
			const checkbox = screen.getByLabelText('stub') as HTMLInputElement;

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
			const checkbox = screen.getByLabelText('stub') as HTMLInputElement;

			checkbox.click();

			expect(value).toBe('stub value');
			expect(checked).toBe(true);
		});
		it('should set the checked state when checked', () => {
			renderCheckbox({});
			const checkbox = screen.getByLabelText('stub') as HTMLInputElement;

			checkbox.click();

			expect(checkbox).toBeChecked();
		});
		it('should set the indeterminate state', () => {
			renderCheckbox({
				isIndeterminate: true,
				isChecked: true,
			});
			const checkbox = screen.getByRole('checkbox');
			// eslint-disable-next-line jest-dom/prefer-checked
			expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
		});
		it('should set the indeterminate state on the checkbox on update', () => {
			const { rerender } = renderCheckbox({
				isChecked: false,
				isIndeterminate: false,
			});
			const checkbox = screen.getByLabelText('stub') as HTMLInputElement;

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

			const checkbox = screen.getByLabelText('stub');
			expect(checkbox).toHaveAttribute('aria-invalid', 'true');
		});
		it('should pass input props as attributes on the checkbox', () => {
			const onFocus = jest.fn();
			renderCheckbox({
				onFocus: onFocus,
			});
			const checkbox = screen.getByLabelText('stub') as HTMLInputElement;

			fireEvent.focus(checkbox);

			expect(onFocus).toBeCalled();
		});
		it('should set the reference on the checkbox', () => {
			const ref = createRef<HTMLInputElement>();
			renderCheckbox({
				ref: ref,
			});

			const input = screen.getByLabelText('stub');
			expect(input).toBe(ref.current);
		});
		it('should accept a function as a reference', () => {
			let ourNode: HTMLInputElement | undefined;
			renderCheckbox({
				ref: (node: HTMLInputElement) => {
					ourNode = node;
				},
			});

			const input = screen.getByLabelText('stub');
			expect(input).toBe(ourNode);
		});
	});
	describe('<Checkbox defaultChecked/>', () => {
		it('should be checked when defaultChecked is set to checked', () => {
			renderCheckbox({ defaultChecked: true });
			const checkbox = screen.getByLabelText('stub') as HTMLInputElement;

			expect(checkbox).toBeChecked();
		});
		it('should change checked after defaultChecked is set to true', () => {
			renderCheckbox({ defaultChecked: true });
			const checkbox = screen.getByLabelText('stub') as HTMLInputElement;

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
				'aria-label': 'stub',
			});
			const checkbox = screen.getByTestId('test--checkbox-label') as HTMLInputElement;

			expect(checkbox.querySelector('span')).toBe(null);
		});
		it('should change checked after defaultChecked is set to true', () => {
			renderCheckbox({ testId: 'test' });
			const checkbox = screen.getByTestId('test--checkbox-label') as HTMLInputElement;

			expect(checkbox.querySelector('span')).toBeDefined();
		});
	});
});
