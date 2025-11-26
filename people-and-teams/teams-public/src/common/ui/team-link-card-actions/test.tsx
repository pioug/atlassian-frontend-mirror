import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { ffTest } from '@atlassian/feature-flags-test-utils';
import {
	mockRunItLaterSynchronously,
	renderWithAnalyticsListener as render,
} from '@atlassian/ptc-test-utils';

import { type ContainerTypes } from '../../types';

import { TeamLinkCardActions } from './index';

mockRunItLaterSynchronously();

const defaultProps = {
	containerType: 'ConfluenceSpace' as ContainerTypes,
	title: 'Test Container',
	containerId: 'test-id',
	hovered: true,
	focused: false,
	isDropdownOpen: false,
	showKeyboardFocus: false,
	onDisconnectButtonClick: jest.fn(),
	onEditLinkClick: jest.fn(),
	onDropdownOpenChange: jest.fn(),
};

const renderWithIntl = (component: React.ReactElement) => {
	return render(<IntlProvider locale="en">{component}</IntlProvider>);
};

describe('TeamLinkCardActions', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Non-WebLink containers', () => {
		it('should render cross icon when showCloseIcon is true', () => {
			renderWithIntl(<TeamLinkCardActions {...defaultProps} />);

			expect(
				screen.getByRole('button', { name: /disconnect the container Test Container/i }),
			).toBeVisible();
		});

		it('should hide cross icon when not hovered and dropdown is closed', () => {
			renderWithIntl(<TeamLinkCardActions {...defaultProps} hovered={false} />);
			const button = screen.queryByText('disconnect the container Test Container', {
				selector: 'button',
			});
			expect(button).not.toBeInTheDocument();
		});

		it('should call onDisconnectButtonClick when cross icon is clicked', async () => {
			const user = userEvent.setup();
			renderWithIntl(<TeamLinkCardActions {...defaultProps} />);

			const disconnectButton = screen.getByRole('button', {
				name: /disconnect the container Test Container/i,
			});

			await user.click(disconnectButton);
			expect(defaultProps.onDisconnectButtonClick).toHaveBeenCalledTimes(1);
		});

		it('should capture and report a11y violations', async () => {
			const { container } = renderWithIntl(<TeamLinkCardActions {...defaultProps} />);
			await expect(container).toBeAccessible();
		});
	});

	describe('WebLink containers', () => {
		const webLinkProps = {
			...defaultProps,
			containerType: 'WebLink' as ContainerTypes,
		};

		it('should render show more icon when hovered', () => {
			renderWithIntl(<TeamLinkCardActions {...webLinkProps} />);

			expect(
				screen.getByRole('button', { name: /more options for Test Container/i }),
			).toBeVisible();
		});

		it('should hide show more icon when not hovered and dropdown is closed', () => {
			renderWithIntl(<TeamLinkCardActions {...webLinkProps} hovered={false} />);
			const button = screen.queryByText('more options for Test Container', { selector: 'button' });
			expect(button).not.toBeInTheDocument();
		});

		it('should show dropdown menu when show more icon is clicked', async () => {
			const user = userEvent.setup();
			renderWithIntl(<TeamLinkCardActions {...webLinkProps} />);

			const moreButton = screen.getByRole('button', { name: /more options for Test Container/i });
			await user.click(moreButton);

			expect(screen.getByText('Edit link')).toBeVisible();
			expect(screen.getByText('Remove')).toBeVisible();
		});

		it('should call onEditLinkClick when Edit link is clicked', async () => {
			const user = userEvent.setup();
			renderWithIntl(<TeamLinkCardActions {...webLinkProps} />);

			const moreButton = screen.getByRole('button', { name: /more options for Test Container/i });
			await user.click(moreButton);

			const editButton = screen.getByText('Edit link');
			await user.click(editButton);

			expect(defaultProps.onEditLinkClick).toHaveBeenCalledTimes(1);
		});

		it('should call onDisconnectButtonClick when Remove is clicked', async () => {
			const user = userEvent.setup();
			renderWithIntl(<TeamLinkCardActions {...webLinkProps} />);

			const moreButton = screen.getByRole('button', { name: /more options for Test Container/i });
			await user.click(moreButton);

			const removeButton = screen.getByText('Remove');
			await user.click(removeButton);

			expect(defaultProps.onDisconnectButtonClick).toHaveBeenCalledTimes(1);
		});

		it('should show dropdown when isDropdownOpen is true even if not hovered', () => {
			renderWithIntl(
				<TeamLinkCardActions {...webLinkProps} hovered={false} isDropdownOpen={true} />,
			);

			const button = screen.getByRole('button', { name: /more options for Test Container/i });
			const boxWrapper = button.parentElement;
			expect(boxWrapper).toHaveStyle({ display: 'flex' });
		});

		it('should capture and report a11y violations', async () => {
			const { container } = renderWithIntl(<TeamLinkCardActions {...webLinkProps} />);
			await expect(container).toBeAccessible();
		});
	});

	describe('Analytics', () => {
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
		const containerEditLinkButtonEvent = {
			action: 'clicked',
			actionSubject: 'button',
			actionSubjectId: 'containerEditLinkButton',
			attributes: {
				containerSelected: {
					container: 'WebLink',
					containerId: 'test-id',
				},
			},
		};

		const containerUnlinkButtonEventWebLink = {
			...containerUnlinkButtonEvent,
			attributes: {
				containerSelected: {
					container: 'WebLink',
					containerId: 'test-id',
				},
			},
		};

		ffTest.off('ptc-enable-teams-public-analytics-refactor', 'false', () => {
			it('should fire analytics event when disconnect button is clicked', async () => {
				const { user, expectEventToBeFired } = renderWithIntl(
					<TeamLinkCardActions {...defaultProps} />,
				);

				const disconnectButton = screen.getByRole('button', {
					name: /disconnect the container Test Container/i,
				});

				await user.click(disconnectButton);
				expectEventToBeFired('ui', containerUnlinkButtonEvent);
			});

			it('should fire analytics event when edit link button is clicked', async () => {
				const webLinkProps = {
					...defaultProps,
					containerType: 'WebLink' as ContainerTypes,
				};

				const { user, expectEventToBeFired } = renderWithIntl(
					<TeamLinkCardActions {...webLinkProps} />,
				);

				const moreButton = screen.getByRole('button', { name: /more options for Test Container/i });
				await user.click(moreButton);

				const editButton = screen.getByText('Edit link');
				await user.click(editButton);

				expectEventToBeFired('ui', containerEditLinkButtonEvent);
			});

			it('should fire analytics event when remove button is clicked from dropdown', async () => {
				const webLinkProps = {
					...defaultProps,
					containerType: 'WebLink' as ContainerTypes,
				};

				const { user, expectEventToBeFired } = renderWithIntl(
					<TeamLinkCardActions {...webLinkProps} />,
				);

				const moreButton = screen.getByRole('button', { name: /more options for Test Container/i });
				await user.click(moreButton);

				const removeButton = screen.getByText('Remove');
				await user.click(removeButton);

				expectEventToBeFired('ui', containerUnlinkButtonEventWebLink);
			});
		});

		ffTest.on('ptc-enable-teams-public-analytics-refactor', 'true', () => {
			it('should fire analytics event when disconnect button is clicked', async () => {
				const { user, expectEventToBeFired } = renderWithIntl(
					<TeamLinkCardActions {...defaultProps} />,
				);

				const disconnectButton = screen.getByRole('button', {
					name: /disconnect the container Test Container/i,
				});

				await user.click(disconnectButton);
				expectEventToBeFired('ui', containerUnlinkButtonEvent);
			});

			it('should fire analytics event when edit link button is clicked', async () => {
				const webLinkProps = {
					...defaultProps,
					containerType: 'WebLink' as ContainerTypes,
				};

				const { user, expectEventToBeFired } = renderWithIntl(
					<TeamLinkCardActions {...webLinkProps} />,
				);

				const moreButton = screen.getByRole('button', { name: /more options for Test Container/i });
				await user.click(moreButton);

				const editButton = screen.getByText('Edit link');
				await user.click(editButton);

				expectEventToBeFired('ui', containerEditLinkButtonEvent);
			});

			it('should fire analytics event when remove button is clicked from dropdown', async () => {
				const webLinkProps = {
					...defaultProps,
					containerType: 'WebLink' as ContainerTypes,
				};

				const { user, expectEventToBeFired } = renderWithIntl(
					<TeamLinkCardActions {...webLinkProps} />,
				);

				const moreButton = screen.getByRole('button', { name: /more options for Test Container/i });
				await user.click(moreButton);

				const removeButton = screen.getByText('Remove');
				await user.click(removeButton);

				expectEventToBeFired('ui', containerUnlinkButtonEventWebLink);
			});
		});
	});
});
