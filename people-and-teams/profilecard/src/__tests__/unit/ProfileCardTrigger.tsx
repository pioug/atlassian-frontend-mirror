import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import ProfileCardTrigger from '../../components/User/ProfileCardTrigger';
import { type ProfileClient } from '../../types';
import { cardTriggered, fireEvent as fireAnalyticsEvent } from '../../util/analytics';

import { createAnalyticsEvent, flexiTime } from './helper/_mock-analytics';

const mockFireEventNext = jest.fn();
jest.mock('../../util/analytics', () => {
	return {
		...(jest.requireActual('../../util/analytics') as object),
		fireEvent: jest.fn(),
	};
});

jest.mock('@atlaskit/teams-app-internal-analytics', () => {
	return {
		...(jest.requireActual('@atlaskit/teams-app-internal-analytics') as object),
		useAnalyticsEvents: jest.fn().mockImplementation(() => ({ fireEvent: mockFireEventNext })),
	};
});

const defaultProps = {
	createAnalyticsEvent,
	userId: '1234',
};

const renderWithIntl = (component: React.ReactNode) => {
	return render(
		<IntlProvider locale="en" defaultLocale="en-US">
			{component}
		</IntlProvider>,
	);
};

const sampleProfile = {
	fullName: 'The cool man',
	isBot: false,
	status: 'active',
};

const mockResourceClient: unknown = {
	getProfile: () => {
		return Promise.resolve(sampleProfile);
	},
	shouldShowGiveKudos: () => {
		return Promise.resolve(false);
	},
	getTeamCentralBaseUrl: () => {
		return 'http://dummy-url';
	},
	getReportingLines: () => {
		return Promise.resolve();
	},
};

