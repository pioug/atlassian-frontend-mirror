import React from 'react';
import { IntlProvider } from 'react-intl';
import { render, screen, userEvent } from '@atlassian/testing-library';
import { DeleteUserContentPreviewScreen } from '../../components/DeleteUserContentPreviewScreen';
import { catherineHirons } from '../../mocks/users';
import { type DeleteUserContentPreviewScreenProps } from '../../components/DeleteUserContentPreviewScreen/types';

const defaultProps: DeleteUserContentPreviewScreenProps = {
	isCurrentUser: false,
	user: catherineHirons,
	preferenceSelection: (name: string) => jest.fn(),
};

const renderWithIntl = (props = {}) =>
	render(
		<IntlProvider locale="en">
			<DeleteUserContentPreviewScreen {...defaultProps} {...props} />
		</IntlProvider>,
	);

describe('DeleteUserContentPreviewScreen', () => {
	test('capture and report a11y violations', async () => {
		const { container } = renderWithIntl();
		await expect(container).toBeAccessible();
	});

	test('componentDidMount calls the preferenceSelection prop', () => {
		const spyPreferenceSelection = jest.fn();
		renderWithIntl({ preferenceSelection: spyPreferenceSelection });
		expect(spyPreferenceSelection).toHaveBeenCalledTimes(1);
	});
});

describe('handleClickSelection', () => {
	test('calls "preferenceSelection" prop', async () => {
		const preferenceSelection = jest.fn();
		renderWithIntl({ preferenceSelection });
		await userEvent.click(screen.getByText(catherineHirons.fullName));
		expect(preferenceSelection).toHaveBeenCalledWith('Name');
	});
});
