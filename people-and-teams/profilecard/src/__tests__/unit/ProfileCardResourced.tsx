import React from 'react';

import { act, render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import ProfileClient from '../../client/ProfileCardClient';
import { ProfileCardResourcedInternal as ProfileCardResourced } from '../../components/User/ProfileCardResourced';
import { profileCardRendered } from '../../util/analytics';

const clientUrl = 'https://foo/';
const client = new ProfileClient({
	url: clientUrl,
});

const flexiTime = (event: Record<string, any>) => ({
	...event,
	attributes: {
		...event.attributes,
		firedAt: expect.anything(),
	},
});

const mockAnalytics = jest.fn();
mockAnalytics.mockReturnValue({
	fire: () => null,
});

// Mock for runItLater
(window as any).requestIdleCallback = (callback: () => void) => callback();

const defaultProps: React.ComponentProps<typeof ProfileCardResourced> = {
	cloudId: 'test-cloud-id',
	userId: 'test-user-id',
	resourceClient: client,
	createAnalyticsEvent: mockAnalytics,
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
		renderComponent({ resourceClient: newClient });
		await act(async () => {
			await waitForPromises();
		});

		expect(newClient.getProfile).toHaveBeenCalledWith(
			defaultProps.cloudId,
			'test-user-id',
			expect.any(Function),
		);
		expect(defaultProps.resourceClient.getReportingLines).toHaveBeenCalledWith('test-user-id');
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
			mockAnalytics.mockClear();

			jest.spyOn(client, 'getProfile').mockRejectedValueOnce({
				message: 'test-error',
				reason: 'default',
			});
			renderComponent();

			await waitFor(() => {
				expect(mockAnalytics).toHaveBeenCalledWith(expectedErrorEvent);
			});
		});
	});
});