describe('ProfileCardTrigger', () => {
	const cardTriggeredClickEvent = flexiTime(cardTriggered('user', 'click'));
	const cardTriggeredHoverEvent = flexiTime(cardTriggered('user', 'hover'));
	beforeEach(() => {
		createAnalyticsEvent.mockClear();
		jest.useFakeTimers({ legacyFakeTimers: true });
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('should open "click" trigger after click (with kudos)', async () => {
		const resourceClient: unknown = {
			...(mockResourceClient as object),
			shouldShowGiveKudos: () => {
				return Promise.resolve(true);
			},
		};

		const { findByText, getByTestId } = renderWithIntl(
			<ProfileCardTrigger
				{...defaultProps}
				resourceClient={resourceClient as ProfileClient}
				trigger="click"
				testId="profilecard-trigger"
			>
				<span data-testid="test-inner-trigger">This is the trigger</span>
			</ProfileCardTrigger>,
		);

		act(() => {
			fireEvent.click(getByTestId('profilecard-trigger'));
			jest.runAllTimers();
		});

		expect(await findByText('Give kudos')).toBeDefined();
	});

	ffTest.off('ptc-enable-profile-card-analytics-refactor', 'legacy analytics', () => {
		it('should open "click" trigger after click', () => {
			const { getByTestId, queryByTestId } = renderWithIntl(
				<>
					<ProfileCardTrigger
						{...defaultProps}
						resourceClient={mockResourceClient as ProfileClient}
						trigger="click"
						testId="profilecard-trigger"
					>
						<span data-testid="test-inner-trigger">This is the trigger</span>
					</ProfileCardTrigger>
					<span data-testid="outer-content">Hello</span>
				</>,
			);

			expect(queryByTestId('profilecard')).toBe(null);
			expect(queryByTestId('test-inner-trigger')).toBeDefined();
			expect(queryByTestId('profilecard-trigger')).toBeDefined();

			act(() => {
				fireEvent.click(getByTestId('test-inner-trigger'));
				jest.runAllTimers();
			});

			expect(fireAnalyticsEvent).toHaveBeenCalledWith(
				expect.any(Function),
				cardTriggeredClickEvent,
			);
			expect(queryByTestId('profilecard')).toBeDefined();

			act(() => {
				fireEvent.click(getByTestId('outer-content'));
				jest.runAllTimers();
			});

			expect(queryByTestId('profilecard')).toBe(null);
		});

		it('should open "hover" trigger after mouse over', async () => {
			const { getByTestId, queryByTestId, findByTestId } = renderWithIntl(
				<ProfileCardTrigger
					{...defaultProps}
					resourceClient={mockResourceClient as ProfileClient}
					trigger="hover"
					testId="profilecard-trigger"
				>
					<span data-testid="test-inner-trigger">This is the trigger</span>
				</ProfileCardTrigger>,
			);

			expect(queryByTestId('profilecard')).toBe(null);
			expect(getByTestId('test-inner-trigger')).toBeDefined();
			expect(getByTestId('profilecard-trigger')).toBeDefined();

			act(() => {
				fireEvent.mouseOver(getByTestId('profilecard-trigger'));
				jest.runAllTimers();
			});

			expect(fireAnalyticsEvent).toHaveBeenCalledWith(
				expect.any(Function),
				cardTriggeredHoverEvent,
			);

			expect(await findByTestId('profilecard')).toBeDefined();

			act(() => {
				fireEvent.mouseLeave(getByTestId('profilecard-trigger'));
				jest.runAllTimers();
			});

			expect(queryByTestId('profilecard')).toBe(null);
		});
		it('should open "click" trigger after focus and enter keypress', () => {
			const { getByTestId, queryByTestId } = renderWithIntl(
				<>
					<ProfileCardTrigger
						{...defaultProps}
						resourceClient={mockResourceClient as ProfileClient}
						trigger="click"
						testId="profilecard-trigger"
					>
						<span data-testid="test-inner-trigger">This is the trigger</span>
					</ProfileCardTrigger>
				</>,
			);

			expect(queryByTestId('profilecard')).toBe(null);
			expect(queryByTestId('test-inner-trigger')).toBeDefined();
			expect(queryByTestId('profilecard-trigger')).toBeDefined();

			act(() => {
				fireEvent.keyDown(getByTestId('test-inner-trigger'), {
					key: 'Enter',
					code: 'Enter',
				});
				jest.runAllTimers();
			});

			expect(fireAnalyticsEvent).toHaveBeenCalledWith(
				expect.any(Function),
				cardTriggeredClickEvent,
			);
			expect(queryByTestId('profilecard')).toBeDefined();
		});
		it('should open "click" trigger after focus and spacebar keypress', () => {
			const { getByTestId, queryByTestId } = renderWithIntl(
				<>
					<ProfileCardTrigger
						{...defaultProps}
						resourceClient={mockResourceClient as ProfileClient}
						trigger="click"
						testId="profilecard-trigger"
					>
						<span data-testid="test-inner-trigger">This is the trigger</span>
					</ProfileCardTrigger>
				</>,
			);

			expect(queryByTestId('profilecard')).toBe(null);
			expect(queryByTestId('test-inner-trigger')).toBeDefined();
			expect(queryByTestId('profilecard-trigger')).toBeDefined();

			act(() => {
				fireEvent.keyDown(getByTestId('test-inner-trigger'), {
					key: ' ',
					code: 'Space',
				});
				jest.runAllTimers();
			});

			expect(fireAnalyticsEvent).toHaveBeenCalledWith(
				expect.any(Function),
				cardTriggeredClickEvent,
			);
			expect(queryByTestId('profilecard')).toBeDefined();
		});
	});

	ffTest.on('ptc-enable-profile-card-analytics-refactor', 'new analytics', () => {
		it('should open "click" trigger after click', () => {
			const { getByTestId, queryByTestId } = renderWithIntl(
				<>
					<ProfileCardTrigger
						{...defaultProps}
						resourceClient={mockResourceClient as ProfileClient}
						trigger="click"
						testId="profilecard-trigger"
					>
						<span data-testid="test-inner-trigger">This is the trigger</span>
					</ProfileCardTrigger>
					<span data-testid="outer-content">Hello</span>
				</>,
			);

			expect(queryByTestId('profilecard')).toBe(null);
			expect(queryByTestId('test-inner-trigger')).toBeDefined();
			expect(queryByTestId('profilecard-trigger')).toBeDefined();

			act(() => {
				fireEvent.click(getByTestId('test-inner-trigger'));
				jest.runAllTimers();
			});

			expect(mockFireEventNext).toHaveBeenCalledWith(
				`${cardTriggeredClickEvent.eventType}.${cardTriggeredClickEvent.actionSubject}.${cardTriggeredClickEvent.action}`,
				cardTriggeredClickEvent.attributes,
			);
			expect(queryByTestId('profilecard')).toBeDefined();

			act(() => {
				fireEvent.click(getByTestId('outer-content'));
				jest.runAllTimers();
			});

			expect(queryByTestId('profilecard')).toBe(null);
		});

		it('should open "hover" trigger after mouse over', async () => {
			const { getByTestId, queryByTestId, findByTestId } = renderWithIntl(
				<ProfileCardTrigger
					{...defaultProps}
					resourceClient={mockResourceClient as ProfileClient}
					trigger="hover"
					testId="profilecard-trigger"
				>
					<span data-testid="test-inner-trigger">This is the trigger</span>
				</ProfileCardTrigger>,
			);

			expect(queryByTestId('profilecard')).toBe(null);
			expect(getByTestId('test-inner-trigger')).toBeDefined();
			expect(getByTestId('profilecard-trigger')).toBeDefined();

			act(() => {
				fireEvent.mouseOver(getByTestId('profilecard-trigger'));
				jest.runAllTimers();
			});

			expect(mockFireEventNext).toHaveBeenCalledWith(
				`${cardTriggeredHoverEvent.eventType}.${cardTriggeredHoverEvent.actionSubject}.${cardTriggeredHoverEvent.action}`,
				cardTriggeredHoverEvent.attributes,
			);

			expect(await findByTestId('profilecard')).toBeDefined();

			act(() => {
				fireEvent.mouseLeave(getByTestId('profilecard-trigger'));
				jest.runAllTimers();
			});

			expect(queryByTestId('profilecard')).toBe(null);
		});
		it('should open "click" trigger after focus and enter keypress', () => {
			const { getByTestId, queryByTestId } = renderWithIntl(
				<>
					<ProfileCardTrigger
						{...defaultProps}
						resourceClient={mockResourceClient as ProfileClient}
						trigger="click"
						testId="profilecard-trigger"
					>
						<span data-testid="test-inner-trigger">This is the trigger</span>
					</ProfileCardTrigger>
				</>,
			);

			expect(queryByTestId('profilecard')).toBe(null);
			expect(queryByTestId('test-inner-trigger')).toBeDefined();
			expect(queryByTestId('profilecard-trigger')).toBeDefined();

			act(() => {
				fireEvent.keyDown(getByTestId('test-inner-trigger'), {
					key: 'Enter',
					code: 'Enter',
				});
				jest.runAllTimers();
			});

			expect(mockFireEventNext).toHaveBeenCalledWith(
				`${cardTriggeredClickEvent.eventType}.${cardTriggeredClickEvent.actionSubject}.${cardTriggeredClickEvent.action}`,
				cardTriggeredClickEvent.attributes,
			);
			expect(queryByTestId('profilecard')).toBeDefined();
		});
		it('should open "click" trigger after focus and spacebar keypress', () => {
			const { getByTestId, queryByTestId } = renderWithIntl(
				<>
					<ProfileCardTrigger
						{...defaultProps}
						resourceClient={mockResourceClient as ProfileClient}
						trigger="click"
						testId="profilecard-trigger"
					>
						<span data-testid="test-inner-trigger">This is the trigger</span>
					</ProfileCardTrigger>
				</>,
			);

			expect(queryByTestId('profilecard')).toBe(null);
			expect(queryByTestId('test-inner-trigger')).toBeDefined();
			expect(queryByTestId('profilecard-trigger')).toBeDefined();

			act(() => {
				fireEvent.keyDown(getByTestId('test-inner-trigger'), {
					key: ' ',
					code: 'Space',
				});
				jest.runAllTimers();
			});

			expect(mockFireEventNext).toHaveBeenCalledWith(
				`${cardTriggeredClickEvent.eventType}.${cardTriggeredClickEvent.actionSubject}.${cardTriggeredClickEvent.action}`,
				cardTriggeredClickEvent.attributes,
			);
			expect(queryByTestId('profilecard')).toBeDefined();
		});
	});

	it('should set role="button"', () => {
		const { getByTestId, queryByTestId } = renderWithIntl(
			<>
				<ProfileCardTrigger
					{...defaultProps}
					resourceClient={mockResourceClient as ProfileClient}
					trigger="click"
					testId="profilecard-trigger"
				>
					<span data-testid="test-inner-trigger">This is the trigger</span>
				</ProfileCardTrigger>
			</>,
		);

		expect(queryByTestId('profilecard')).toBe(null);
		expect(queryByTestId('test-inner-trigger')).toBeDefined();
		expect(queryByTestId('profilecard-trigger')).toBeDefined();

		const triggerSpan = getByTestId('profilecard-trigger');

		expect(triggerSpan.getAttribute('role')).toEqual('button');
	});

	it('should render based on isVisibleProp', async () => {
		let isVisible = false;
		renderWithIntl(
			<>
				<ProfileCardTrigger
					{...defaultProps}
					resourceClient={mockResourceClient as ProfileClient}
					trigger="click"
					testId="profilecard-trigger"
					isVisible={isVisible}
				>
					<span data-testid="test-inner-trigger">This is the trigger</span>
				</ProfileCardTrigger>
			</>,
		);

		expect(screen.queryByTestId('profilecard')).toBe(null);

		act(() => {
			jest.runAllTimers();
		});

		expect(screen.queryByTestId('profilecard')).toBe(null);

		isVisible = true;

		expect(screen.queryByTestId('profilecard')).toBe(null);

		act(() => {
			jest.runAllTimers();
		});

		expect(screen.queryByTestId('profilecard')).toBeDefined();
	});

	it('should render based on trigger when isVisibleProp is undefined', async () => {
		renderWithIntl(
			<>
				<ProfileCardTrigger
					{...defaultProps}
					resourceClient={mockResourceClient as ProfileClient}
					trigger="click"
					testId="profilecard-trigger"
					isVisible={undefined}
				>
					<span data-testid="test-inner-trigger">This is the trigger</span>
				</ProfileCardTrigger>
			</>,
		);

		expect(screen.queryByTestId('profilecard')).toBe(null);

		act(() => {
			fireEvent.click(screen.getByTestId('test-inner-trigger'));
			jest.runAllTimers();
		});

		expect(screen.queryByTestId('profilecard')).toBe(null);

		act(() => {
			fireEvent.click(screen.getByTestId('test-inner-trigger'));
			jest.runAllTimers();
		});

		expect(screen.queryByTestId('profilecard')).toBeDefined();
	});
});
