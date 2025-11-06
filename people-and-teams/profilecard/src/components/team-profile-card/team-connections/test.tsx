import React from 'react';

import { screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import FeatureGates from '@atlaskit/feature-gate-js-client';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import {
	mockRunItLaterSynchronously,
	renderWithAnalyticsListener as render,
} from '@atlassian/ptc-test-utils';

jest.mock('@atlaskit/feature-gate-js-client', () => ({
	...jest.requireActual('@atlaskit/feature-gate-js-client'),
	getExperimentValue: jest.fn(),
	initializeCalled: jest.fn().mockReturnValue(true),
}));

mockRunItLaterSynchronously();

import { TeamConnections } from './main';

describe('TeamConnections', () => {
	const renderComponent = () =>
		render(
			<IntlProvider locale="en">
				<TeamConnections
					containerType={'ConfluenceSpace'}
					title={'Test Confluence Space'}
					onDisconnectButtonClick={() => {}}
					link="https://test-dev.com"
				/>
			</IntlProvider>,
		);

	it('should capture and report a11y violations', async () => {
		const { container } = renderComponent();
		await expect(container).toBeAccessible();
	});

	it('should display the container icon', () => {
		renderComponent();

		const containerIcon = screen.getByTestId('linked-container-ConfluenceSpace-icon');
		expect(containerIcon).toBeInTheDocument();
	});

	it('should display the container title', () => {
		renderComponent();

		const containerTitle = screen.getByText('Test Confluence Space');
		expect(containerTitle).toBeInTheDocument();
	});

	it('should display the container type', () => {
		renderComponent();

		expect(screen.getByText('Confluence')).toBeInTheDocument();
		expect(screen.getByText('space')).toBeInTheDocument();
	});

	it('should display the right container type icon for a Confluence space', () => {
		renderComponent();

		const containerTypeIcon = screen.getByTestId('confluence-space-container-icon');
		expect(containerTypeIcon).toBeInTheDocument();
	});

	it('should render a link with the item', async () => {
		(FeatureGates.getExperimentValue as jest.Mock).mockImplementation((exp) =>
			exp === 'new_team_profile' || exp === 'team_lens_in_atlassian_home' ? false : true,
		);
		renderComponent();

		const downloadCsvLink = screen.getByRole('link', {
			name: 'Test Confluence Space Confluence space',
		});
		expect(downloadCsvLink).toHaveAttribute('href', 'https://test-dev.com');
	});

	it('should display the right container type icon for a Jira project', () => {
		render(
			<IntlProvider locale="en">
				<TeamConnections
					containerType={'JiraProject'}
					title={'Test Jira Project'}
					onDisconnectButtonClick={() => {}}
				/>
			</IntlProvider>,
		);

		const containerTypeIcon = screen.getByTestId('jira-project-container-icon');
		expect(containerTypeIcon).toBeInTheDocument();
	});

	describe('Analytics', () => {
		const event = {
			action: 'clicked',
			actionSubject: 'teamConnectionItem',
			actionSubjectId: 'teamProfileCard',
			attributes: {
				container: 'ConfluenceSpace',
			},
		};
		ffTest.off('ptc-enable-profile-card-analytics-refactor', 'legacy analytics', () => {
			it('should fire the correct analytics event', async () => {
				const { user, expectEventToBeFired } = renderComponent();

				const teamConnectionItem = screen.getByTestId('team-connection-item');
				expect(teamConnectionItem).toBeInTheDocument();
				await user.click(teamConnectionItem);
				expectEventToBeFired('ui', event);
			});
		});

		ffTest.on('ptc-enable-profile-card-analytics-refactor', 'new analytics', () => {
			it('should fire the correct analytics event', async () => {
				const { user, expectEventToBeFired } = renderComponent();

				const teamConnectionItem = screen.getByTestId('team-connection-item');
				expect(teamConnectionItem).toBeInTheDocument();
				await user.click(teamConnectionItem);
				expectEventToBeFired('ui', event);
			});
		});
	});
});
