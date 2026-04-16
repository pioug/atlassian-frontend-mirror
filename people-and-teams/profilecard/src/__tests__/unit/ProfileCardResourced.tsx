import React from 'react';

import { act, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { ffTest } from '@atlassian/feature-flags-test-utils';
import { renderWithAnalyticsListener as render } from '@atlassian/ptc-test-utils';

import ProfileClient from '../../client/ProfileCardClient';
import ProfileCardResourced from '../../components/User/ProfileCardResourced';
import { profileCardRendered } from '../../util/analytics';

import { flexiTime } from './helper/_mock-analytics';

const clientUrl = 'https://foo/';
const client = new ProfileClient({
	url: clientUrl,
});

// Mock for runItLater
(window as any).requestIdleCallback = (callback: () => void) => callback();

const defaultProps: React.ComponentProps<typeof ProfileCardResourced> = {
	cloudId: 'test-cloud-id',
	userId: 'test-user-id',
	resourceClient: client,
};

const waitForPromises = () => new Promise((resolve) => setTimeout(resolve));

const renderComponent = (
	partialProps: Partial<React.ComponentProps<typeof ProfileCardResourced>> = {},
) => {
	return render(
		<IntlProvider locale="en" defaultLocale="en-US">
			<ProfileCardResourced {...defaultProps} {...partialProps} />
		</IntlProvider>,
	);
};

beforeEach(() => {
	jest.spyOn(client, 'getProfile').mockResolvedValue({});
	jest.spyOn(client, 'getReportingLines').mockResolvedValue({});
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('Fetching data', () => {
	it('should start to fetch data when mounting', async () => {
		renderComponent();

		expect(defaultProps.resourceClient.getProfile).toHaveBeenCalledWith(
			defaultProps.cloudId,
			defaultProps.userId,
			expect.any(Function),
		);
		expect(defaultProps.resourceClient.getReportingLines).toHaveBeenCalledWith(defaultProps.userId);
	});

	it('should start to fetch data when userId prop changes', async () => {
		renderComponent({ userId: 'new-test-user-id' });
		await act(async () => {
			await waitForPromises();
		});

		expect(defaultProps.resourceClient.getProfile).toHaveBeenCalledWith(
			defaultProps.cloudId,
			'new-test-user-id',
			expect.any(Function),
		);
		expect(defaultProps.resourceClient.getReportingLines).toHaveBeenCalledWith('new-test-user-id');
	});

	it('should re-fetch when "resourceClient" prop changes', async () => {
		const newClient = new ProfileClient({
			url: clientUrl,
		});
		jest.spyOn(newClient, 'getProfile').mockResolvedValue({});
		jest.spyOn(newClient, 'getReportingLines').mockResolvedValue({});
		renderComponent({ resourceClient: newClient });
		await act(async () => {
			await waitForPromises();
		});

		expect(newClient.getProfile).toHaveBeenCalledWith(
			defaultProps.cloudId,
			'test-user-id',
			expect.any(Function),
		);
		expect(newClient.getReportingLines).toHaveBeenCalledWith('test-user-id');
	});
});

describe('hideReportingLines', () => {
	ffTest.on('jira_ai_profilecard_hide_reportinglines', 'feature gate enabled', () => {
		it('should NOT call getReportingLines when hideReportingLines is true', async () => {
			renderComponent({ hideReportingLines: true });

			expect(defaultProps.resourceClient.getProfile).toHaveBeenCalled();
			expect(defaultProps.resourceClient.getReportingLines).not.toHaveBeenCalled();
		});

		it('should still call getReportingLines when hideReportingLines is false', async () => {
			renderComponent({ hideReportingLines: false });

			expect(defaultProps.resourceClient.getReportingLines).toHaveBeenCalledWith(
				defaultProps.userId,
			);
		});

		it('should still call getReportingLines when hideReportingLines is not set', async () => {
			renderComponent();

			expect(defaultProps.resourceClient.getReportingLines).toHaveBeenCalledWith(
				defaultProps.userId,
			);
		});

		it('should not render reporting lines section when hideReportingLines is true', async () => {
			jest.spyOn(client, 'getProfile').mockResolvedValue({
				status: 'active',
				isBot: false,
				fullName: 'Test User',
			});

			renderComponent({ hideReportingLines: true });

			await waitFor(() => {
				expect(screen.getByTestId('profilecard')).toBeInTheDocument();
			});

			expect(screen.queryByText('Manager')).not.toBeInTheDocument();
			expect(screen.queryByText('Direct reports')).not.toBeInTheDocument();
		});
	});

	ffTest.off('jira_ai_profilecard_hide_reportinglines', 'feature gate disabled', () => {
		it('should always call getReportingLines even when hideReportingLines is true', async () => {
			renderComponent({ hideReportingLines: true });

			expect(defaultProps.resourceClient.getReportingLines).toHaveBeenCalledWith(
				defaultProps.userId,
			);
		});
	});
});

describe('ProfileCardResourced', () => {
	describe('when having error', () => {
		it('should render the ErrorMessage component', async () => {
			jest.spyOn(client, 'getProfile').mockRejectedValueOnce({
				message: 'test-error',
				reason: 'default',
			});
			renderComponent();

			await waitFor(() => {
				expect(screen.getByTestId('profile-card-resourced-error-state')).toBeInTheDocument();
			});
		});

		it('should trigger analytics', async () => {
			const expectedErrorEvent = flexiTime(
				profileCardRendered('user', 'error', {
					hasRetry: true,
					errorType: 'default',
				}),
			);

			jest.spyOn(client, 'getProfile').mockRejectedValue({
				message: 'test-error',
				reason: 'default',
			});
			const { expectEventToBeFired } = renderComponent();

			const { eventType, ...event } = expectedErrorEvent;

			await waitFor(() => {
				expectEventToBeFired(eventType, event);
			});
		});
	});
});
