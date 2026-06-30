import React from 'react';

import { act, fireEvent, within } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { fg } from '@atlaskit/platform-feature-flags';
import { renderWithAnalyticsListener as render } from '@atlassian/ptc-test-utils';
import { screen, userEvent } from '@atlassian/testing-library';

import ProfileCard from '../../components/User/ProfileCard';
import { moreActionsClicked, profileCardRendered } from '../../util/analytics';

import { flexiTime } from './helper/_mock-analytics';

jest.mock('react-intl', () => {
	const reactIntl = jest.requireActual('react-intl');
	const intl = reactIntl.createIntl({ locale: 'en' });
	return {
		...(jest.requireActual('react-intl') as any),
		useIntl: () => intl,
	};
});

jest.mock('@atlaskit/platform-feature-flags', () => ({
	...jest.requireActual<any>('@atlaskit/platform-feature-flags'),
	fg: jest.fn(),
}));

// Mock for runItLater
(window as any).requestIdleCallback = (callback: () => void) => callback();

const defaultProps: Parameters<typeof ProfileCard>[0] = {
	fullName: 'full name test',
	status: 'active',
	nickname: 'jscrazy',
	companyName: 'Atlassian',
};

const renderComponent = (props = {}) =>
	render(
		<IntlProvider locale="en">
			<ProfileCard {...defaultProps} {...props} />
		</IntlProvider>,
	);

