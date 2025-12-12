import React from 'react';
import type { OptionType, SelectProps } from '@atlaskit/select';
import { shallow, mount } from 'enzyme';
import { render } from '@testing-library/react';
import { Input } from '../../../components/Input';
import { type AriaAttributesType } from '../../../types';

describe('ClearIndicator', () => {
	const shallowInput = (props: any) => shallow(<Input {...props} />);
	const noop = () => {};

	const labelledById = 'test-labelledby';
	const describedById = 'test-described';

	type MockProps = {
		'aria-describedby'?: AriaAttributesType;
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

			await expect(document.body).toBeAccessible({ violationCount: 1 });
		});

		it('should have aria-describedby if passed from selectProps', async () => {
			mockedProps.selectProps = {
				'aria-describedby': describedById,
			};

			const { baseElement } = render(<Input {...mockedProps} />);

			const ariaAttr = baseElement.querySelector(ariaSelector);

			expect(ariaAttr).toBeInTheDocument();

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

			await expect(document.body).toBeAccessible({ violationCount: 2 });
		});
	});

	describe('aria-labelledby', () => {
		const ariaSelector = '[aria-labelledby]';

		it('should have no aria-labelledby by default', async () => {
			const { baseElement } = render(<Input {...mockedProps} />);

			const ariaAttr = baseElement.querySelector(ariaSelector);

			expect(ariaAttr).not.toBeInTheDocument();

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

			await expect(document.body).toBeAccessible({ violationCount: 2 });
		});
	});
});
