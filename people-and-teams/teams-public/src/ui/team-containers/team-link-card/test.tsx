import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { Text } from '@atlaskit/primitives';

import { type ContainerTypes } from '../../../common/types';
import { usePeopleAndTeamAnalytics } from '../../../common/utils/analytics';

import { TeamLinkCard } from './index';

jest.mock('../../../common/utils/analytics', () => ({
	...jest.requireActual('../../../common/utils/analytics'),
	usePeopleAndTeamAnalytics: jest.fn(() => ({
		fireUIEvent: jest.fn(),
	})),
}));

jest.mock('../../../common/utils/get-container-properties', () => ({
	getContainerProperties: jest.fn(() => ({
		description: <Text>Test Description</Text>,
		icon: <Text testId="container-icon">Icon</Text>,
		containerTypeText: <Text>Test Type</Text>,
	})),
}));

jest.mock('../../../common/utils/get-link-domain', () => ({
	getDomainFromLinkUri: jest.fn((url: string) => {
		if (url === 'https://www.loom.com/share/123') {
			return 'loom.com';
		}
		if (url === 'https://docs.google.com/presentation/d/456') {
			return 'docs.google.com';
		}
		return 'example.com';
	}),
}));

jest.mock('@atlaskit/feature-gate-js-client', () => ({
	...jest.requireActual('@atlaskit/feature-gate-js-client'),
	getExperimentValue: jest.fn(),
	initializeCompleted: jest.fn(),
}));

const defaultProps = {
	containerType: 'ConfluenceSpace' as ContainerTypes,
	title: 'Test Container',
	containerId: 'test-id',
	link: 'https://example.com',
	onDisconnectButtonClick: jest.fn(),
	onEditLinkClick: jest.fn(),
};

const renderWithIntl = (component: React.ReactElement) => {
	return render(<IntlProvider locale="en">{component}</IntlProvider>);
};

