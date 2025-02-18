import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';

import { Text } from '@atlaskit/primitives';

import { getContainerProperties } from '../../../common/utils/get-container-properties';

import { LinkedContainerCard } from './index';

jest.mock('../../../common/utils/get-container-properties', () => ({
	getContainerProperties: jest.fn(),
}));

describe('LinkedContainerCard', () => {
	const mockContainerProperties = {
		description: 'Test Description',
		icon: <Text testId="test-icon">Icon</Text>,
	};
	const testLink = 'test-link';

	beforeEach(() => {
		(getContainerProperties as jest.Mock).mockReturnValue(mockContainerProperties);
	});

	it('should render the title', () => {
		render(
			<Router>
				<LinkedContainerCard
					containerType={'ConfluenceSpace'}
					title="Test Title"
					containerIcon="test-icon-url"
					link={testLink}
				/>
			</Router>,
		);
		expect(screen.getByText('Test Title')).toBeInTheDocument();
	});

	it('should render the description', () => {
		render(
			<Router>
				<LinkedContainerCard
					containerType={'ConfluenceSpace'}
					title="Test Title"
					containerIcon="test-icon-url"
					link={testLink}
				/>
			</Router>,
		);
		expect(screen.getByText('Test Description')).toBeInTheDocument();
	});

	it('should render the icon', () => {
		render(
			<Router>
				<LinkedContainerCard
					containerType={'ConfluenceSpace'}
					title="Test Title"
					containerIcon="test-icon-url"
					link={testLink}
				/>
			</Router>,
		);
		expect(screen.getByTestId('test-icon')).toBeInTheDocument();
	});

	it('should render the container icon', () => {
		render(
			<Router>
				<LinkedContainerCard
					containerType={'ConfluenceSpace'}
					title="Test Title"
					containerIcon="test-icon-url"
					link={testLink}
				/>
			</Router>,
		);
		expect(screen.getByTestId('linked-container-icon')).toHaveAttribute('src', 'test-icon-url');
	});

	it('should prevent default action on cross icon button click', async () => {
		render(
			<Router>
				<LinkedContainerCard
					containerType={'ConfluenceSpace'}
					title="Test Title"
					containerIcon="test-icon-url"
					link={testLink}
				/>
			</Router>,
		);
		const containerElement = screen.getByTestId('linked-container-card-inner');
		await userEvent.hover(containerElement);

		const crossIconButton = screen.getByRole('button');
		await userEvent.click(crossIconButton);
		expect(crossIconButton).toBeInTheDocument();
	});

	it('should show/hide cross icon button on hover/unhover', async () => {
		render(
			<Router>
				<LinkedContainerCard
					containerType={'ConfluenceSpace'}
					title="Test Title"
					containerIcon="test-icon-url"
					link={testLink}
				/>
			</Router>,
		);

		const containerElement = screen.getByTestId('linked-container-card-inner');
		// Check that the close icon is not visible initially
		expect(
			screen.queryByRole('button', { name: /disconnect the container/i }),
		).not.toBeInTheDocument();
		await userEvent.hover(containerElement);
		// Check that the close icon is visible after on hover
		expect(screen.getByRole('button', { name: /disconnect the container/i })).toBeVisible();
		await userEvent.unhover(containerElement);
		// Check that the close icon is not visible after unhover
		expect(
			screen.queryByRole('button', { name: /disconnect the container/i }),
		).not.toBeInTheDocument();
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<Router>
				<LinkedContainerCard
					containerType={'ConfluenceSpace'}
					title="Test Title"
					containerIcon="test-icon-url"
					link={testLink}
				/>
			</Router>,
		);
		await expect(container).toBeAccessible();
	});
});
