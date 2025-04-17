import React, { ComponentPropsWithoutRef } from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { NoResults } from './no-results';

const fireEventMock = jest.fn();
jest.mock('../../../analytics', () => ({
	...jest.requireActual('../../../analytics'),
	useDatasourceAnalyticsEvents: jest.fn(() => ({
		fireEvent: fireEventMock,
	})),
}));

const mockRefresh = jest.fn();
const setup = (props: Partial<ComponentPropsWithoutRef<typeof NoResults>> = {}) =>
	render(<NoResults onRefresh={mockRefresh} {...props} />, {
		wrapper: ({ children }) => <IntlProvider locale="en">{children}</IntlProvider>,
	});

describe('LoadingError', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = setup();
		await expect(container).toBeAccessible();
	});

	it('should fire "ui.emptyResult.shown.datasource" when page loads', () => {
		setup();

		expect(fireEventMock).toHaveBeenCalledWith('ui.emptyResult.shown.datasource', {});
	});
});
