import React from 'react';

import { fireEvent, render as renderRTL } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import ProfileClient from '../../../client/ProfileCardClient';
import { getMockProfileClient } from '../../../mocks';
import { type ProfileCardTriggerProps } from '../../../types';
import { DELAY_MS_SHOW } from '../../../util/config';
import ProfilecardTriggerNext from '../ProfileCardTriggerNext';

const mockClient = getMockProfileClient(ProfileClient, 0);

const defaultProps: Omit<ProfileCardTriggerProps, 'children'> = {
	userId: 'user-id',
	cloudId: 'cloud-id',
	resourceClient: mockClient,
};

jest.mock('@atlaskit/analytics-next', () => ({
	useAnalyticsEvents: jest.fn(() => ({
		createAnalyticsEvent: jest.fn(() => ({ fire: jest.fn() })),
	})),
}));
jest.mock('@atlaskit/give-kudos', () => ({
	GiveKudosLauncherLazy: () => null,
}));

jest.mock('../../../util/analytics');

const render = (props: Partial<ProfileCardTriggerProps>) => {
	return renderRTL(
		<IntlProvider locale="en">
			<ProfilecardTriggerNext {...defaultProps} {...props}>
				<div>Trigger</div>
			</ProfilecardTriggerNext>
		</IntlProvider>,
	);
};
describe('Profile card trigger - next', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders the trigger', () => {
		const { getByText } = render({});
		expect(getByText('Trigger')).toBeTruthy();
	});

	// FIXME: Jest upgrade
	// TypeError: resourceClient.getTeamCentralBaseUrl is not a function
	it.skip('renders the popup after a delay on trigger hover', () => {
		jest.useFakeTimers();
		const { getByText, getByTestId, queryByTestId } = render({});
		const trigger = getByText('Trigger');
		// hover the trigger
		fireEvent.mouseEnter(trigger);
		// timer started, so popup should not appear yet
		expect(queryByTestId('profilecard.profilecardtrigger.loading')).toBeFalsy();
		jest.advanceTimersByTime(DELAY_MS_SHOW - 1);
		// timer not quite there, so popup should not appear yet
		expect(queryByTestId('profilecard.profilecardtrigger.loading')).toBeFalsy();
		jest.advanceTimersByTime(1);
		// now the popup should appear
		expect(getByTestId('profilecard.profilecardtrigger.loading')).toBeTruthy();
	});

	// FIXME: Jest upgrade
	// TypeError: resourceClient.getTeamCentralBaseUrl is not a function
	it.skip('renders the popup immediately on trigger click', () => {
		jest.useFakeTimers();
		const { getByText, getByTestId } = render({ trigger: 'click' });
		const trigger = getByText('Trigger');
		// click the trigger
		fireEvent.click(trigger);
		jest.advanceTimersByTime(1);
		// popup should appear immediately, (there is still a setTimeout, after 0ms)
		expect(getByTestId('profilecard.profilecardtrigger.loading')).toBeTruthy();
	});
});
