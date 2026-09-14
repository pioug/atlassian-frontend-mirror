import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import Select from '@atlaskit/select/default';

import {
	BaseUserPicker,
	BaseUserPickerWithoutAnalytics,
	type BaseUserPickerProps,
} from '../../../components/BaseUserPicker';
import { getComponents } from '../../../components/components';
import { type User } from '../../../types';

const options: User[] = [
	{
		id: 'abc-123',
		name: 'Jace Beleren',
		publicName: 'jbeleren',
		type: 'user',
	},
	{
		id: '123-abc',
		name: 'Chandra Nalaar',
		publicName: 'cnalaar',
		type: 'user',
	},
];

const renderBase = (
	props: Partial<BaseUserPickerProps> = {},
	BasePicker:
		| typeof BaseUserPickerWithoutAnalytics
		| typeof BaseUserPicker = BaseUserPickerWithoutAnalytics,
) =>
	render(
		<IntlProvider locale="en">
			<BasePicker
				inputId="test"
				fieldId="test"
				aria-label="Test"
				SelectComponent={Select}
				styles={{}}
				components={getComponents(props.isMulti)}
				width="100%"
				{...props}
			/>
		</IntlProvider>,
	);

describe('BaseUserPicker', () => {
	it('should render a combobox', async () => {
		renderBase({ options });

		expect(screen.getByRole('combobox')).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	it('should disable picker if isDisabled is true', async () => {
		renderBase({ isDisabled: true });

		expect(screen.getByRole('combobox', { hidden: true })).toBeDisabled();
		await expect(document.body).toBeAccessible();
	});

	it('should set a custom placeholder', async () => {
		renderBase({ placeholder: 'custom placeholder' });

		expect(screen.getByText('custom placeholder')).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	it('should show options when opened', async () => {
		renderBase({ options, open: true });

		expect(await screen.findByText('Jace Beleren')).toBeInTheDocument();
		expect(screen.getByText('Chandra Nalaar')).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	it('should invoke onFocus with the input focus event', async () => {
		const onFocus = jest.fn();
		renderBase({ onFocus });

		fireEvent.focus(screen.getByRole('combobox'));
		await waitFor(() => expect(onFocus).toHaveBeenCalled());
		await expect(document.body).toBeAccessible();
	});

	it('should invoke onSelection when an option is selected', async () => {
		const onSelection = jest.fn();
		renderBase({ options, open: true, onSelection });

		fireEvent.click(await screen.findByText('Jace Beleren'));
		await waitFor(() => expect(onSelection).toHaveBeenCalled());
		expect(onSelection.mock.calls[0][0]).toEqual(options[0]);
		await expect(document.body).toBeAccessible();
	});

	it('should render multiple selected values', async () => {
		renderBase({ options, isMulti: true, value: options });

		expect(screen.getByText('Jace Beleren')).toBeInTheDocument();
		expect(screen.getByText('Chandra Nalaar')).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	it('should expose aria-labelledby on the input', async () => {
		renderBase({ ariaLabelledBy: 'label-id' });

		expect(screen.getByRole('combobox')).toHaveAttribute('aria-labelledby', 'label-id');
		await expect(document.body).toBeAccessible();
	});

	it('should emit analytics events through the analytics wrapper', async () => {
		const onSelection = jest.fn();
		renderBase({ options, open: true, onSelection }, BaseUserPicker);

		fireEvent.click(await screen.findByText('Jace Beleren'));
		await waitFor(() => expect(onSelection).toHaveBeenCalled());
		await expect(document.body).toBeAccessible();
	});
});
