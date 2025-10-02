import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Text } from '@atlaskit/primitives';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import {
	mockRunItLaterSynchronously,
	renderWithAnalyticsListener as render,
} from '@atlassian/ptc-test-utils';

import { type ContainerTypes } from '../../../common/types';

import { TeamLinkCard } from './index';

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

const containerUnlinkButtonEvent = {
	action: 'clicked',
	actionSubject: 'button',
	actionSubjectId: 'containerUnlinkButton',
	attributes: {
		containerSelected: {
			container: 'ConfluenceSpace',
			containerId: 'test-id',
		},
	},
};

const containerClickedEvent = {
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
};

const teamContainerClickedEvent = {
	action: 'clicked',
	actionSubject: 'container',
	actionSubjectId: 'teamContainer',
	attributes: {
		containerSelected: {
			container: 'ConfluenceSpace',
			containerId: 'test-id',
		},
	},
};
mockRunItLaterSynchronously();

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

	ffTest.on('fix_team_link_card_a11y', 'A11Y friendly HTML structure', () => {
		it('should show/hide disconnect button on hover/unhover for non-WebLink containers', async () => {
			renderWithIntl(<TeamLinkCard {...defaultProps} />);

			const container = screen.getByTestId('team-link-card-inner');
			await userEvent.hover(container);
			const disconnectButton = screen.getByRole('button', {
				name: /disconnect the container Test Container/i,
			});
			expect(disconnectButton).toBeInTheDocument();

			await userEvent.unhover(container);
			expect(
				screen.queryByRole('button', {
					name: /disconnect the container Test Container/i,
				}),
			).not.toBeInTheDocument();
		});

		it('should show/hide more options button based on hover and dropdown state for WebLink containers', async () => {
			const webLinkProps = {
				...defaultProps,
				containerType: 'WebLink' as ContainerTypes,
			};

			renderWithIntl(<TeamLinkCard {...webLinkProps} />);

			const container = screen.getByTestId('team-link-card-inner');
			await userEvent.hover(container);
			const moreOptionsButton = screen.getByRole('button', {
				name: /more options for Test Container/i,
			});
			expect(moreOptionsButton).toBeInTheDocument();

			await userEvent.unhover(container);
			expect(
				screen.queryByRole('button', {
					name: /more options for Test Container/i,
				}),
			).not.toBeInTheDocument();

			await userEvent.hover(container);
			await userEvent.click(moreOptionsButton);

			// Unhover should keep button visible when dropdown is open
			await userEvent.unhover(container);
			expect(
				screen.queryByRole('button', {
					name: /more options for Test Container/i,
				}),
			).toBeInTheDocument();
		});
	});

	ffTest.off('fix_team_link_card_a11y', 'A11Y non-friendly HTML structure', () => {
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
			expect(
				screen.getByRole('button', { name: /more options for Test Container/i }),
			).toBeVisible();

			await userEvent.unhover(container);
			expect(
				screen.queryByRole('button', { name: /more options for Test Container/i }),
			).not.toBeInTheDocument();

			await userEvent.hover(container);
			const moreOptionsButton = screen.getByRole('button', {
				name: /more options for Test Container/i,
			});

			await userEvent.click(moreOptionsButton);

			// Wait for dropdown to open and then unhover
			await screen.findByText('Edit link');
			await userEvent.unhover(container);
			expect(
				screen.getByRole('button', { name: /more options for Test Container/i }),
			).toBeVisible();

			await userEvent.keyboard('{Escape}');
			expect(
				screen.queryByRole('button', { name: /more options for Test Container/i }),
			).not.toBeInTheDocument();
		});
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

	ffTest.off('ptc-enable-teams-public-analytics-refactor', 'Legacy analytics', () => {
		it('should fire analytics event when disconnect button is clicked', async () => {
			const { expectEventToBeFired } = renderWithIntl(<TeamLinkCard {...defaultProps} />);

			const containerElement = screen.getByTestId('team-link-card-inner');
			await userEvent.hover(containerElement);
			const crossIconButton = screen.getByRole('button');
			await userEvent.click(crossIconButton);
			expectEventToBeFired('ui', containerUnlinkButtonEvent);
		});

		it('should fire analytics event with linkDomain when WebLink container link is clicked', async () => {
			const { expectEventToBeFired } = renderWithIntl(
				<TeamLinkCard
					{...defaultProps}
					containerType="WebLink"
					link="https://www.loom.com/share/123"
				/>,
			);

			const link = screen.getByRole('link');
			await userEvent.click(link);

			expectEventToBeFired('ui', containerClickedEvent);
		});

		it('should fire analytics event without linkDomain when non-WebLink container link is clicked', async () => {
			const { expectEventToBeFired } = renderWithIntl(
				<TeamLinkCard {...defaultProps} containerType="ConfluenceSpace" />,
			);

			const link = screen.getByRole('link');
			await userEvent.click(link);

			expectEventToBeFired('ui', teamContainerClickedEvent);
		});
	});

	ffTest.on('ptc-enable-teams-public-analytics-refactor', 'New analytics', () => {
		it('should fire analytics event when disconnect button is clicked', async () => {
			const { expectEventToBeFired } = renderWithIntl(<TeamLinkCard {...defaultProps} />);

			const containerElement = screen.getByTestId('team-link-card-inner');
			await userEvent.hover(containerElement);
			const crossIconButton = screen.getByRole('button');
			await userEvent.click(crossIconButton);
			expectEventToBeFired('ui', containerUnlinkButtonEvent);
		});

		it('should fire analytics event with linkDomain when WebLink container link is clicked', async () => {
			const { expectEventToBeFired } = renderWithIntl(
				<TeamLinkCard
					{...defaultProps}
					containerType="WebLink"
					link="https://www.loom.com/share/123"
				/>,
			);

			const link = screen.getByRole('link');
			await userEvent.click(link);

			expectEventToBeFired('ui', containerClickedEvent);
		});

		it('should fire analytics event without linkDomain when non-WebLink container link is clicked', async () => {
			const { expectEventToBeFired } = renderWithIntl(
				<TeamLinkCard {...defaultProps} containerType="ConfluenceSpace" />,
			);

			const link = screen.getByRole('link');
			await userEvent.click(link);

			expectEventToBeFired('ui', teamContainerClickedEvent);
		});
	});

	it('should capture and report a11y violations', async () => {
		const { container } = renderWithIntl(<TeamLinkCard {...defaultProps} />);
		await expect(container).toBeAccessible();
	});
});
