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
		const { getByText: getByTextTitle } = renderWithIntl(properties.title);
		expect(getByTextTitle(messages.addConfluenceContainerTitle.defaultMessage)).toBeInTheDocument();
	});

	it('should return correct properties for jira container type', () => {
		const properties = getContainerProperties({
			containerType: 'JiraProject',
		});
		renderWithIntl(properties.description);
		expect(screen.getByText(messages.jiraProjectDescription.defaultMessage)).toBeInTheDocument();
		expect(properties.icon).toBeTruthy();
		const { getByText: getByTextTitle } = renderWithIntl(properties.title);
		expect(getByTextTitle(messages.addJiraProjectTitle.defaultMessage)).toBeInTheDocument();
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
});
