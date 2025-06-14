import React, { type ComponentPropsWithoutRef } from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { LoadingError } from './loading-error';
import { loadingErrorMessages } from './messages';

const fireEventMock = jest.fn();
jest.mock('../../../analytics', () => ({
	...jest.requireActual('../../../analytics'),
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

	ffTest.both('platform-linking-visual-refresh-sllv', '', () => {
		it('should show link to go to Jira', () => {
			const url = 'https://www.atlassian.com/issues/?jql=project%20%3D%20%22JIRA%22';
			setup({ url });

			const link = screen.queryByRole('link', { name: 'open this search in Jira' });

			if (fg('platform-linking-visual-refresh-sllv')) {
				expect(link).toBeInTheDocument();
				expect(link).toHaveAttribute('href', url);
			} else {
				expect(link).not.toBeInTheDocument();
			}
		});

		it('should show link to go to Jira when there is no slash after issues', () => {
			const url = 'https://www.atlassian.com/issues?jql=project%20%3D%20%22JIRA%22';
			setup({ url });

			const link = screen.queryByRole('link', { name: 'open this search in Jira' });

			if (fg('platform-linking-visual-refresh-sllv')) {
				expect(link).toBeInTheDocument();
				expect(link).toHaveAttribute('href', url);
			} else {
				expect(link).not.toBeInTheDocument();
			}
		});

		it('should show link to go to Confluence', () => {
			const url = 'https://www.atlassian.com/wiki/search/something?query=search';
			setup({ url });

			const link = screen.queryByRole('link', { name: 'open this search in Confluence' });

			if (fg('platform-linking-visual-refresh-sllv')) {
				expect(link).toBeInTheDocument();
				expect(link).toHaveAttribute('href', url);
			} else {
				expect(link).not.toBeInTheDocument();
			}
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
	});
});
