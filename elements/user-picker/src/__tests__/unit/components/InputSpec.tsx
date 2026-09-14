import React from 'react';
import type { OptionType, SelectProps } from '@atlaskit/select/types';
import { fireEvent, render } from '@testing-library/react';
import { Input } from '../../../components/Input';
import { type AriaAttributesType } from '../../../types';

jest.mock('@atlaskit/react-select/components', () => ({
	components: {
		Input: ({
			innerRef,
			isDisabled,
			isHidden,
			xcss,
			cx,
			getStyles,
			getClassNames,
			selectProps,
			...props
		}: any) => <input ref={innerRef} disabled={isDisabled} hidden={isHidden} {...props} />,
	},
}));

describe('ClearIndicator', () => {
	const noop = () => {};

	const labelledById = 'test-labelledby';
	const describedById = 'test-described';

	type MockProps = {
		'aria-describedby'?: AriaAttributesType;
		'aria-label'?: string;
		'aria-labelledby'?: AriaAttributesType;
		cx: () => void;
		getClassNames: () => void;
		getStyles: () => void;
		innerRef: (ref: React.Ref<HTMLInputElement>) => void;
		selectProps: SelectProps<OptionType, boolean>;
	};
	let mockedProps: MockProps;

	beforeEach(() => {
		mockedProps = {
			innerRef(ref: React.Ref<HTMLInputElement>): void {},
			selectProps: { disableInput: false },
			cx: noop,
			getStyles: noop,
			getClassNames: noop,
		};
	});

	it('should be enabled by default', async () => {
		const { container } = render(<Input {...mockedProps} aria-label="Input" />);

		expect(container.querySelector('input')).not.toBeDisabled();

		await expect(document.body).toBeAccessible();
	});

	it('should fire event.preventDefault() if isDisabled', async () => {
		mockedProps.selectProps.disableInput = true;

		const { container } = render(<Input {...mockedProps} aria-label="Input" />);
		const input = container.querySelector('input')!;
		const defaultPrevented: boolean[] = [];
		const captureEvent = (event: Event) => defaultPrevented.push(event.defaultPrevented);
		document.addEventListener('keypress', captureEvent);
		fireEvent.keyPress(input, { key: 'a', code: 'KeyA', charCode: 97 });
		expect(defaultPrevented).toEqual([true]);
		document.removeEventListener('keypress', captureEvent);

		await expect(document.body).toBeAccessible();
	});

	it('should fire event.preventDefault() only on `Enter` key pressed', async () => {
		const { container } = render(<Input {...mockedProps} aria-label="Input" />);
		const input = container.querySelector('input')!;
		const defaultPrevented: boolean[] = [];
		const captureEvent = (event: Event) => defaultPrevented.push(event.defaultPrevented);
		document.addEventListener('keypress', captureEvent);
		fireEvent.keyPress(input, { key: 'a', code: 'KeyA', charCode: 97 });
		expect(defaultPrevented).toEqual([false]);
		fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
		expect(defaultPrevented).toEqual([false, true]);
		document.removeEventListener('keypress', captureEvent);

		await expect(document.body).toBeAccessible();
	});

	describe('aria-describedby', () => {
		const ariaSelector = '[aria-describedby]';

		it('should have no aria-describedby by default', async () => {
			const { baseElement } = render(<Input {...mockedProps} />);

			const ariaAttr = baseElement.querySelector(ariaSelector);

			expect(ariaAttr).not.toBeInTheDocument();

			// eslint-disable-next-line @atlassian/a11y/no-violation-count
			await expect(document.body).toBeAccessible({ violationCount: 1 });
		});

		it('should have aria-describedby if passed from selectProps', async () => {
			mockedProps.selectProps = {
				'aria-describedby': describedById,
			};

			const { baseElement } = render(<Input {...mockedProps} />);

			const ariaAttr = baseElement.querySelector(ariaSelector);

			expect(ariaAttr).toBeInTheDocument();

			// eslint-disable-next-line @atlassian/a11y/no-violation-count
			await expect(document.body).toBeAccessible({ violationCount: 2 });
		});

		it('should have aria-describedby from props if selectProps is not passed', async () => {
			mockedProps = {
				...mockedProps,
				'aria-describedby': describedById,
			};

			const { baseElement } = render(<Input {...mockedProps} />);

			const ariaAttr = baseElement.querySelector(ariaSelector);

			expect(ariaAttr).toBeInTheDocument();

			// eslint-disable-next-line @atlassian/a11y/no-violation-count
			await expect(document.body).toBeAccessible({ violationCount: 2 });
		});
	});

	describe('aria-labelledby', () => {
		const ariaSelector = '[aria-labelledby]';

		it('should have no aria-labelledby by default', async () => {
			const { baseElement } = render(<Input {...mockedProps} />);

			const ariaAttr = baseElement.querySelector(ariaSelector);

			expect(ariaAttr).not.toBeInTheDocument();

			// eslint-disable-next-line @atlassian/a11y/no-violation-count
			await expect(document.body).toBeAccessible({ violationCount: 1 });
		});

		it('should use aria-labelledby over aria-describedby if both are passed', async () => {
			mockedProps = {
				...mockedProps,
				'aria-describedby': describedById,
				'aria-labelledby': labelledById,
			};

			const { baseElement } = render(<Input {...mockedProps} />);

			const ariaAttr = baseElement.querySelector(ariaSelector);

			expect(ariaAttr?.getAttribute('aria-labelledby')).toEqual(labelledById);

			// eslint-disable-next-line @atlassian/a11y/no-violation-count
			await expect(document.body).toBeAccessible({ violationCount: 2 });
		});

		it('should default to aria-describedby if aria-laballedby is not passed', async () => {
			mockedProps = {
				...mockedProps,
				'aria-label': undefined,
				'aria-describedby': describedById,
			};

			const { baseElement } = render(<Input {...mockedProps} />);

			const ariaAttr = baseElement.querySelector(ariaSelector);

			expect(ariaAttr?.getAttribute('aria-labelledby')).toEqual(describedById);

			// eslint-disable-next-line @atlassian/a11y/no-violation-count
			await expect(document.body).toBeAccessible({ violationCount: 2 });
		});
	});

	describe('aria-labelledby with aria-label and aria-describedby (A11Y-37267)', () => {
		const ariaLabel = 'Enter names or emails';

		it('should not promote aria-describedby to aria-labelledby when aria-label is present', async () => {
			const propsWithLabel = {
				...mockedProps,
				'aria-label': ariaLabel,
				'aria-describedby': describedById,
			};

			const { baseElement } = render(<Input {...propsWithLabel} />);

			const input = baseElement.querySelector('input');

			// aria-labelledby must not clobber the explicit aria-label
			expect(input).not.toHaveAttribute('aria-labelledby');
			// the description should still be linked via aria-describedby
			expect(input).toHaveAttribute('aria-describedby', describedById);
			// the accessible name is preserved
			expect(input).toHaveAttribute('aria-label', ariaLabel);
		});

		it('should still promote aria-describedby to aria-labelledby when no aria-label is present', async () => {
			// When no aria-label is present, there is no accessible name to preserve, so the
			// aria-describedby -> aria-labelledby promotion workaround must still apply.
			const propsWithoutLabel = {
				...mockedProps,
				'aria-label': undefined,
				'aria-describedby': describedById,
			};

			const { baseElement } = render(<Input {...propsWithoutLabel} />);

			const input = baseElement.querySelector('input');

			expect(input?.getAttribute('aria-labelledby')).toEqual(describedById);

			// aria-labelledby references an element that does not exist in this isolated
			// render, which trips the automatic a11y check; mirrors the existing tests above.
			// eslint-disable-next-line @atlassian/a11y/no-violation-count
			await expect(document.body).toBeAccessible({ violationCount: 2 });
		});

		it('should preserve an explicit aria-labelledby even when aria-label is present (A11Y-37267)', async () => {
			const propsWithBoth = {
				...mockedProps,
				'aria-label': ariaLabel,
				'aria-labelledby': labelledById,
				'aria-describedby': describedById,
			};

			const { baseElement } = render(<Input {...propsWithBoth} />);

			const input = baseElement.querySelector('input');

			// An explicit aria-labelledby is a deliberate association with a visible label element
			// and is the field's true accessible name (WCAG 2.5.3), so it must be preserved.
			expect(input).toHaveAttribute('aria-labelledby', labelledById);
			expect(input).toHaveAttribute('aria-describedby', describedById);
			expect(input).toHaveAttribute('aria-label', ariaLabel);
		});
	});
});
