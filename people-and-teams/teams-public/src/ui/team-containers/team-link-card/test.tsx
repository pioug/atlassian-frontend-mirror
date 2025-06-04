import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import FeatureGates from '@atlaskit/feature-gate-js-client';
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

jest.mock('@atlaskit/feature-gate-js-client', () => ({
	...jest.requireActual('@atlaskit/feature-gate-js-client'),
	getExperimentValue: jest.fn(),
	initializeCompleted: jest.fn(),
}));

const mockGetExperimentValue = FeatureGates.getExperimentValue as jest.Mock;
const mockInitializeCompleted = FeatureGates.initializeCompleted as jest.Mock;

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
	beforeAll(async () => {
		mockInitializeCompleted.mockReturnValue(true);
		mockGetExperimentValue.mockReturnValue(true);
	});

	beforeEach(() => {
		mockInitializeCompleted.mockReturnValue(true);
		mockGetExperimentValue.mockImplementation((experimentName, key, defaultValue) => {
			if (experimentName === 'team_and_container_web_link' && key === 'isEnabled') {
				return true;
			}
			return defaultValue;
		});
		jest.clearAllMocks();
	});

	it('should render the component with title', () => {
		renderWithIntl(<TeamLinkCard {...defaultProps} />);

		expect(screen.getByText('Test Container')).toBeInTheDocument();
	});

	it('should render with correct test id', () => {
		renderWithIntl(<TeamLinkCard {...defaultProps} />);

		expect(screen.getByTestId('team-link-card-inner')).toBeInTheDocument();
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
		).toBeInTheDocument();

		await userEvent.unhover(container);
		expect(
			screen.queryByRole('button', { name: /disconnect the container Test Container/i }),
		).not.toBeInTheDocument();
	});

	it('should show/hide more options button on hover/unhover for WebLink containers', async () => {
		renderWithIntl(<TeamLinkCard {...defaultProps} containerType="WebLink" />);

		const container = screen.getByTestId('team-link-card-inner');

		expect(
			screen.queryByRole('button', { name: /more options for Test Container/i }),
		).not.toBeInTheDocument();

		await userEvent.hover(container);
		expect(
			screen.getByRole('button', { name: /more options for Test Container/i }),
		).toBeInTheDocument();

		await userEvent.unhover(container);
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
		});
	});

	it('should capture and report a11y violations', async () => {
		const { container } = renderWithIntl(<TeamLinkCard {...defaultProps} />);
		await expect(container).toBeAccessible();
	});
});
