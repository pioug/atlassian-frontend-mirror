import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { getContainerProperties, messages } from '../../common/utils/get-container-properties';

describe('getContainerProperties', () => {
	const renderWithIntl = (node: React.ReactNode) => {
		return render(<IntlProvider locale="en">{node}</IntlProvider>);
	};

	it('should return correct properties for confluence container type', () => {
		const properties = getContainerProperties('confluence');
		renderWithIntl(properties.description);
		expect(
			screen.getByText(messages.confluenceContainerDescription.defaultMessage),
		).toBeInTheDocument();
		expect(properties.icon).toBeTruthy();
		const { getByText: getByTextTitle } = renderWithIntl(properties.title);
		expect(getByTextTitle(messages.addConfluenceContainerTitle.defaultMessage)).toBeInTheDocument();
	});

	it('should return correct properties for jira container type', () => {
		const properties = getContainerProperties('jira');
		renderWithIntl(properties.description);
		expect(screen.getByText(messages.jiraProjectDescription.defaultMessage)).toBeInTheDocument();
		expect(properties.icon).toBeTruthy();
		const { getByText: getByTextTitle } = renderWithIntl(properties.title);
		expect(getByTextTitle(messages.addJiraProjectTitle.defaultMessage)).toBeInTheDocument();
	});

	it('should return correct properties for loom container type', () => {
		const properties = getContainerProperties('loom');
		renderWithIntl(properties.description);
		expect(screen.getByText(messages.loomSpaceDescription.defaultMessage)).toBeInTheDocument();
		expect(properties.icon).toBeTruthy();
		const { getByText: getByTextTitle } = renderWithIntl(properties.title);
		expect(getByTextTitle(messages.addLoomSpaceTitle.defaultMessage)).toBeInTheDocument();
	});
});