describe('TeamLinkCard', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should render the component with title', () => {
		renderWithIntl(<TeamLinkCard {...defaultProps} />);

		expect(screen.getByText('Test Container')).toBeVisible();
	});

	it('should render with correct test id', () => {
		renderWithIntl(<TeamLinkCard {...defaultProps} />);

		expect(screen.getByTestId('team-link-card-inner')).toBeVisible();
	});

	it('should have accessible link structure', () => {
		renderWithIntl(<TeamLinkCard {...defaultProps} />);

		const link = screen.getByRole('link');
		expect(link).toHaveAttribute('href', 'https://example.com');
		expect(link).toHaveTextContent('Test Container');
	});

	it('should show/hide disconnect button on hover/unhover for non-WebLink containers', async () => {
		renderWithIntl(<TeamLinkCard {...defaultProps} />);

		const container = screen.getByTestId('team-link-card-inner');

		expect(
			screen.queryByRole('button', { name: /disconnect the container Test Container/i }),
		).not.toBeInTheDocument();

		await userEvent.hover(container);
		expect(
			screen.getByRole('button', { name: /disconnect the container Test Container/i }),
		).toBeVisible();

		await userEvent.unhover(container);
		expect(
			screen.queryByRole('button', { name: /disconnect the container Test Container/i }),
		).not.toBeInTheDocument();
	});

	it('should show/hide more options button based on hover and dropdown state for WebLink containers', async () => {
		renderWithIntl(<TeamLinkCard {...defaultProps} containerType="WebLink" />);

		const container = screen.getByTestId('team-link-card-inner');

		expect(
			screen.queryByRole('button', { name: /more options for Test Container/i }),
		).not.toBeInTheDocument();

		await userEvent.hover(container);
		expect(screen.getByRole('button', { name: /more options for Test Container/i })).toBeVisible();

		await userEvent.unhover(container);
		expect(
			screen.queryByRole('button', { name: /more options for Test Container/i }),
		).not.toBeInTheDocument();

		await userEvent.hover(container);
		const moreOptionsButton = screen.getByRole('button', {
			name: /more options for Test Container/i,
		});

		await userEvent.click(moreOptionsButton);

		await userEvent.unhover(container);
		expect(screen.getByRole('button', { name: /more options for Test Container/i })).toBeVisible();

		await userEvent.keyboard('{Escape}');
		expect(
			screen.queryByRole('button', { name: /more options for Test Container/i }),
		).not.toBeInTheDocument();
	});

	it('should trigger onDisconnectButtonClick when disconnect button is clicked', async () => {
		const mockOnDisconnectButtonClick = jest.fn();
		renderWithIntl(
			<TeamLinkCard {...defaultProps} onDisconnectButtonClick={mockOnDisconnectButtonClick} />,
		);

		const container = screen.getByTestId('team-link-card-inner');
		await userEvent.hover(container);

		const disconnectButton = screen.getByRole('button', {
			name: /disconnect the container Test Container/i,
		});
		await userEvent.click(disconnectButton);

		expect(mockOnDisconnectButtonClick).toHaveBeenCalledTimes(1);
	});

	it('should trigger onEditLinkClick when edit button is clicked for WebLink containers', async () => {
		const mockOnEditLinkClick = jest.fn();
		renderWithIntl(
			<TeamLinkCard
				{...defaultProps}
				containerType="WebLink"
				onEditLinkClick={mockOnEditLinkClick}
			/>,
		);

		const container = screen.getByTestId('team-link-card-inner');
		await userEvent.hover(container);

		const moreOptionsButton = screen.getByRole('button', {
			name: /more options for Test Container/i,
		});
		await userEvent.click(moreOptionsButton);

		const editButton = screen.getByText('Edit link');
		await userEvent.click(editButton);

		expect(mockOnEditLinkClick).toHaveBeenCalledTimes(1);
	});

	it('should fire analytics event when disconnect button is clicked', async () => {
		const mockFireEvent = jest.fn();
		(usePeopleAndTeamAnalytics as jest.Mock).mockReturnValue({ fireUIEvent: mockFireEvent });

		renderWithIntl(<TeamLinkCard {...defaultProps} />);

		const containerElement = screen.getByTestId('team-link-card-inner');
		await userEvent.hover(containerElement);
		const crossIconButton = screen.getByRole('button');
		await userEvent.click(crossIconButton);
		expect(mockFireEvent).toHaveBeenCalledTimes(1);
		expect(mockFireEvent).toHaveBeenCalledWith(expect.any(Function), {
			action: 'clicked',
			actionSubject: 'button',
			actionSubjectId: 'containerUnlinkButton',
			attributes: {
				containerSelected: {
					container: 'ConfluenceSpace',
					containerId: 'test-id',
				},
			},
		});
	});

	it('should fire analytics event with linkDomain when WebLink container link is clicked', async () => {
		const mockFireEvent = jest.fn();
		(usePeopleAndTeamAnalytics as jest.Mock).mockReturnValue({ fireUIEvent: mockFireEvent });

		renderWithIntl(
			<TeamLinkCard
				{...defaultProps}
				containerType="WebLink"
				link="https://www.loom.com/share/123"
			/>,
		);

		const link = screen.getByRole('link');
		await userEvent.click(link);

		expect(mockFireEvent).toHaveBeenCalledWith(expect.any(Function), {
			action: 'clicked',
			actionSubject: 'container',
			actionSubjectId: 'teamContainer',
			attributes: {
				containerSelected: {
					container: 'WebLink',
					containerId: 'test-id',
					linkDomain: 'loom.com',
				},
			},
		});
	});

	it('should fire analytics event without linkDomain when non-WebLink container link is clicked', async () => {
		const mockFireEvent = jest.fn();
		(usePeopleAndTeamAnalytics as jest.Mock).mockReturnValue({ fireUIEvent: mockFireEvent });

		renderWithIntl(<TeamLinkCard {...defaultProps} containerType="ConfluenceSpace" />);

		const link = screen.getByRole('link');
		await userEvent.click(link);

		expect(mockFireEvent).toHaveBeenCalledWith(expect.any(Function), {
			action: 'clicked',
			actionSubject: 'container',
			actionSubjectId: 'teamContainer',
			attributes: {
				containerSelected: {
					container: 'ConfluenceSpace',
					containerId: 'test-id',
				},
			},
		});
	});

	it('should capture and report a11y violations', async () => {
		const { container } = renderWithIntl(<TeamLinkCard {...defaultProps} />);
		await expect(container).toBeAccessible();
	});
});
