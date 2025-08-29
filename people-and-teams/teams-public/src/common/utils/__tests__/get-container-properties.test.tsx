jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));

import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';

import { getContainerProperties, messages } from '../get-container-properties';

const renderWithIntl = (node: React.ReactNode) => {
	return render(<IntlProvider locale="en">{node}</IntlProvider>);
};

describe('getContainerProperties', () => {
	beforeEach(() => {
		(fg as jest.Mock).mockReturnValue(false);
	});

	it('should return correct properties for confluence container type', () => {
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
	});

	it('should return correct properties for jira container type', () => {
		const properties = getContainerProperties({
			containerType: 'JiraProject',
		});
		renderWithIntl(properties.description);
		expect(screen.getByText(messages.jiraProjectDescription.defaultMessage)).toBeInTheDocument();
		expect(properties.icon).toBeTruthy();
		renderWithIntl(properties.title);
		expect(screen.getByText(messages.addJiraProjectTitle.defaultMessage)).toBeInTheDocument();
	});

	it('should return correct properties for web link container type in empty state', () => {
		const properties = getContainerProperties({
			containerType: 'WebLink',
			isEmptyContainer: true,
		});
		renderWithIntl(properties.description);
		expect(
			screen.getByText(messages.emptyWebLinkContainerDescription.defaultMessage),
		).toBeInTheDocument();
	});
	it('should return correct properties for web link container type', () => {
		const properties = getContainerProperties({
			containerType: 'WebLink',
			isEmptyContainer: false,
		});
		renderWithIntl(properties.description);
		expect(
			screen.getByText(messages.webLinkContainerDescription.defaultMessage),
		).toBeInTheDocument();
	});

	it('should return correct properties for web link container type when displayed on profile card', () => {
		const properties = getContainerProperties({
			containerType: 'WebLink',
			isEmptyContainer: false,
			isDisplayedOnProfileCard: true,
		});
		renderWithIntl(properties.description);
		expect(
			screen.getByText(messages.webLinkContainerDescription.defaultMessage),
		).toBeInTheDocument();

		renderWithIntl(properties.icon);
		expect(screen.getByTestId('team-link-card-external-link-icon')).toBeInTheDocument();
		expect(screen.queryByTestId('team-link-card-globe-icon')).not.toBeInTheDocument();
	});

	it('should return correct properties for web link container type when NOT displayed on profile card', () => {
		const properties = getContainerProperties({
			containerType: 'WebLink',
			isEmptyContainer: false,
			isDisplayedOnProfileCard: false,
		});
		renderWithIntl(properties.description);
		expect(
			screen.getByText(messages.webLinkContainerDescription.defaultMessage),
		).toBeInTheDocument();

		renderWithIntl(properties.icon);
		expect(screen.getByTestId('team-link-card-globe-icon')).toBeInTheDocument();
		expect(screen.queryByTestId('team-link-card-external-link-icon')).not.toBeInTheDocument();
	});

	it('should use new title for confluence when enable_new_team_profile is on', () => {
		(fg as jest.Mock).mockReturnValue(true);
		const properties = getContainerProperties({
			containerType: 'ConfluenceSpace',
		});
		renderWithIntl(properties.title);
		expect(
			screen.getByText(messages.addConfluenceSpace.defaultMessage),
		).toBeInTheDocument();
	});

	it('should return correct titles for loom container type when flag off and on', () => {
		// Off by default from beforeEach
		let properties = getContainerProperties({
			containerType: 'LoomSpace',
		});
		renderWithIntl(properties.title);
		expect(
			screen.getByText(messages.addLoomContainerTitle.defaultMessage),
		).toBeInTheDocument();

		// Turn flag on
		(fg as jest.Mock).mockReturnValue(true);
		properties = getContainerProperties({
			containerType: 'LoomSpace',
		});
		renderWithIntl(properties.title);
		expect(screen.getByText(messages.addLoomSpace.defaultMessage)).toBeInTheDocument();
	});

	it('should use new title for jira when enable_new_team_profile is on', () => {
		(fg as jest.Mock).mockReturnValue(true);
		const properties = getContainerProperties({
			containerType: 'JiraProject',
		});
		renderWithIntl(properties.title);
		expect(screen.getByText(messages.addJiraProject.defaultMessage)).toBeInTheDocument();
	});

	it('should set weblink title to null when flag is off and to Add Web Link when flag is on', () => {
		// Off
		let properties = getContainerProperties({
			containerType: 'WebLink',
		});
		expect(properties.title).toBeNull();

		// On
		(fg as jest.Mock).mockReturnValue(true);
		properties = getContainerProperties({
			containerType: 'WebLink',
		});
		renderWithIntl(properties.title);
		expect(screen.getByText(messages.addWebLink.defaultMessage)).toBeInTheDocument();
	});
});
