import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { TeamConnections } from './main';

describe('TeamConnections', () => {
	test('should display the container icon', () => {
		render(
			<IntlProvider locale="en">
				<TeamConnections
					containerType={'ConfluenceSpace'}
					title={'Test Confluence Space'}
					onDisconnectButtonClick={() => {}}
				/>
			</IntlProvider>,
		);

		const containerIcon = screen.getByTestId('linked-container-icon');
		expect(containerIcon).toBeInTheDocument();
	});

	test('should display the container title', () => {
		render(
			<IntlProvider locale="en">
				<TeamConnections
					containerType={'ConfluenceSpace'}
					title={'Test Confluence Space'}
					onDisconnectButtonClick={() => {}}
				/>
			</IntlProvider>,
		);

		const containerTitle = screen.getByText('Test Confluence Space');
		expect(containerTitle).toBeInTheDocument();
	});

	test('should display the container type', () => {
		render(
			<IntlProvider locale="en">
				<TeamConnections
					containerType={'ConfluenceSpace'}
					title={'Test Confluence Space'}
					onDisconnectButtonClick={() => {}}
				/>
			</IntlProvider>,
		);

		const containerType = screen.getByText('Confluence space');
		expect(containerType).toBeInTheDocument();
	});

	test('should display the right container type icon for a Confluence space', () => {
		render(
			<IntlProvider locale="en">
				<TeamConnections
					containerType={'ConfluenceSpace'}
					title={'Test Confluence Space'}
					onDisconnectButtonClick={() => {}}
				/>
			</IntlProvider>,
		);

		const containerTypeIcon = screen.getByRole('img', { name: 'Confluence' });
		expect(containerTypeIcon).toBeInTheDocument();
	});

	test('should display the right container type icon for a Jira project', () => {
		render(
			<IntlProvider locale="en">
				<TeamConnections
					containerType={'JiraProject'}
					title={'Test Jira Project'}
					onDisconnectButtonClick={() => {}}
				/>
			</IntlProvider>,
		);

		const containerTypeIcon = screen.getByRole('img', { name: 'Jira' });
		expect(containerTypeIcon).toBeInTheDocument();
	});
});
