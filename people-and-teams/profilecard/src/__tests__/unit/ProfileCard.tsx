import React from 'react';

import { act, fireEvent, render, within } from '@testing-library/react';
import { mount } from 'enzyme';

import { ProfilecardInternal as ProfileCard } from '../../components/User/ProfileCard';
import { ActionButtonGroup } from '../../styled/Card';
import { moreActionsClicked, profileCardRendered } from '../../util/analytics';

jest.mock('react-intl-next', () => {
	return {
		...(jest.requireActual('react-intl-next') as any),
		useIntl: jest.fn().mockReturnValue({
			locale: 'en',
			formatMessage: (descriptor: any) => descriptor.defaultMessage,
		}),
	};
});

// Mock for runItLater
(window as any).requestIdleCallback = (callback: () => void) => callback();

const mockAnalytics = jest.fn();
mockAnalytics.mockImplementation(() => {
	return {
		fire: () => null,
	};
});

const flexiTime = (event: Record<string, any>, hasDuration?: boolean) => ({
	...event,
	attributes: {
		...event.attributes,
		firedAt: expect.anything(),
		duration: hasDuration ? expect.anything() : undefined,
	},
});

const defaultProps: Parameters<typeof ProfileCard>[0] = {
	fullName: 'full name test',
	status: 'active',
	nickname: 'jscrazy',
	companyName: 'Atlassian',
	createAnalyticsEvent: mockAnalytics,
};

const renderComponent = (props = {}) => render(<ProfileCard {...defaultProps} {...props} />);

beforeEach(() => {
	mockAnalytics.mockClear();
});

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
			renderComponent({ isLoading: true });
			expect(mockAnalytics).toHaveBeenCalledWith(
				flexiTime(profileCardRendered('user', 'spinner'), true),
			);
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
			renderComponent({
				hasError: true,
				clientFetchProfile: hasRetry ? () => null : undefined,
				errorType: errorType ? { reason: errorType } : undefined,
			});
			expect(mockAnalytics).toHaveBeenCalledWith(
				flexiTime(
					profileCardRendered('user', 'error', {
						hasRetry,
						errorType: (errorType || 'default') as 'default' | 'NotFound',
					}),
				),
			);
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
			const { getByTestId } = renderComponent({
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

			expect(mockAnalytics).toHaveBeenCalledWith(
				flexiTime(
					moreActionsClicked('user', {
						duration: expect.anything(),
						numActions: 3,
					}),
					true,
				),
			);
		});

		it('should not render any action buttons if actions property is not set', () => {
			const { queryByTestId } = renderComponent({ actions: [] });

			expect(queryByTestId('profilecard-actions')).toBeNull();
		});

		describe('Click behaviour (cmd+click, ctrl+click, etc)', () => {
			const card = mount(<ProfileCard fullName="name" actions={actions} />);

			it('should call callback handler for basic click', () => {
				const spy = jest.fn().mockImplementation(() => {});
				card.setProps({
					actions: [
						{
							label: 'test',
							callback: spy,
						},
					],
				});
				const actionsWrapper = card.find(ActionButtonGroup);
				const event = { preventDefault: jest.fn() };
				actionsWrapper.find('button[type="button"]').first().simulate('click', event);
				expect(spy).toHaveBeenCalledTimes(1);
				expect(event.preventDefault).toHaveBeenCalledTimes(1);
			});

			it('should call callback handler for cmd+click', () => {
				const spy = jest.fn().mockImplementation(() => {});
				card.setProps({
					actions: [
						{
							label: 'test',
							callback: spy,
						},
					],
				});
				const actionsWrapper = card.find(ActionButtonGroup);
				const event = { preventDefault: jest.fn(), metaKey: true };
				actionsWrapper.find('button[type="button"]').first().simulate('click', event);
				expect(spy).not.toHaveBeenCalled();
				expect(event.preventDefault).not.toHaveBeenCalled();
			});

			it('should call callback handler for alt+click', () => {
				const spy = jest.fn().mockImplementation(() => {});
				card.setProps({
					actions: [
						{
							label: 'test',
							callback: spy,
						},
					],
				});
				const actionsWrapper = card.find(ActionButtonGroup);
				const event = { preventDefault: jest.fn(), altKey: true };
				actionsWrapper.find('button[type="button"]').first().simulate('click', event);
				expect(spy).not.toHaveBeenCalled();
				expect(event.preventDefault).not.toHaveBeenCalled();
			});

			it('should call callback handler for ctrl+click', () => {
				const spy = jest.fn().mockImplementation(() => {});
				card.setProps({
					actions: [
						{
							label: 'test',
							callback: spy,
						},
					],
				});
				const actionsWrapper = card.find(ActionButtonGroup);
				const event = { preventDefault: jest.fn(), ctrlKey: true };
				actionsWrapper.find('button[type="button"]').first().simulate('click', event);
				expect(spy).not.toHaveBeenCalled();
				expect(event.preventDefault).not.toHaveBeenCalled();
			});

			it('should call callback handler for shift+click', () => {
				const spy = jest.fn().mockImplementation(() => {});
				card.setProps({
					actions: [
						{
							label: 'test',
							callback: spy,
						},
					],
				});
				const actionsWrapper = card.find(ActionButtonGroup);
				const event = { preventDefault: jest.fn(), shiftKey: true };
				actionsWrapper.find('button[type="button"]').first().simulate('click', event);
				expect(spy).not.toHaveBeenCalled();
				expect(event.preventDefault).not.toHaveBeenCalled();
			});

			it('link default behaviour should be prevented if a callback is provided', () => {
				const spy = jest.fn().mockImplementation(() => {});
				const preventDefault = jest.fn().mockImplementation(() => {});
				card.setProps({
					actions: [
						{
							label: 'test',
							callback: spy,
							link: '#',
						},
					],
				});
				const actionButton = card.find(ActionButtonGroup).find('a[href]').first();
				expect(actionButton.getDOMNode().getAttribute('href')).toBe('#');
				actionButton.simulate('click', { preventDefault });
				expect(spy.mock.calls.length).toBe(1);
				expect(preventDefault.mock.calls.length).toBe(1);
			});

			it('link default behaviour should not be prevented if no callback provided', () => {
				const preventDefault = jest.fn().mockImplementation(() => {});
				card.setProps({
					actions: [
						{
							label: 'test',
							link: '#',
						},
					],
				});
				const actionButton = card.find(ActionButtonGroup).find('a[href]').first();
				expect(actionButton.getDOMNode().getAttribute('href')).toBe('#');
				actionButton.simulate('click', { preventDefault });
				expect(preventDefault.mock.calls.length).toBe(0);
			});
		});
	});
});
