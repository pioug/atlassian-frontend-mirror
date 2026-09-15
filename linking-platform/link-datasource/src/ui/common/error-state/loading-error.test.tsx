import React, { type ComponentPropsWithoutRef } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { LoadingError } from './loading-error';
import { loadingErrorMessages, missingColumnsMessages } from './messages';

const fireEventMock = jest.fn();
jest.mock('../../../analytics/index', () => ({
	...jest.requireActual('../../../analytics/index'),
	useDatasourceAnalyticsEvents: jest.fn(() => ({
		fireEvent: fireEventMock,
	})),
}));

const mockRefresh = jest.fn();
const setup = (props: Partial<ComponentPropsWithoutRef<typeof LoadingError>> = {}) =>
	render(<LoadingError onRefresh={mockRefresh} {...props} />, {
		wrapper: ({ children }) => <IntlProvider locale="en">{children}</IntlProvider>,
	});

describe('LoadingError', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = setup();
		await expect(container).toBeAccessible();
	});

	it('should fire "ui.error.shown" with reason as "network" when the user request failed', () => {
		setup();

		expect(fireEventMock).toHaveBeenCalledWith('ui.error.shown', { reason: 'network' });
	});

	it('should show link to go to Jira', () => {
		const url = 'https://www.atlassian.com/issues/?jql=project%20%3D%20%22JIRA%22';
		setup({ url });

		const link = screen.queryByRole('link', { name: 'open this search in Jira' });

		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute('href', url);
	});

	it('should show link to go to Jira when there is no slash after issues', () => {
		const url = 'https://www.atlassian.com/issues?jql=project%20%3D%20%22JIRA%22';
		setup({ url });

		const link = screen.queryByRole('link', { name: 'open this search in Jira' });

		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute('href', url);
	});

	it('should show link to go to Confluence', () => {
		const url = 'https://www.atlassian.com/wiki/search/something?query=search';
		setup({ url });

		const link = screen.queryByRole('link', { name: 'open this search in Confluence' });

		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute('href', url);
	});

	it('should show generic message when url is not jira or confluence', () => {
		const url = 'https://www.atlassian.com/software/confluence';
		setup({ url });

		const link = screen.queryByRole('link', { name: 'open this search in Confluence' });
		expect(link).not.toBeInTheDocument();

		expect(
			screen.getByText(loadingErrorMessages.checkConnection.defaultMessage),
		).toBeInTheDocument();
	});
	it('shows column recovery instructions without a refresh action', async () => {
		passGate('platform_datasource_missing_columns_error');
		fireEventMock.mockClear();
		const { container } = setup({
			errorType: 'missing-columns',
			url: 'https://example.atlassian.net/issues/?jql=key%3DTEST-1',
		});

		expect(
			screen.getByText(missingColumnsMessages.missingColumnsTitle.defaultMessage),
		).toBeInTheDocument();
		expect(screen.getByTestId('datasource--loading-error')).toHaveTextContent(
			"The selected columns aren't available. Edit this table to select different columns.",
		);
		expect(screen.queryByText(/Check your connection/)).not.toBeInTheDocument();
		expect(fireEventMock).not.toHaveBeenCalled();
		expect(screen.queryByRole('button', { name: 'Refresh' })).not.toBeInTheDocument();
		await expect(container).toBeAccessible();
	});
	it('preserves network messages, analytics and refresh when the gate is disabled', () => {
		fireEventMock.mockClear();
		failGate('platform_datasource_missing_columns_error');
		setup({
			errorType: 'missing-columns',
			url: 'https://example.atlassian.net/issues/?jql=key%3DTEST-1',
		});

		expect(
			screen.getByText(loadingErrorMessages.unableToLoadResults.defaultMessage),
		).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'open this search in Jira' })).toBeInTheDocument();
		expect(fireEventMock).toHaveBeenCalledWith('ui.error.shown', { reason: 'network' });

		expect(screen.getByRole('button', { name: 'Refresh' })).toBeEnabled();
	});
	it('keeps refresh available for network errors', async () => {
		mockRefresh.mockClear();
		setup();

		const refresh = screen.getByRole('button', { name: 'Refresh' });
		expect(refresh).toBeEnabled();
		await userEvent.click(refresh);
		expect(mockRefresh).toHaveBeenCalledTimes(1);
	});
	it('lists all unavailable saved column keys', () => {
		passGate('platform_datasource_missing_columns_error');
		setup({
			errorType: 'missing-columns',
			unavailableColumnKeys: ['release blocker tickets', 'customfield_12345'],
		});

		expect(screen.getByTestId('datasource--loading-error')).toHaveTextContent(
			"These columns aren't available: release blocker tickets and customfield_12345. Edit this table to select different columns.",
		);
	});
});
