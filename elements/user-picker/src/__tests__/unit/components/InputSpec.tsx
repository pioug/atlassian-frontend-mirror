import React from 'react';
import type { OptionType, SelectProps } from '@atlaskit/select';
import { shallow, mount } from 'enzyme';
import { render } from '@testing-library/react';
import { passGate, failGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { Input } from '../../../components/Input';
import { type AriaAttributesType } from '../../../types';

describe('ClearIndicator', () => {
	const shallowInput = (props: any) => shallow(<Input {...props} />);
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
			//@ts-ignore react-select unsupported props
			selectProps: { disableInput: false },
			cx: noop,
			getStyles: noop,
			getClassNames: noop,
		};
	});

	it('should be enabled by default', async () => {
		const component = shallowInput({
			selectProps: {},
		});

		expect(component.prop('isDisabled')).toBeFalsy();

		await expect(document.body).toBeAccessible();
	});

	it('should fire event.preventDefault() if isDisabled', async () => {
		//@ts-ignore react-select unsupported props
		mockedProps.selectProps.disableInput = true;

		const spiedPreventDefault = jest.fn();
		const component = mount(<Input {...mockedProps} />);
		component.find('input').simulate('keyPress', {
			key: 'a',
			preventDefault: spiedPreventDefault,
		});
		expect(spiedPreventDefault).toHaveBeenCalledTimes(1);
		// Backspace shoud still register for deleting selected users
		component.find('input').simulate('keyPress', {
			key: 'Backspace',
			preventDefault: spiedPreventDefault,
		});
		expect(spiedPreventDefault).toHaveBeenCalledTimes(2);

		await expect(document.body).toBeAccessible();
	});

	it('should fire event.preventDefault() only on `Enter` key pressed', async () => {
		const spiedPreventDefault = jest.fn();
		const component = mount(<Input {...mockedProps} />);
		component.find('input').simulate('keyPress', {
			key: 'a',
			preventDefault: spiedPreventDefault,
		});
		expect(spiedPreventDefault).not.toHaveBeenCalled();
		component.find('input').simulate('keyPress', {
			key: 'Enter',
			preventDefault: spiedPreventDefault,
		});
		expect(spiedPreventDefault).toHaveBeenCalledTimes(1);

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
				'aria-describedby': describedById,
			};

			const { baseElement } = render(<Input {...mockedProps} />);

			const ariaAttr = baseElement.querySelector(ariaSelector);

			expect(ariaAttr?.getAttribute('aria-labelledby')).toEqual(describedById);

			// eslint-disable-next-line @atlassian/a11y/no-violation-count
			await expect(document.body).toBeAccessible({ violationCount: 2 });
		});
	});

	describe('platform_user_picker_fix_redundant_labelledby', () => {
		const ariaLabel = 'Enter names or emails';

		describe('gate on', () => {
			it('should not promote aria-describedby to aria-labelledby when aria-label is present', async () => {
				passGate('platform_user_picker_fix_redundant_labelledby');

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
				passGate('platform_user_picker_fix_redundant_labelledby');

				// With the gate on but no aria-label, there is no accessible name to preserve, so the
				// aria-describedby -> aria-labelledby promotion workaround must still apply.
				const propsWithoutLabel = {
					...mockedProps,
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
				passGate('platform_user_picker_fix_redundant_labelledby');

				const propsWithBoth = {
					...mockedProps,
					'aria-label': ariaLabel,
					'aria-labelledby': labelledById,
					'aria-describedby': describedById,
				};

				const { baseElement } = render(<Input {...propsWithBoth} />);

				const input = baseElement.querySelector('input');

				// An explicit aria-labelledby is a deliberate association with a visible label element
				// and is the field's true accessible name (WCAG 2.5.3), so it must be preserved. Only
				// the promoted aria-describedby -> aria-labelledby workaround is suppressed by the gate.
				expect(input).toHaveAttribute('aria-labelledby', labelledById);
				expect(input).toHaveAttribute('aria-describedby', describedById);
				expect(input).toHaveAttribute('aria-label', ariaLabel);
			});
		});

		describe('gate off', () => {
			it('should keep the legacy behaviour and promote aria-describedby even when aria-label is present', async () => {
				failGate('platform_user_picker_fix_redundant_labelledby');

				const propsWithLabel = {
					...mockedProps,
					'aria-label': ariaLabel,
					'aria-describedby': describedById,
				};

				const { baseElement } = render(<Input {...propsWithLabel} />);

				const input = baseElement.querySelector('input');

				expect(input?.getAttribute('aria-labelledby')).toEqual(describedById);
			});
		});
	});
});
