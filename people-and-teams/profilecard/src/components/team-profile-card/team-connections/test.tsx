import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { NewTeamConnections, TeamConnections } from './main';

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

		const containerIcon = screen.getByTestId('linked-container-ConfluenceSpace-icon');
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
					title={'Test title'}
					onDisconnectButtonClick={() => {}}
				/>
			</IntlProvider>,
		);

		expect(screen.getByText('Confluence')).toBeInTheDocument();
		expect(screen.getByText('space')).toBeInTheDocument();
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

		const containerTypeIcon = screen.getByTestId('confluence-space-container-icon');
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

		const containerTypeIcon = screen.getByTestId('jira-project-container-icon');
		expect(containerTypeIcon).toBeInTheDocument();
	});

	test('should render a link with the item', async () => {
		render(
			<IntlProvider locale="en">
				<TeamConnections
					containerType={'JiraProject'}
					title={'Test Jira Project'}
					onDisconnectButtonClick={() => {}}
					link="https://test-dev.com"
				/>
			</IntlProvider>,
		);

		const downloadCsvLink = screen.getByRole('link', { name: 'Test Jira Project Jira project' });
		expect(downloadCsvLink).toHaveAttribute('href', 'https://test-dev.com');
	});
});

describe('NewTeamConnections', () => {
	const renderComponent = () =>
		render(
			<IntlProvider locale="en">
				<NewTeamConnections
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
		renderComponent();

		const downloadCsvLink = screen.getByRole('link', {
			name: 'Test Confluence Space Confluence space',
		});
		expect(downloadCsvLink).toHaveAttribute('href', 'https://test-dev.com');
	});

	it('should display the right container type icon for a Jira project', () => {
		render(
			<IntlProvider locale="en">
				<NewTeamConnections
					containerType={'JiraProject'}
					title={'Test Jira Project'}
					onDisconnectButtonClick={() => {}}
				/>
			</IntlProvider>,
		);

		const containerTypeIcon = screen.getByTestId('jira-project-container-icon');
		expect(containerTypeIcon).toBeInTheDocument();
	});
});