describe('ProfileCard', () => {
	it('should be possible to create a component', () => {
		const { getByTestId } = renderComponent();
		const component = getByTestId('profilecard');
		expect(component).toBeDefined();
	});

	describe('fullName property', () => {
		const fullName = 'This is an avatar!';

		it('should show the full name on the card if property is set', () => {
			const { getByText } = renderComponent({ fullName });
			const nameComponent = getByText(fullName, { exact: false });
			expect(nameComponent).toBeDefined();
		});

		it('should not render a card if full name is not set', () => {
			const { queryByTestId } = renderComponent({ fullName: undefined });
			expect(queryByTestId('profilecard')).toBeNull();
		});
	});

	describe('isLoading property', () => {
		it('should render the LoadingMessage component', () => {
			const { getByTestId } = renderComponent({ isLoading: true });
			expect(getByTestId('profilecard-spinner-container')).toBeDefined();
		});

		it('should send analytics for loading', () => {
			const { expectEventToBeFired } = renderComponent({ isLoading: true });
			const expectedErrorEvent = flexiTime(
				profileCardRendered('user', 'spinner', { duration: expect.anything() }),
			);
			const { eventType, ...event } = expectedErrorEvent;
			expectEventToBeFired(eventType, event);
		});
	});

	describe('hasError property', () => {
		it('should render the ErrorMessage component', () => {
			const { getByTestId } = renderComponent({ hasError: true });
			expect(getByTestId('profilecard-error')).toBeDefined();
		});

		it('should show "Try again" button if callback is provided', () => {
			const { getByText } = renderComponent({
				hasError: true,
				clientFetchProfile: () => null,
			});
			expect(getByText('Try again')).toBeDefined();
		});

		it('should not show "Try again" button if no callback available', () => {
			const { queryByText } = renderComponent({
				hasError: true,
				clientFetchProfile: undefined,
			});
			expect(queryByText('Try again')).toBeNull();
		});

		it.each([
			[true, 'default'],
			[true, 'NotFound'],
			[true, ''],
			[false, 'default'],
			[false, 'NotFound'],
			[false, ''],
		])('should send failure analytics with hasRetry=%j and errorType=%s', (hasRetry, errorType) => {
			const { expectEventToBeFired } = renderComponent({
				hasError: true,
				clientFetchProfile: hasRetry ? () => null : undefined,
				errorType: errorType ? { reason: errorType } : undefined,
			});
			const expectedErrorEvent = flexiTime(
				profileCardRendered('user', 'error', {
					hasRetry,
					errorType: (errorType || 'default') as 'default' | 'NotFound',
				}),
			);

			const { eventType, ...event } = expectedErrorEvent;
			expectEventToBeFired(eventType, event);
		});
	});

	describe('actions property', () => {
		const actions = [
			{
				id: 'one',
				label: 'one',
			},
			{
				id: 'two',
				label: 'two',
			},
			{
				id: 'three',
				label: 'three',
			},
		];

		it('should not render meatball overflow if two or fewer actions', () => {
			const { getByTestId, getByText, queryByTestId } = renderComponent({
				actions: actions.slice(0, 2),
			});

			expect(getByTestId('profilecard-actions')).not.toBeNull();
			expect(getByText(actions[0].label)).not.toBeNull();
			expect(getByText(actions[1].label)).not.toBeNull();
			expect(queryByTestId('profilecard-actions-overflow')).toBeNull();
		});

		it('should render two action buttons for actions with the rest added to meatballs overflow menu', () => {
			const { getByTestId, getByText, queryByText } = renderComponent({
				actions,
			});

			expect(getByTestId('profilecard-actions')).not.toBeNull();
			expect(getByText(actions[0].label)).not.toBeNull();
			expect(getByText(actions[1].label)).not.toBeNull();
			expect(queryByText(actions[2].label)).toBeNull();
			expect(getByTestId('profilecard-actions-overflow')).not.toBeNull();
		});

		it('should send analytics events when clicking on meatballs overflow menu', () => {
			const { getByTestId, expectEventToBeFired } = renderComponent({
				actions,
			});

			expect(getByTestId('profilecard-actions')).not.toBeNull();
			expect(getByTestId('profilecard-actions-overflow')).not.toBeNull();

			act(() => {
				const dropdownWrapper = getByTestId('profilecard-actions-overflow');
				const moreButton = within(dropdownWrapper).getByRole('button');
				fireEvent.click(moreButton);
				jest.runAllTimers();
			});

			const expectedErrorEvent = flexiTime(
				moreActionsClicked('user', {
					duration: expect.anything(),
					numActions: 3,
				}),
			);

			const { eventType, ...event } = expectedErrorEvent;
			expectEventToBeFired(eventType, event);
		});

		it('should not render any action buttons if actions property is not set', () => {
			const { queryByTestId } = renderComponent({ actions: [] });

			expect(queryByTestId('profilecard-actions')).toBeNull();
		});

		it('should have the proper label for actions button with fullName', () => {
			(fg as jest.Mock).mockImplementation(
				(key) => key === 'jfp_a11y_team_profile_card_actions_label',
			);
			const { getByRole } = render(
				<IntlProvider locale="en" defaultLocale="en-US">
					<ProfileCard {...defaultProps} actions={actions} />
				</IntlProvider>,
			);

			const btn = getByRole('button', { name: 'More actions for full name test' });

			expect(btn).toBeVisible();
		});

		describe('Click behaviour (cmd+click, ctrl+click, etc)', () => {
			const renderActionCard = (
				actionProps: Array<{ label: string; callback?: jest.Mock; link?: string }>,
			) =>
				renderComponent({
					fullName: 'name',
					actions: actionProps,
				});

			const getActionElement = (label = 'test') => {
				const actionText = screen.getByText(label);
				const actionElement = actionText.closest('a');

				if (!(actionElement instanceof HTMLAnchorElement)) {
					throw new Error(`Expected an action element for "${label}"`);
				}

				return actionElement;
			};

			const getActionLink = (label = 'test') => {
				const actionLink = screen.getByRole('link', { name: new RegExp(label, 'i') });

				if (!(actionLink instanceof HTMLAnchorElement)) {
					throw new Error(`Expected an action link for "${label}"`);
				}

				return actionLink;
			};

			const clickActionElement = async (
				element: HTMLAnchorElement,
				options: { modifierKey?: 'MetaLeft' | 'AltLeft' | 'ControlLeft' | 'ShiftLeft' } = {},
			) => {
				let defaultPrevented = false;
				const captureDefaultPrevented = (event: MouseEvent) => {
					const target = event.target;
					if (target instanceof Node && element.contains(target)) {
						defaultPrevented = event.defaultPrevented;
					}
				};
				const user = userEvent.setup();

				document.addEventListener('click', captureDefaultPrevented);
				try {
					if (options.modifierKey) {
						await user.keyboard(`[${options.modifierKey}>]`);
					}
					await user.click(element);
					if (options.modifierKey) {
						await user.keyboard(`[/${options.modifierKey}]`);
					}
				} finally {
					document.removeEventListener('click', captureDefaultPrevented);
				}

				return {
					actionElement: element,
					defaultPrevented,
				};
			};

			it('should call callback handler for basic click', async () => {
				const spy = jest.fn();
				renderActionCard([
					{
						label: 'test',
						callback: spy,
					},
				]);

				const { defaultPrevented } = await clickActionElement(getActionElement());
				expect(spy).toHaveBeenCalledTimes(1);
				expect(defaultPrevented).toBe(true);
			});

			it('should call callback handler for cmd+click', async () => {
				const spy = jest.fn();
				renderActionCard([
					{
						label: 'test',
						callback: spy,
					},
				]);

				const { defaultPrevented } = await clickActionElement(getActionElement('test'), {
					modifierKey: 'MetaLeft',
				});
				expect(spy).not.toHaveBeenCalled();
				expect(defaultPrevented).toBe(false);
			});

			it('should call callback handler for alt+click', async () => {
				const spy = jest.fn();
				renderActionCard([
					{
						label: 'test',
						callback: spy,
					},
				]);

				const { defaultPrevented } = await clickActionElement(getActionElement('test'), {
					modifierKey: 'AltLeft',
				});
				expect(spy).not.toHaveBeenCalled();
				expect(defaultPrevented).toBe(false);
			});

			it('should call callback handler for ctrl+click', async () => {
				const spy = jest.fn();
				renderActionCard([
					{
						label: 'test',
						callback: spy,
					},
				]);

				const { defaultPrevented } = await clickActionElement(getActionElement('test'), {
					modifierKey: 'ControlLeft',
				});
				expect(spy).not.toHaveBeenCalled();
				expect(defaultPrevented).toBe(false);
			});

			it('should call callback handler for shift+click', async () => {
				const spy = jest.fn();
				renderActionCard([
					{
						label: 'test',
						callback: spy,
					},
				]);

				const { defaultPrevented } = await clickActionElement(getActionElement('test'), {
					modifierKey: 'ShiftLeft',
				});
				expect(spy).not.toHaveBeenCalled();
				expect(defaultPrevented).toBe(false);
			});

			it('link default behavior should be prevented if a callback is provided', async () => {
				const spy = jest.fn();
				renderActionCard([
					{
						label: 'test',
						callback: spy,
						link: '#',
					},
				]);

				const { actionElement, defaultPrevented } = await clickActionElement(getActionLink());
				expect(actionElement.getAttribute('href')).toBe('#');
				expect(spy).toHaveBeenCalledTimes(1);
				expect(defaultPrevented).toBe(true);
			});

			it('link default behaviour should not be prevented if no callback provided', async () => {
				renderActionCard([
					{
						label: 'test',
						link: '#',
					},
				]);

				const { actionElement, defaultPrevented } = await clickActionElement(getActionLink());
				expect(actionElement.getAttribute('href')).toBe('#');
				expect(defaultPrevented).toBe(false);
			});
		});
	});

	it('capture and report a11y violations', async () => {
		const { container } = renderComponent();
		await expect(container).toBeAccessible();
	});
});
