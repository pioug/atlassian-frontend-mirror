import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import ProfileCardTrigger from '../../components/User/ProfileCardTrigger';
import { type ProfileClient } from '../../types';

import { flexiTime } from './helper/_mock-analytics';

const mockFireEvent = jest.fn();
jest.mock('@atlaskit/teams-app-internal-analytics', () => {
	return {
		...(jest.requireActual('@atlaskit/teams-app-internal-analytics') as object),
		useAnalyticsEvents: jest.fn().mockImplementation(() => ({ fireEvent: mockFireEvent })),
	};
});

const defaultProps = {
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
	const cardTriggeredHoverEvent = flexiTime({
		eventType: 'ui',
		actionSubject: 'profilecard',
		action: 'triggered',
		attributes: {
			method: 'hover',
		},
	});
	const cardTriggeredClickEvent = flexiTime({
		eventType: 'ui',
		actionSubject: 'profilecard',
		action: 'triggered',
		attributes: {
			method: 'click',
		},
	});
	beforeEach(() => {
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

		await expect(document.body).toBeAccessible();
	});

	it('should open "click" trigger after click', async () => {
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

		expect(mockFireEvent).toHaveBeenCalledWith(
			`${cardTriggeredClickEvent.eventType}.${cardTriggeredClickEvent.actionSubject}.${cardTriggeredClickEvent.action}`,
			expect.objectContaining(cardTriggeredClickEvent.attributes),
		);
		expect(queryByTestId('profilecard')).toBeDefined();

		act(() => {
			fireEvent.click(getByTestId('outer-content'));
			jest.runAllTimers();
		});

		expect(queryByTestId('profilecard')).toBe(null);

		await expect(document.body).toBeAccessible();
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

		expect(mockFireEvent).toHaveBeenCalledWith(
			`${cardTriggeredHoverEvent.eventType}.${cardTriggeredHoverEvent.actionSubject}.${cardTriggeredHoverEvent.action}`,
			expect.objectContaining(cardTriggeredHoverEvent.attributes),
		);

		expect(await findByTestId('profilecard')).toBeDefined();

		act(() => {
			fireEvent.mouseLeave(getByTestId('profilecard-trigger'));
			jest.runAllTimers();
		});

		expect(queryByTestId('profilecard')).toBe(null);

		await expect(document.body).toBeAccessible();
	});
	it('should open "click" trigger after focus and enter keypress', async () => {
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

		expect(mockFireEvent).toHaveBeenCalledWith(
			`${cardTriggeredClickEvent.eventType}.${cardTriggeredClickEvent.actionSubject}.${cardTriggeredClickEvent.action}`,
			expect.objectContaining(cardTriggeredClickEvent.attributes),
		);
		expect(queryByTestId('profilecard')).toBeDefined();

		await expect(document.body).toBeAccessible();
	});
	it('should open "click" trigger after focus and spacebar keypress', async () => {
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

		expect(mockFireEvent).toHaveBeenCalledWith(
			`${cardTriggeredClickEvent.eventType}.${cardTriggeredClickEvent.actionSubject}.${cardTriggeredClickEvent.action}`,
			expect.objectContaining(cardTriggeredClickEvent.attributes),
		);
		expect(queryByTestId('profilecard')).toBeDefined();

		await expect(document.body).toBeAccessible();
	});
});

it('should set role="button"', async () => {
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

	await expect(document.body).toBeAccessible();
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

	await expect(document.body).toBeAccessible();
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

	await expect(document.body).toBeAccessible();
});
