import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { getContainerProperties, messages } from '../get-container-properties';

const renderWithIntl = (node: React.ReactNode) => {
	return render(<IntlProvider locale="en">{node}</IntlProvider>);
};

describe('getContainerProperties', () => {
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
});
