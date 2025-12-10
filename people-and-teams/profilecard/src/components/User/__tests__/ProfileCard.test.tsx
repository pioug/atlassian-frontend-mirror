import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { ffTest } from '@atlassian/feature-flags-test-utils';
import {
	mockRunItLaterSynchronously,
	renderWithAnalyticsListener,
} from '@atlassian/ptc-test-utils';

import { type ProfilecardProps } from '../../../types';
import ProfileCard from '../ProfileCard';

describe('ProfileCard analytics', () => {
	const defaultProps: ProfilecardProps = {
		userId: 'test-user-id',
		fullName: 'Test User',
		avatarUrl: 'https://example.com/avatar.jpg',
		status: 'active',
		actions: [
			{
				id: 'test-action',
				label: 'Test Action',
				callback: jest.fn(),
			},
		],
	};

	const expectedEvent = {
		action: 'rendered',
		actionSubject: 'profilecard',
		actionSubjectId: 'content',
		attributes: {
			packageName: process.env._PACKAGE_NAME_,
			packageVersion: process.env._PACKAGE_VERSION_,
			firedAt: 1000,
			duration: 0,
			numActions: 1,
		},
	};
	const expectedLoadingEvent = {
		action: 'rendered',
		actionSubject: 'profilecard',
		actionSubjectId: 'spinner',
		attributes: {
			packageName: process.env._PACKAGE_NAME_,
			packageVersion: process.env._PACKAGE_VERSION_,
			firedAt: 1000,
			duration: 0,
		},
	};

	const expectedActionClickedEvent = {
		action: 'clicked',
		actionSubject: 'profilecard',
		actionSubjectId: 'action',
		attributes: {
			packageName: process.env._PACKAGE_NAME_,
			packageVersion: process.env._PACKAGE_VERSION_,
			firedAt: 1000,
			duration: 0,
			hasHref: false,
			hasOnClick: true,
			index: 0,
			actionId: 'test-action',
		},
	};

	const expectedReportingLinesClickedEvent = {
		action: 'clicked',
		actionSubject: 'profilecard',
		actionSubjectId: 'reportingLines',
		attributes: {
			packageName: process.env._PACKAGE_NAME_,
			packageVersion: process.env._PACKAGE_VERSION_,
			firedAt: 1000,
			duration: 0,
			userType: 'manager',
		},
	};

	const expectedDirectReportClickedEvent = {
		action: 'clicked',
		actionSubject: 'profilecard',
		actionSubjectId: 'reportingLines',
		attributes: {
			packageName: process.env._PACKAGE_NAME_,
			packageVersion: process.env._PACKAGE_VERSION_,
			firedAt: 1000,
			duration: 0,
			userType: 'direct-report',
		},
	};

	const expectedErrorEvent = {
		action: 'rendered',
		actionSubject: 'profilecard',
		actionSubjectId: 'error',
		attributes: {
			packageName: process.env._PACKAGE_NAME_,
			packageVersion: process.env._PACKAGE_VERSION_,
			firedAt: 1000,
			hasRetry: false,
			errorType: 'default',
		},
	};

	const expectedErrorWithRetryEvent = {
		action: 'rendered',
		actionSubject: 'profilecard',
		actionSubjectId: 'error',
		attributes: {
			packageName: process.env._PACKAGE_NAME_,
			packageVersion: process.env._PACKAGE_VERSION_,
			firedAt: 1000,
			hasRetry: true,
			errorType: 'NotFound',
		},
	};

	beforeEach(() => {
		jest.clearAllMocks();
		mockRunItLaterSynchronously();
		jest.spyOn(performance, 'now').mockReturnValue(1000);
	});

	const renderProfileCard = (props: Partial<ProfilecardProps> = {}) => {
		return renderWithAnalyticsListener(
			<IntlProvider locale="en">
				<ProfileCard {...defaultProps} {...props} />
			</IntlProvider>,
		);
	};

	ffTest.off('ptc-enable-profile-card-analytics-refactor', 'legacy analytics', () => {
		it('should fire profile card rendered event for content', async () => {
			const { expectEventToBeFired } = renderProfileCard();
			expectEventToBeFired('ui', expectedEvent);
		});

		it('should fire profile card rendered event for spinner when loading', async () => {
			const { expectEventToBeFired } = renderProfileCard({
				isLoading: true,
				fullName: undefined,
			});
			expectEventToBeFired('ui', expectedLoadingEvent);
		});

		it('should fire action clicked event when action button is clicked', async () => {
			const user = userEvent.setup();
			const { expectEventToBeFired } = renderProfileCard();

			const actionButton = screen.getByText('Test Action');
			await user.click(actionButton);

			expectEventToBeFired('ui', expectedActionClickedEvent);
		});

		it('should fire reporting lines clicked event when manager is clicked', async () => {
			const user = userEvent.setup();
			const { expectEventToBeFired } = renderProfileCard({
				reportingLines: {
					managers: [
						{
							accountIdentifier: 'manager-id',
							identifierType: 'ATLASSIAN_ID',
							pii: {
								name: 'Manager Name',
								picture: 'https://example.com/manager.jpg',
							},
						},
					],
					reports: [],
				},
				onReportingLinesClick: jest.fn(),
			});

			const managerButton = screen.getByText('Manager Name');
			await user.click(managerButton);

			expectEventToBeFired('ui', expectedReportingLinesClickedEvent);
		});

		it('should fire reporting lines clicked event when direct report is clicked', async () => {
			const user = userEvent.setup();
			const onReportingLinesClickMock = jest.fn();
			const { expectEventToBeFired } = renderProfileCard({
				reportingLines: {
					managers: [],
					reports: [
						{
							accountIdentifier: 'report-id',
							identifierType: 'ATLASSIAN_ID',
							pii: {
								name: 'Direct Report Name',
								picture: 'https://example.com/report.jpg',
							},
						},
					],
				},
				onReportingLinesClick: onReportingLinesClickMock,
			});

			const reportButton = screen.getByTestId('profilecard-reports-avatar-group--avatar-0--inner');
			await user.click(reportButton);

			expectEventToBeFired('ui', expectedDirectReportClickedEvent);
		});

		it('should fire profile card rendered event for error when hasError is true', async () => {
			const { expectEventToBeFired } = renderProfileCard({
				hasError: true,
				errorType: { reason: 'default' },
			});

			expectEventToBeFired('ui', expectedErrorEvent);
		});

		it('should fire profile card rendered event for error with retry when clientFetchProfile is provided', async () => {
			const { expectEventToBeFired } = renderProfileCard({
				hasError: true,
				errorType: { reason: 'NotFound' },
				clientFetchProfile: jest.fn(),
			});

			expectEventToBeFired('ui', expectedErrorWithRetryEvent);
		});

		it('should capture and report a11y violations', async () => {
			const { container } = renderProfileCard();
			await expect(container).toBeAccessible();
		});
	});

	ffTest.on('ptc-enable-profile-card-analytics-refactor', 'new analytics', () => {
		it('should fire profile card rendered event for content', async () => {
			const { expectEventToBeFired } = renderProfileCard();
			expectEventToBeFired('ui', expectedEvent);
		});

		it('should fire profile card rendered event for spinner when loading', async () => {
			const { expectEventToBeFired } = renderProfileCard({
				isLoading: true,
				fullName: undefined,
			});
			expectEventToBeFired('ui', expectedLoadingEvent);
		});

		it('should fire action clicked event when action button is clicked', async () => {
			const user = userEvent.setup();
			const { expectEventToBeFired } = renderProfileCard();

			const actionButton = screen.getByText('Test Action');
			await user.click(actionButton);

			expectEventToBeFired('ui', expectedActionClickedEvent);
		});

		it('should fire reporting lines clicked event when manager is clicked', async () => {
			const user = userEvent.setup();
			const { expectEventToBeFired } = renderProfileCard({
				reportingLines: {
					managers: [
						{
							accountIdentifier: 'manager-id',
							identifierType: 'ATLASSIAN_ID',
							pii: {
								name: 'Manager Name',
								picture: 'https://example.com/manager.jpg',
							},
						},
					],
					reports: [],
				},
				onReportingLinesClick: jest.fn(),
			});

			const managerButton = screen.getByText('Manager Name');
			await user.click(managerButton);

			expectEventToBeFired('ui', expectedReportingLinesClickedEvent);
		});

		it('should fire reporting lines clicked event when direct report is clicked', async () => {
			const user = userEvent.setup();
			const onReportingLinesClickMock = jest.fn();
			const { expectEventToBeFired } = renderProfileCard({
				reportingLines: {
					managers: [],
					reports: [
						{
							accountIdentifier: 'report-id',
							identifierType: 'ATLASSIAN_ID',
							pii: {
								name: 'Direct Report Name',
								picture: 'https://example.com/report.jpg',
							},
						},
					],
				},
				onReportingLinesClick: onReportingLinesClickMock,
			});

			const reportButton = screen.getByTestId('profilecard-reports-avatar-group--avatar-0--inner');
			await user.click(reportButton);

			expectEventToBeFired('ui', expectedDirectReportClickedEvent);
		});

		it('should fire profile card rendered event for error when hasError is true', async () => {
			const { expectEventToBeFired } = renderProfileCard({
				hasError: true,
				errorType: { reason: 'default' },
			});

			expectEventToBeFired('ui', expectedErrorEvent);
		});

		it('should fire profile card rendered event for error with retry when clientFetchProfile is provided', async () => {
			const { expectEventToBeFired } = renderProfileCard({
				hasError: true,
				errorType: { reason: 'NotFound' },
				clientFetchProfile: jest.fn(),
			});

			expectEventToBeFired('ui', expectedErrorWithRetryEvent);
		});

		it('should capture and report a11y violations', async () => {
			const { container } = renderProfileCard();
			await expect(container).toBeAccessible();
		});
	});
});
