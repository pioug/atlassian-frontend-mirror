import React, { type ComponentProps } from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import Radio from '../../radio';
import RadioGroup from '../../radio-group';

type OptionProps = ComponentProps<typeof Radio>;

const fakeName = 'axe-test-radio-name';
const fakeLabel = 'Axe test radio label';
const fakeValue = 'axe test radio value';

describe('Radio', () => {
	const defaultProps: OptionProps = {
		name: fakeName,
		label: fakeLabel,
		value: fakeValue,
	};

	it('passes basic aXe audit on the initial rendered state', async () => {
		const view = render(<Radio {...defaultProps} />);
		await axe(view.container);
	});

	it('passes basic aXe audit on the checked state', async () => {
		const view = render(<Radio {...defaultProps} isChecked />);
		await axe(view.container);
	});

	it('passes basic aXe audit on the disabled state', async () => {
		const view = render(<Radio {...defaultProps} isDisabled />);
		await axe(view.container);
	});

	it('passes basic aXe audit on the invalid state', async () => {
		const view = render(<Radio {...defaultProps} isInvalid />);
		await axe(view.container);
	});

	it('passes basic aXe audit on the required state', async () => {
		const view = render(<Radio {...defaultProps} isRequired />);
		await axe(view.container);
	});

	it('passes basic aXe audit on the required state', async () => {
		const view = render(<Radio {...defaultProps} isRequired />);
		await axe(view.container);
	});
});

type RadioGroupProps = ComponentProps<typeof RadioGroup>;
type Option = RadioGroupProps['options'][0];

const fakeOption: Option = {
	label: fakeLabel,
	name: fakeName,
	value: fakeValue,
};

const fakeOptionTwo: Option = {
	label: fakeLabel + '-two',
	name: fakeName + '-two',
	value: fakeValue + '-two',
};

const fakeDisabledOption: Option = {
	label: fakeLabel + '-disabled',
	name: fakeName + '-disabled',
	value: fakeValue + '-disabled',
	isDisabled: true,
};

describe('RadioGroup', () => {
	const defaultProps: RadioGroupProps = {
		options: [fakeOption, fakeOptionTwo, fakeDisabledOption],
	};

	it('passes basic aXe audit on the initial rendered state', async () => {
		const view = render(<RadioGroup {...defaultProps} />);
		await axe(view.container);
	});

	it('passes basic aXe audit on the disabled state', async () => {
		const view = render(<RadioGroup {...defaultProps} isDisabled />);
		await axe(view.container);
	});

	it('passes basic aXe audit on the invalid state', async () => {
		const view = render(<RadioGroup {...defaultProps} isInvalid />);
		await axe(view.container);
	});

	it('passes basic aXe audit on the required state', async () => {
		const view = render(<RadioGroup {...defaultProps} isRequired />);
		await axe(view.container);
	});

	it('passes basic aXe audit on the required state', async () => {
		const view = render(<RadioGroup {...defaultProps} isRequired />);
		await axe(view.container);
	});
});
