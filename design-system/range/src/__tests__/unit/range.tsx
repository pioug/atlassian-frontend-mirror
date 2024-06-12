import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import Range, { type RangeProps } from '../../index';

describe('Range', () => {
	const rangeTestId = 'range';

	const createRange = (props: RangeProps = {}) => (
		<label htmlFor="age">
			Age
			{/* eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props */}
			<Range id="age" {...props} />
		</label>
	);

	describe('with default props', () => {
		const baseProps = {
			value: 20.12,
			testId: rangeTestId,
		};

		it('should have input with interface "range"', () => {
			render(createRange(baseProps));
			const input = screen.getByTestId(rangeTestId) as HTMLInputElement;
			expect(input.type).toBe('range');
		});

		it('should have percent value on styled component', () => {
			render(createRange(baseProps));
			const input = screen.getByTestId(rangeTestId);
			const cssVar = input.style.getPropertyValue('--track-fg-width');
			// Will get snapped to the nearest step
			expect(cssVar).toBe('20.00%');
		});

		it('should have min, max, step and valuePercent set to default values', () => {
			render(createRange(baseProps));
			const input = screen.getByTestId(rangeTestId) as HTMLInputElement;
			expect(input.min).toBe('0');
			expect(input.max).toBe('100');
			expect(input.step).toBe('1');
		});

		it('should input with defined value', () => {
			render(createRange(baseProps));
			const input = screen.getByTestId(rangeTestId) as HTMLInputElement;
			expect(input.value).toBe('20.12');
		});

		it('should not be disabled by default', () => {
			render(createRange(baseProps));
			const input = screen.getByTestId(rangeTestId) as HTMLInputElement;
			expect(input).toBeEnabled();
		});
	});

	describe('with defined props', () => {
		let onChangeSpy: any;
		let baseProps: any;

		beforeEach(() => {
			onChangeSpy = jest.fn();
			baseProps = {
				value: 25,
				min: 10,
				max: 20,
				onChange: onChangeSpy,
				testId: rangeTestId,
			};
		});

		it('should have defined min and max values', () => {
			render(createRange(baseProps));
			const input = screen.getByTestId(rangeTestId) as HTMLInputElement;
			expect(input.min).toBe('10');
			expect(input.max).toBe('20');
		});

		it('should call spy when value is changed', () => {
			render(createRange(baseProps));
			const input = screen.getByTestId(rangeTestId) as HTMLInputElement;
			fireEvent.change(input);
			expect(onChangeSpy).toHaveBeenCalledTimes(1);
		});

		it('should change input value when prop is changed', () => {
			const { rerender } = render(createRange(baseProps));
			rerender(createRange({ ...baseProps, value: 15 }));
			const input = screen.getByTestId(rangeTestId) as HTMLInputElement;
			expect(input.value).toBe('15');
		});

		it('should be disabled if isDisabled prop is truthy', () => {
			render(createRange({ ...baseProps, isDisabled: true }));
			const input = screen.getByTestId(rangeTestId);
			expect(input).toBeDisabled();
		});

		it('should not be disabled if isDisabled prop is falsy', () => {
			render(createRange({ ...baseProps, isDisabled: false }));
			const input = screen.getByTestId(rangeTestId);
			expect(input).toBeEnabled();
		});

		it('should use the ref prop', () => {
			const ref = React.createRef<HTMLInputElement>();
			render(createRange({ ...baseProps, ref }));
			const input = screen.getByTestId(rangeTestId);
			expect(input).toBe(ref.current);
		});

		it('should pass all the extra props passed down to hidden input', () => {
			render(createRange({ ...baseProps, 'data-foo': 'range-bar' }));
			const input = screen.getByTestId(rangeTestId);
			expect(input).toHaveAttribute('data-foo', 'range-bar');
		});
	});
});
