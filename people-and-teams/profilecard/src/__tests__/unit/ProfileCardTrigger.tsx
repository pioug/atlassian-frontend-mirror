import React from 'react';

import { act, fireEvent, render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import ProfileCardTrigger from '../../components/User/ProfileCardTrigger';
import { type ProfileClient } from '../../types';
import { cardTriggered, fireEvent as fireAnalyticsEvent } from '../../util/analytics';

import { createAnalyticsEvent, flexiTime } from './helper/_mock-analytics';

jest.mock('../../util/analytics', () => {
	return {
		...(jest.requireActual('../../util/analytics') as object),
		fireEvent: jest.fn(),
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
	beforeEach(() => {
		createAnalyticsEvent.mockClear();
		jest.useFakeTimers();
	});

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
			flexiTime(cardTriggered('user', 'click')),
		);
		expect(queryByTestId('profilecard')).toBeDefined();

		act(() => {
			fireEvent.click(getByTestId('outer-content'));
			jest.runAllTimers();
		});

		expect(queryByTestId('profilecard')).toBe(null);
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

	it('should open "click" trigger after click (without kudos) when showKudos is false', async () => {
		const resourceClient: unknown = {
			...(mockResourceClient as object),
			shouldShowGiveKudos: () => {
				return Promise.resolve(true);
			},
		};

		const { queryByText, getByTestId } = renderWithIntl(
			<ProfileCardTrigger
				{...defaultProps}
				resourceClient={resourceClient as ProfileClient}
				trigger="click"
				testId="profilecard-trigger"
				displayConfig={{ showKudos: false }}
			>
				<span data-testid="test-inner-trigger">This is the trigger</span>
			</ProfileCardTrigger>,
		);

		act(() => {
			fireEvent.click(getByTestId('profilecard-trigger'));
			jest.runAllTimers();
		});

		expect(await queryByText('Give kudos')).toBe(null);
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
			flexiTime(cardTriggered('user', 'hover')),
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
			flexiTime(cardTriggered('user', 'click')),
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
			flexiTime(cardTriggered('user', 'click')),
		);
		expect(queryByTestId('profilecard')).toBeDefined();
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
});
