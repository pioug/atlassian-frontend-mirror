jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));

import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import FeatureGates from '@atlaskit/feature-gate-js-client';
import { fg } from '@atlaskit/platform-feature-flags';

import { getContainerProperties, messages } from '../get-container-properties';

jest.mock('@atlaskit/feature-gate-js-client', () => ({
	...jest.requireActual('@atlaskit/feature-gate-js-client'),
	initialize: jest.fn(),
	initializeCalled: jest.fn(),
	initializeFromValues: jest.fn(),
	getExperimentValue: jest.fn(),
	checkGate: jest.fn(),
	initializeCompleted: () => true,
}));

const renderWithIntl = (node: React.ReactNode) => {
	return render(<IntlProvider locale="en">{node}</IntlProvider>);
};

describe('getContainerProperties', () => {
	beforeEach(() => {
		(fg as jest.Mock).mockReturnValue(false);
	});

	it('should return correct properties for confluence container type', async () => {
		const properties = getContainerProperties({
			containerType: 'ConfluenceSpace',
		});
		renderWithIntl(properties.description);
		expect(
			screen.getByText(messages.confluenceContainerDescription.defaultMessage),
		).toBeInTheDocument();
		expect(properties.icon).toBeTruthy();
		renderWithIntl(properties.title);
		expect(
			screen.getByText(messages.addConfluenceContainerTitle.defaultMessage),
		).toBeInTheDocument();

		await expect(document.body).toBeAccessible();
	});

	it('should return correct properties for jira container type', async () => {
		const properties = getContainerProperties({
			containerType: 'JiraProject',
		});
		renderWithIntl(properties.description);
		expect(screen.getByText(messages.jiraProjectDescription.defaultMessage)).toBeInTheDocument();
		expect(properties.icon).toBeTruthy();
		renderWithIntl(properties.title);
		expect(screen.getByText(messages.addJiraProjectTitle.defaultMessage)).toBeInTheDocument();

		await expect(document.body).toBeAccessible();
	});

	it('should return correct properties for web link container type in empty state', async () => {
		const properties = getContainerProperties({
			containerType: 'WebLink',
			isEmptyContainer: true,
		});
		renderWithIntl(properties.description);
		expect(
			screen.getByText(messages.emptyLinkContainerDescription.defaultMessage),
		).toBeInTheDocument();

		await expect(document.body).toBeAccessible();
	});
	it('should return correct properties for web link container type', async () => {
		const properties = getContainerProperties({
			containerType: 'WebLink',
			isEmptyContainer: false,
		});
		renderWithIntl(properties.description);
		expect(screen.getByText(messages.linkContainerDescription.defaultMessage)).toBeInTheDocument();

		await expect(document.body).toBeAccessible();
	});

	it('should return correct properties for web link container type when displayed on profile card', async () => {
		const properties = getContainerProperties({
			containerType: 'WebLink',
			isEmptyContainer: false,
			isDisplayedOnProfileCard: true,
		});
		renderWithIntl(properties.description);
		expect(screen.getByText(messages.linkContainerDescription.defaultMessage)).toBeInTheDocument();

		renderWithIntl(properties.icon);
		expect(screen.getByTestId('team-link-card-external-link-icon')).toBeInTheDocument();
		expect(screen.queryByTestId('team-link-card-globe-icon')).not.toBeInTheDocument();

		await expect(document.body).toBeAccessible();
	});

	it('should return correct properties for web link container type when NOT displayed on profile card', async () => {
		const properties = getContainerProperties({
			containerType: 'WebLink',
			isEmptyContainer: false,
			isDisplayedOnProfileCard: false,
		});
		renderWithIntl(properties.description);
		expect(screen.getByText(messages.linkContainerDescription.defaultMessage)).toBeInTheDocument();

		renderWithIntl(properties.icon);
		expect(screen.getByTestId('team-link-card-globe-icon')).toBeInTheDocument();
		expect(screen.queryByTestId('team-link-card-external-link-icon')).not.toBeInTheDocument();

		await expect(document.body).toBeAccessible();
	});

	it('should use new title for confluence when new team profile is on', async () => {
		(FeatureGates.getExperimentValue as jest.Mock).mockImplementation((exp) =>
			exp === 'new_team_profile' ? true : false,
		);
		(fg as jest.Mock).mockReturnValue(true);
		const properties = getContainerProperties({
			containerType: 'ConfluenceSpace',
		});
		renderWithIntl(properties.title);
		expect(screen.getByText(messages.addConfluenceSpace.defaultMessage)).toBeInTheDocument();

		await expect(document.body).toBeAccessible();
	});

	it('should return correct titles for loom container type when flag off and on', async () => {
		// Off by default from beforeEach
		(FeatureGates.getExperimentValue as jest.Mock).mockReturnValue(false);
		let properties = getContainerProperties({
			containerType: 'LoomSpace',
		});
		renderWithIntl(properties.title);
		expect(screen.getByText(messages.addLoomContainerTitle.defaultMessage)).toBeInTheDocument();

		// Turn flag on
		(FeatureGates.getExperimentValue as jest.Mock).mockImplementation((exp) =>
			exp === 'new_team_profile' ? true : false,
		);
		properties = getContainerProperties({
			containerType: 'LoomSpace',
		});
		renderWithIntl(properties.title);
		expect(screen.getByText(messages.addLoomSpace.defaultMessage)).toBeInTheDocument();

		await expect(document.body).toBeAccessible();
	});

	it('should use new title for jira when new team profile is on', async () => {
		(FeatureGates.getExperimentValue as jest.Mock).mockImplementation((exp) =>
			exp === 'new_team_profile' ? true : false,
		);
		const properties = getContainerProperties({
			containerType: 'JiraProject',
		});
		renderWithIntl(properties.title);
		expect(screen.getByText(messages.addJiraProject.defaultMessage)).toBeInTheDocument();

		await expect(document.body).toBeAccessible();
	});

	it('should set weblink title to null when flag is off and to Add Web Link when flag is on', async () => {
		// Off
		(FeatureGates.getExperimentValue as jest.Mock).mockReturnValue(false);
		let properties = getContainerProperties({
			containerType: 'WebLink',
		});
		expect(properties.title).toBeNull();

		(FeatureGates.getExperimentValue as jest.Mock).mockImplementation((exp) =>
			exp === 'new_team_profile' ? true : false,
		);
		properties = getContainerProperties({
			containerType: 'WebLink',
		});
		renderWithIntl(properties.title);
		expect(screen.getByText(messages.addLink.defaultMessage)).toBeInTheDocument();

		await expect(document.body).toBeAccessible();
	});
});
