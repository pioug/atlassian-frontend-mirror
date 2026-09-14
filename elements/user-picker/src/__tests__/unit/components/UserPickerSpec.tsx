import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { UserPickerWithoutAnalytics } from '../../../components/UserPicker';
import { type User } from '../../../types';

const options: User[] = [
	{ id: 'abc-123', name: 'Jace Beleren', publicName: 'jbeleren' },
	{ id: '123-abc', name: 'Chandra Nalaar', publicName: 'cnalaar' },
];

const renderPicker = (props: React.ComponentProps<typeof UserPickerWithoutAnalytics>) =>
	render(
		<IntlProvider locale="en">
			<UserPickerWithoutAnalytics {...props} />
		</IntlProvider>,
	);

describe('UserPicker', () => {
	it('should render the default picker', async () => {
		renderPicker({ fieldId: 'test', options });

		expect(screen.getByRole('combobox')).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	it('should render options when opened', async () => {
		renderPicker({ fieldId: 'test', options, open: true });

		expect(await screen.findByText('Jace Beleren')).toBeInTheDocument();
		expect(screen.getByText('Chandra Nalaar')).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	it('should render a disabled picker', async () => {
		renderPicker({ fieldId: 'test', isDisabled: true });

		expect(screen.getByRole('combobox', { hidden: true })).toBeDisabled();
		await expect(document.body).toBeAccessible();
	});

	it('should call onSelection after selecting an option', async () => {
		const onSelection = jest.fn();
		renderPicker({ fieldId: 'test', options, open: true, onSelection });

		fireEvent.click(await screen.findByText('Jace Beleren'));
		await waitFor(() => expect(onSelection).toHaveBeenCalled());
		expect(onSelection.mock.calls[0][0]).toEqual(options[0]);
	});
});
