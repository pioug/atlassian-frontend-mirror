import React from 'react';

import { act, createEvent, fireEvent, render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import type { AnalyticsEventPayload } from '@atlaskit/analytics-next';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import TeamProfileCard from '../../components/Team/TeamProfileCard';
import { type AnalyticsFunctionNext } from '../../types';
import {
	actionClicked,
	errorRetryClicked,
	moreActionsClicked,
	moreMembersClicked,
	profileCardRendered,
	teamAvatarClicked,
} from '../../util/analytics';

const analyticsListener = jest.fn();
const analyticsListenerNext = jest.fn();

const analytics = (fn: (duration: number) => Record<string, any>) =>
	analyticsListener(fn(SAMPLE_DURATION));
const analyticsNext: AnalyticsFunctionNext = (eventKey, fn) =>
	analyticsListenerNext(eventKey, fn(SAMPLE_DURATION));

const SAMPLE_DURATION = 3.14159265;

const defaultProps = {
	analytics,
	analyticsNext,
	viewProfileLink: 'http://example.com/team/123',
};

const renderWithIntl = (component: React.ReactNode) => {
	return render(
		<IntlProvider locale="en" defaultLocale="en-US">
			{component}
		</IntlProvider>,
	);
};

// Returns an integer x such that min <= x < max
function randInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function flexiTime(event: Record<string, any>): AnalyticsEventPayload {
	return {
		...event,
		attributes: {
			...event.attributes,
			firedAt: expect.anything(),
		},
	};
}

const generateMembers = (n: number) => {
	const members = [];
	while (n-- > 0) {
		members.push({
			id: Math.random().toString(),
			fullName: Math.random().toString(),
			avatarUrl: '',
		});
	}

	return members;
};

describe('TeamProfileCard', () => {
	const spinnerLoadingEvent = flexiTime(
		profileCardRendered('team', 'spinner', { duration: SAMPLE_DURATION }),
	);
	const errorEvent = flexiTime(profileCardRendered('team', 'error', { duration: SAMPLE_DURATION }));
	const errorEventWithRetry = flexiTime(
		profileCardRendered('team', 'error', { duration: SAMPLE_DURATION, hasRetry: true }),
	);

	const errorRetryEvent = flexiTime(errorRetryClicked({ duration: SAMPLE_DURATION }));
	const contentEvent = flexiTime(
		profileCardRendered('team', 'content', {
			duration: SAMPLE_DURATION,
			numActions: 1,
			memberCount: 0,
			includingYou: false,
			descriptionLength: 6,
			titleLength: 9,
		}),
	);

	beforeEach(() => {
		analyticsListener.mockReset();
		analyticsListenerNext.mockReset();
	});

	ffTest.off('ptc-enable-profile-card-analytics-refactor', 'legacy analytics', () => {
		it('should render spinner when isLoading is true', async () => {
			const { getByTestId } = renderWithIntl(<TeamProfileCard isLoading {...defaultProps} />);

			const spinner = getByTestId('team-profilecard-spinner');

			expect(spinner).toBeDefined();
			expect(analyticsListener).toHaveBeenCalledWith(spinnerLoadingEvent);

			await expect(document.body).toBeAccessible();
		});
		describe('Error state', () => {
			it('should render error content when hasError is true', async () => {
				const { getByTestId } = renderWithIntl(
					<TeamProfileCard hasError {...defaultProps} clientFetchProfile={() => null} />,
				);

				const errorView = getByTestId('team-profilecard-error');

				expect(errorView).toBeDefined();
				expect(analyticsListener).toHaveBeenCalledWith(errorEventWithRetry);

				await expect(document.body).toBeAccessible();
			});

			it('should call clientFetchProfile when re-fetch button is clicked', async () => {
				const clientFetchProfile = jest.fn();
				const { getByTestId } = renderWithIntl(
					<TeamProfileCard hasError {...defaultProps} clientFetchProfile={clientFetchProfile} />,
				);

				act(() => {
					fireEvent.click(getByTestId('client-fetch-profile-button'));
				});

				expect(clientFetchProfile).toHaveBeenCalledTimes(1);
				expect(analyticsListener).toHaveBeenCalledWith(errorRetryEvent);

				await expect(document.body).toBeAccessible();
			});

			it('should render TeamsForbiddenErrorState when errorType is TEAMS_FORBIDDEN', async () => {
				const { getByTestId } = renderWithIntl(
					<TeamProfileCard
						hasError
						errorType={{ reason: 'TEAMS_FORBIDDEN' }}
						{...defaultProps}
						clientFetchProfile={() => null}
					/>,
				);

				const teamsForbiddenErrorState = getByTestId('team-profilecard-forbidden-error-state');

				expect(teamsForbiddenErrorState).toBeDefined();
				expect(analyticsListener).toHaveBeenCalledWith(errorEvent);

				await expect(document.body).toBeAccessible();
			});
		});

		it('should send content analytics when rendering successfully', async () => {
			const onClick = jest.fn();
			renderWithIntl(
				<TeamProfileCard
					{...defaultProps}
					team={{
						id: '123',
						displayName: 'Team name',
						description: 'A team',
						members: [],
					}}
					viewProfileOnClick={onClick}
				/>,
			);

			expect(analyticsListener).toHaveBeenCalledWith(contentEvent);

			await expect(document.body).toBeAccessible();
		});
	});

	ffTest.on('ptc-enable-profile-card-analytics-refactor', 'new analytics', () => {
		it('should render spinner when isLoading is true', async () => {
			const { getByTestId } = renderWithIntl(<TeamProfileCard isLoading {...defaultProps} />);

			const spinner = getByTestId('team-profilecard-spinner');

			expect(spinner).toBeDefined();
			expect(analyticsListenerNext).toHaveBeenCalledWith(
				`ui.${spinnerLoadingEvent.actionSubject}.${spinnerLoadingEvent.action}.${spinnerLoadingEvent.actionSubjectId}`,
				spinnerLoadingEvent.attributes,
			);

			await expect(document.body).toBeAccessible();
		});
		describe('Error state', () => {
			it('should render error content when hasError is true', async () => {
				const { getByTestId } = renderWithIntl(
					<TeamProfileCard hasError {...defaultProps} clientFetchProfile={() => null} />,
				);

				const errorView = getByTestId('team-profilecard-error');

				expect(errorView).toBeDefined();
				expect(analyticsListenerNext).toHaveBeenCalledWith(
					`ui.${errorEventWithRetry.actionSubject}.${errorEventWithRetry.action}.${errorEventWithRetry.actionSubjectId}`,
					errorEventWithRetry.attributes,
				);

				await expect(document.body).toBeAccessible();
			});

			it('should call clientFetchProfile when re-fetch button is clicked', async () => {
				const clientFetchProfile = jest.fn();
				const { getByTestId } = renderWithIntl(
					<TeamProfileCard hasError {...defaultProps} clientFetchProfile={clientFetchProfile} />,
				);

				act(() => {
					fireEvent.click(getByTestId('client-fetch-profile-button'));
				});

				expect(clientFetchProfile).toHaveBeenCalledTimes(1);
				expect(analyticsListenerNext).toHaveBeenCalledWith(
					`ui.${errorRetryEvent.actionSubject}.${errorRetryEvent.action}.${errorRetryEvent.actionSubjectId}`,
					errorRetryEvent.attributes,
				);

				await expect(document.body).toBeAccessible();
			});

			it('should render TeamsForbiddenErrorState when errorType is TEAMS_FORBIDDEN', async () => {
				const { getByTestId } = renderWithIntl(
					<TeamProfileCard
						hasError
						errorType={{ reason: 'TEAMS_FORBIDDEN' }}
						{...defaultProps}
						clientFetchProfile={() => null}
					/>,
				);

				const teamsForbiddenErrorState = getByTestId('team-profilecard-forbidden-error-state');

				expect(teamsForbiddenErrorState).toBeDefined();
				expect(analyticsListenerNext).toHaveBeenCalledWith(
					`ui.${errorEvent.actionSubject}.${errorEvent.action}.${errorEvent.actionSubjectId}`,
					errorEvent.attributes,
				);

				await expect(document.body).toBeAccessible();
			});
		});

		it('should send content analytics when rendering successfully', async () => {
			const onClick = jest.fn();
			renderWithIntl(
				<TeamProfileCard
					{...defaultProps}
					team={{
						id: '123',
						displayName: 'Team name',
						description: 'A team',
						members: [],
					}}
					viewProfileOnClick={onClick}
				/>,
			);

			expect(analyticsListenerNext).toHaveBeenCalledWith(
				`ui.${contentEvent.actionSubject}.${contentEvent.action}.${contentEvent.actionSubjectId}`,
				contentEvent.attributes,
			);

			await expect(document.body).toBeAccessible();
		});
	});
	describe('Action buttons', () => {
		describe('Click behaviour (cmd+click, ctrl+click, etc)', () => {
			const setupClickTest = () => {
				const onClick = jest.fn();
				const { getByText } = renderWithIntl(
					<TeamProfileCard
						{...defaultProps}
						team={{
							id: '123',
							displayName: 'Team name',
							description: 'A team',
						}}
						viewProfileOnClick={onClick}
					/>,
				);

				const button = getByText('View profile');

				return {
					onClick,
					button,
				};
			};

			it('should call onClick for basic click', async () => {
				const { button, onClick } = setupClickTest();

				const basicClick = createEvent.click(button);
				basicClick.preventDefault = jest.fn();

				act(() => {
					fireEvent(button, basicClick);
				});

				expect(onClick).toHaveBeenCalledTimes(1);
				expect(basicClick.preventDefault).toHaveBeenCalledTimes(1);

				await expect(document.body).toBeAccessible();
			});

			it('should not call onClick for cmd+click', async () => {
				const { button, onClick } = setupClickTest();

				const commandClick = createEvent.click(button, { metaKey: true });
				commandClick.preventDefault = jest.fn();

				act(() => {
					fireEvent(button, commandClick);
				});

				expect(onClick).not.toHaveBeenCalled();
				expect(commandClick.preventDefault).not.toHaveBeenCalled();

				await expect(document.body).toBeAccessible();
			});

			it('should not call onClick for alt+click', async () => {
				const { button, onClick } = setupClickTest();

				const altClick = createEvent.click(button, { altKey: true });
				altClick.preventDefault = jest.fn();

				act(() => {
					fireEvent(button, altClick);
				});

				expect(onClick).not.toHaveBeenCalled();
				expect(altClick.preventDefault).not.toHaveBeenCalled();

				await expect(document.body).toBeAccessible();
			});

			it('should not call onClick for ctrl+click', async () => {
				const { button, onClick } = setupClickTest();

				const controlClick = createEvent.click(button, { ctrlKey: true });
				controlClick.preventDefault = jest.fn();

				act(() => {
					fireEvent(button, controlClick);
				});

				expect(onClick).not.toHaveBeenCalled();
				expect(controlClick.preventDefault).not.toHaveBeenCalled();

				await expect(document.body).toBeAccessible();
			});

			it('should not call onClick for shift+click', async () => {
				const { button, onClick } = setupClickTest();

				const shiftClick = createEvent.click(button, { shiftKey: true });
				shiftClick.preventDefault = jest.fn();

				act(() => {
					fireEvent(button, shiftClick);
				});

				expect(onClick).not.toHaveBeenCalled();
				expect(shiftClick.preventDefault).not.toHaveBeenCalled();

				await expect(document.body).toBeAccessible();
			});
		});

		describe('View profile button', () => {
			const viewProfileEvent = flexiTime(
				actionClicked('team', {
					duration: SAMPLE_DURATION,
					hasHref: true,
					hasOnClick: true,
					index: 0,
					actionId: 'view-profile',
				}),
			);
			ffTest.off('ptc-enable-profile-card-analytics-refactor', 'legacy analytics', () => {
				it('should call viewProfileOnClick on click if provided', async () => {
					const onClick = jest.fn();
					const { getByText } = renderWithIntl(
						<TeamProfileCard
							{...defaultProps}
							team={{
								id: '123',
								displayName: 'Team name',
								description: 'A team',
							}}
							viewProfileOnClick={onClick}
						/>,
					);

					const button = getByText('View profile');

					act(() => {
						fireEvent.click(button);
					});

					expect(onClick).toHaveBeenCalledTimes(1);
					expect(analyticsListener).toHaveBeenCalledWith(viewProfileEvent);

					await expect(document.body).toBeAccessible();
				});
			});
			ffTest.on('ptc-enable-profile-card-analytics-refactor', 'new analytics', () => {
				it('should call viewProfileOnClick on click if provided', async () => {
					const onClick = jest.fn();
					const { getByText } = renderWithIntl(
						<TeamProfileCard
							{...defaultProps}
							team={{
								id: '123',
								displayName: 'Team name',
								description: 'A team',
							}}
							viewProfileOnClick={onClick}
						/>,
					);

					const button = getByText('View profile');

					act(() => {
						fireEvent.click(button);
					});

					expect(onClick).toHaveBeenCalledTimes(1);
					expect(analyticsListenerNext).toHaveBeenCalledWith(
						`ui.${viewProfileEvent.actionSubject}.${viewProfileEvent.action}.${viewProfileEvent.actionSubjectId}`,
						viewProfileEvent.attributes,
					);

					await expect(document.body).toBeAccessible();
				});
			});

			it('should have appropriate href', async () => {
				const link = 'http://example.com/team/abcd';
				const { getByText } = renderWithIntl(
					<TeamProfileCard
						{...defaultProps}
						team={{
							id: '123',
							displayName: 'Team name',
							description: 'A team',
						}}
						viewProfileLink={link}
					/>,
				);

				expect(getByText('View profile').closest('a')).toHaveAttribute('href', link);

				await expect(document.body).toBeAccessible();
			});
		});
		it('should not display more button if no actions provided', async () => {
			const { getByText, queryByTestId } = renderWithIntl(
				<TeamProfileCard
					{...defaultProps}
					team={{
						id: '123',
						displayName: 'Team name',
						description: 'A team',
					}}
				/>,
			);

			expect(queryByTestId('more-actions-button')).toBe(null);

			expect(getByText('View profile')).toBeDefined();

			await expect(document.body).toBeAccessible();
		});

		it('should not display more button if one action is provided', async () => {
			const callback = jest.fn();
			const { getByText, queryByTestId } = renderWithIntl(
				<TeamProfileCard
					{...defaultProps}
					team={{
						id: '123',
						displayName: 'Team name',
						description: 'A team',
					}}
					actions={[{ label: 'Extra button', callback }]}
				/>,
			);

			expect(queryByTestId('more-actions-button')).toBe(null);

			const actionButton = getByText('Extra button');

			expect(getByText('View profile')).toBeDefined();
			expect(actionButton).toBeDefined();

			act(() => {
				fireEvent.click(actionButton);
			});

			expect(callback).toHaveBeenCalledTimes(1);

			await expect(document.body).toBeAccessible();
		});

		ffTest.off('ptc-enable-profile-card-analytics-refactor', 'legacy analytics', () => {
			it('should open dropdown when more button clicked', async () => {
				const firstCallback = jest.fn();
				const secondCallback = jest.fn();
				const { getByTestId, getByText, queryByText } = renderWithIntl(
					<TeamProfileCard
						{...defaultProps}
						team={{
							id: '123',
							displayName: 'Team name',
							description: 'A team',
						}}
						actions={[
							{
								label: 'First extra',
								id: 'first-extra',
								callback: firstCallback,
							},
							{
								label: 'Second extra',
								id: 'second-extra',
								callback: secondCallback,
							},
						]}
					/>,
				);

				const moreButton = getByTestId('more-actions-button');

				expect(getByText('View profile')).toBeDefined();
				expect(moreButton).toBeDefined();

				expect(getByText('First extra')).toBeDefined();

				expect(queryByText('Second extra')).toBe(null);

				act(() => {
					fireEvent.click(moreButton);
				});

				expect(analyticsListener).toHaveBeenCalledWith(
					flexiTime(
						moreActionsClicked('team', {
							duration: SAMPLE_DURATION,
							numActions: 3,
						}),
					),
				);

				expect(getByText('First extra')).toBeDefined();

				expect(getByText('Second extra')).toBeDefined();

				act(() => {
					fireEvent.click(getByText('Second extra'));
				});

				expect(analyticsListener).toHaveBeenCalledWith(
					flexiTime(
						actionClicked('team', {
							duration: SAMPLE_DURATION,
							hasHref: false,
							hasOnClick: true,
							index: 2,
							actionId: 'second-extra',
						}),
					),
				);

				expect(firstCallback).toHaveBeenCalledTimes(0);
				expect(secondCallback).toHaveBeenCalledTimes(1);

				act(() => {
					fireEvent.click(getByText('First extra'));
				});

				expect(analyticsListener).toHaveBeenCalledWith(
					flexiTime(
						actionClicked('team', {
							duration: SAMPLE_DURATION,
							hasHref: false,
							hasOnClick: true,
							index: 1,
							actionId: 'first-extra',
						}),
					),
				);

				expect(firstCallback).toHaveBeenCalledTimes(1);
				expect(secondCallback).toHaveBeenCalledTimes(1);

				await expect(document.body).toBeAccessible();
			});
		});
		ffTest.on('ptc-enable-profile-card-analytics-refactor', 'new analytics', () => {
			it('should open dropdown when more button clicked', async () => {
				const firstCallback = jest.fn();
				const secondCallback = jest.fn();
				const { getByTestId, getByText, queryByText } = renderWithIntl(
					<TeamProfileCard
						{...defaultProps}
						team={{
							id: '123',
							displayName: 'Team name',
							description: 'A team',
						}}
						actions={[
							{
								label: 'First extra',
								id: 'first-extra',
								callback: firstCallback,
							},
							{
								label: 'Second extra',
								id: 'second-extra',
								callback: secondCallback,
							},
						]}
					/>,
				);

				const moreButton = getByTestId('more-actions-button');

				expect(getByText('View profile')).toBeDefined();
				expect(moreButton).toBeDefined();

				expect(getByText('First extra')).toBeDefined();

				expect(queryByText('Second extra')).toBe(null);

				act(() => {
					fireEvent.click(moreButton);
				});

				const moreActionsEvent = flexiTime(
					moreActionsClicked('team', {
						duration: SAMPLE_DURATION,
						numActions: 3,
					}),
				);
				expect(analyticsListenerNext).toHaveBeenCalledWith(
					`ui.${moreActionsEvent.actionSubject}.${moreActionsEvent.action}.${moreActionsEvent.actionSubjectId}`,
					moreActionsEvent.attributes,
				);

				expect(getByText('First extra')).toBeDefined();

				expect(getByText('Second extra')).toBeDefined();

				act(() => {
					fireEvent.click(getByText('Second extra'));
				});

				const actionEvent = flexiTime(
					actionClicked('team', {
						duration: SAMPLE_DURATION,
						hasHref: false,
						hasOnClick: true,
						index: 2,
						actionId: 'second-extra',
					}),
				);
				expect(analyticsListenerNext).toHaveBeenCalledWith(
					`ui.${actionEvent.actionSubject}.${actionEvent.action}.${actionEvent.actionSubjectId}`,
					actionEvent.attributes,
				);

				expect(firstCallback).toHaveBeenCalledTimes(0);
				expect(secondCallback).toHaveBeenCalledTimes(1);

				act(() => {
					fireEvent.click(getByText('First extra'));
				});

				const actionEventIndex1 = flexiTime(
					actionClicked('team', {
						duration: SAMPLE_DURATION,
						hasHref: false,
						hasOnClick: true,
						index: 1,
						actionId: 'first-extra',
					}),
				);

				expect(analyticsListenerNext).toHaveBeenCalledWith(
					`ui.${actionEventIndex1.actionSubject}.${actionEventIndex1.action}.${actionEventIndex1.actionSubjectId}`,
					actionEventIndex1.attributes,
				);

				expect(firstCallback).toHaveBeenCalledTimes(1);
				expect(secondCallback).toHaveBeenCalledTimes(1);

				await expect(document.body).toBeAccessible();
			});
		});
	});

	describe('Member count', () => {
		it('should include the "Team" label', async () => {
			const numMembers = Math.floor(randInt(0, 100));
			const { getByText } = renderWithIntl(
				<TeamProfileCard
					{...defaultProps}
					team={{
						id: '123',
						displayName: 'Some people group',
						description: 'This is a description',
						members: generateMembers(numMembers),
					}}
				/>,
			);

			// The component with the member count must start with "Team"
			expect(getByText(/^Team .* members?$/)).toBeDefined();

			await expect(document.body).toBeAccessible();
		});

		it('should show 0 member team', async () => {
			const { getByText } = renderWithIntl(
				<TeamProfileCard
					{...defaultProps}
					team={{
						id: '123',
						displayName: 'Team name',
						description: 'A team',
						members: [],
					}}
				/>,
			);

			expect(getByText('0 members', { exact: false })).toBeDefined();

			await expect(document.body).toBeAccessible();
		});

		it('should show number of members for number <50', async () => {
			const numMembers = randInt(1, 50);
			const { getByText } = renderWithIntl(
				<TeamProfileCard
					{...defaultProps}
					team={{
						id: '123',
						displayName: 'Team name',
						description: 'A team',
						members: generateMembers(numMembers),
					}}
				/>,
			);

			// Must be "member" not "members" to account for "1 member"
			expect(getByText(new RegExp(`${numMembers} members?`))).toBeDefined();

			await expect(document.body).toBeAccessible();
		});

		it('should show estimate for teams with >50 members', async () => {
			const numMembers = randInt(50, 150);
			const { getByText } = renderWithIntl(
				<TeamProfileCard
					{...defaultProps}
					team={{
						id: '123',
						displayName: 'Team name',
						description: 'A team',
						members: generateMembers(numMembers),
					}}
				/>,
			);

			// Must be "member" not "members" to account for "1 member"
			expect(getByText('50+ members', { exact: false })).toBeDefined();

			await expect(document.body).toBeAccessible();
		});

		it('should show member count including you for teams with <50 members', async () => {
			const numMembers = randInt(1, 50);
			const members = generateMembers(numMembers);

			const { getByText } = renderWithIntl(
				<TeamProfileCard
					{...defaultProps}
					team={{
						id: '123',
						displayName: 'Team name',
						description: 'A team',
						members,
					}}
					viewingUserId={members[randInt(0, numMembers)].id}
				/>,
			);

			// Must be "member" not "members" to account for "1 member"
			expect(getByText(new RegExp(`${numMembers} members?, including you`))).toBeDefined();

			await expect(document.body).toBeAccessible();
		});

		it('should show estimate including you for teams with >50 members', async () => {
			const numMembers = randInt(50, 150);
			const members = generateMembers(numMembers);
			const { getByText } = renderWithIntl(
				<TeamProfileCard
					{...defaultProps}
					team={{
						id: '123',
						displayName: 'Team name',
						description: 'A team',
						members,
					}}
					viewingUserId={members[randInt(0, numMembers)].id}
				/>,
			);

			// Must be "member" not "members" to account for "1 member"
			expect(getByText('50+ members, including you', { exact: false })).toBeDefined();

			await expect(document.body).toBeAccessible();
		});

		ffTest.off('ptc-enable-profile-card-analytics-refactor', 'legacy analytics', () => {
			it('should be able to expand to find a list of all members', async () => {
				const NUM_MEMBERS = 11;
				const members = generateMembers(NUM_MEMBERS - 1).concat({
					id: 'abcd',
					fullName: 'Simple name',
					avatarUrl: '',
				});

				const { getByText, queryByText } = renderWithIntl(
					<TeamProfileCard
						{...defaultProps}
						team={{
							id: '123',
							displayName: 'Team name',
							description: 'A team',
							members,
						}}
					/>,
				);

				expect(queryByText('Simple name')).toBe(null);

				expect(getByText('+3')).toBeDefined();

				act(() => {
					fireEvent.click(getByText('+3'));
				});

				expect(getByText('Simple name')).toBeDefined();

				expect(analyticsListener).toHaveBeenCalledWith(
					flexiTime(
						moreMembersClicked({
							duration: SAMPLE_DURATION,
							memberCount: NUM_MEMBERS,
						}),
					),
				);

				await expect(document.body).toBeAccessible();
			});
		});

		ffTest.on('ptc-enable-profile-card-analytics-refactor', 'new analytics', () => {
			it('should be able to expand to find a list of all members', async () => {
				const NUM_MEMBERS = 11;
				const members = generateMembers(NUM_MEMBERS - 1).concat({
					id: 'abcd',
					fullName: 'Simple name',
					avatarUrl: '',
				});

				const { getByText, queryByText } = renderWithIntl(
					<TeamProfileCard
						{...defaultProps}
						team={{
							id: '123',
							displayName: 'Team name',
							description: 'A team',
							members,
						}}
					/>,
				);

				expect(queryByText('Simple name')).toBe(null);

				expect(getByText('+3')).toBeDefined();

				act(() => {
					fireEvent.click(getByText('+3'));
				});

				expect(getByText('Simple name')).toBeDefined();

				const moreMembersEvent = flexiTime(
					moreMembersClicked({
						duration: SAMPLE_DURATION,
						memberCount: NUM_MEMBERS,
					}),
				);

				expect(analyticsListenerNext).toHaveBeenCalledWith(
					`ui.${moreMembersEvent.actionSubject}.${moreMembersEvent.action}.${moreMembersEvent.actionSubjectId}`,
					moreMembersEvent.attributes,
				);

				await expect(document.body).toBeAccessible();
			});
		});
	});

	describe('Avatar group', () => {
		beforeEach(() => {
			analyticsListener.mockReset();
			analyticsListenerNext.mockReset();
		});

		it('should show expected href on avatars', async () => {
			const members = generateMembers(3);

			const generateUserLink = (userId: string) => `https://example.com/user/${userId}`;

			const { getByRole } = renderWithIntl(
				<TeamProfileCard
					{...defaultProps}
					team={{
						id: '123',
						displayName: 'Team name',
						description: 'A team',
						members,
					}}
					generateUserLink={generateUserLink}
				/>,
			);

			const expectedLink = generateUserLink(members[0].id);

			expect(getByRole('link', { name: members[0].fullName })).toHaveAttribute(
				'href',
				expectedLink,
			);

			await expect(document.body).toBeAccessible();
		});

		ffTest.off('ptc-enable-profile-card-analytics-refactor', 'legacy analytics', () => {
			it('should fire analytics on avatar click', async () => {
				const members = generateMembers(3);

				const { getByRole } = renderWithIntl(
					<TeamProfileCard
						{...defaultProps}
						team={{
							id: '123',
							displayName: 'Team name',
							description: 'A team',
							members,
						}}
					/>,
				);

				act(() => {
					fireEvent.click(getByRole('button', { name: members[0].fullName }));
				});

				expect(analyticsListener).toHaveBeenCalledWith(
					flexiTime(
						teamAvatarClicked({
							duration: SAMPLE_DURATION,
							hasOnClick: false,
							hasHref: false,
							index: 0,
						}),
					),
				);

				await expect(document.body).toBeAccessible();
			});

			it('should fire analytics on avatar click when href is provided', async () => {
				const members = generateMembers(3);

				const generateUserLink = (userId: string) => `https://example.com/user/${userId}`;

				const { getByRole } = renderWithIntl(
					<TeamProfileCard
						{...defaultProps}
						team={{
							id: '123',
							displayName: 'Team name',
							description: 'A team',
							members,
						}}
						generateUserLink={generateUserLink}
					/>,
				);

				act(() => {
					fireEvent.click(getByRole('link', { name: members[0].fullName }));
				});

				expect(analyticsListener).toHaveBeenCalledWith(
					flexiTime(
						teamAvatarClicked({
							duration: SAMPLE_DURATION,
							hasOnClick: false,
							hasHref: true,
							index: 0,
						}),
					),
				);

				await expect(document.body).toBeAccessible();
			});

			it('should fire analytics on avatar click when onClick is provided and call onClick', async () => {
				const members = generateMembers(3);

				const onUserClick = jest.fn();

				const { getByRole } = renderWithIntl(
					<TeamProfileCard
						{...defaultProps}
						team={{
							id: '123',
							displayName: 'Team name',
							description: 'A team',
							members,
						}}
						onUserClick={onUserClick}
					/>,
				);

				act(() => {
					fireEvent.click(getByRole('button', { name: members[0].fullName }));
				});

				expect(analyticsListener).toHaveBeenCalledWith(
					flexiTime(
						teamAvatarClicked({
							duration: SAMPLE_DURATION,
							hasOnClick: true,
							hasHref: false,
							index: 0,
						}),
					),
				);

				expect(onUserClick).toHaveBeenCalledWith(members[0].id, expect.anything());

				await expect(document.body).toBeAccessible();
			});

			it('should fire analytics on avatar click when onClick and link are provided and call onClick', async () => {
				const members = generateMembers(3);

				const onUserClick = jest.fn();

				const generateUserLink = (userId: string) => `https://example.com/user/${userId}`;

				const { getByRole } = renderWithIntl(
					<TeamProfileCard
						{...defaultProps}
						team={{
							id: '123',
							displayName: 'Team name',
							description: 'A team',
							members,
						}}
						onUserClick={onUserClick}
						generateUserLink={generateUserLink}
					/>,
				);

				const avatarLink = getByRole('link', { name: members[0].fullName });

				act(() => {
					fireEvent.click(avatarLink);
				});

				expect(analyticsListener).toHaveBeenCalledWith(
					flexiTime(
						teamAvatarClicked({
							duration: SAMPLE_DURATION,
							hasOnClick: true,
							hasHref: true,
							index: 0,
						}),
					),
				);

				expect(onUserClick).toHaveBeenCalledWith(members[0].id, expect.anything());

				const expectedLink = generateUserLink(members[0].id);

				expect(avatarLink).toHaveAttribute('href', expectedLink);

				await expect(document.body).toBeAccessible();
			});
		});

		ffTest.on('ptc-enable-profile-card-analytics-refactor', 'new analytics', () => {
			it('should fire analytics on avatar click', async () => {
				const members = generateMembers(3);

				const { getByRole } = renderWithIntl(
					<TeamProfileCard
						{...defaultProps}
						team={{
							id: '123',
							displayName: 'Team name',
							description: 'A team',
							members,
						}}
					/>,
				);

				act(() => {
					fireEvent.click(getByRole('button', { name: members[0].fullName }));
				});

				const teamAvatarEvent = flexiTime(
					teamAvatarClicked({
						duration: SAMPLE_DURATION,
						hasOnClick: false,
						hasHref: false,
						index: 0,
					}),
				);
				expect(analyticsListenerNext).toHaveBeenCalledWith(
					`ui.${teamAvatarEvent.actionSubject}.${teamAvatarEvent.action}.${teamAvatarEvent.actionSubjectId}`,
					teamAvatarEvent.attributes,
				);

				await expect(document.body).toBeAccessible();
			});

			it('should fire analytics on avatar click when href is provided', async () => {
				const members = generateMembers(3);

				const generateUserLink = (userId: string) => `https://example.com/user/${userId}`;

				const { getByRole } = renderWithIntl(
					<TeamProfileCard
						{...defaultProps}
						team={{
							id: '123',
							displayName: 'Team name',
							description: 'A team',
							members,
						}}
						generateUserLink={generateUserLink}
					/>,
				);

				act(() => {
					fireEvent.click(getByRole('link', { name: members[0].fullName }));
				});

				const teamAvatarEvent = flexiTime(
					teamAvatarClicked({
						duration: SAMPLE_DURATION,
						hasOnClick: false,
						hasHref: true,
						index: 0,
					}),
				);
				expect(analyticsListenerNext).toHaveBeenCalledWith(
					`ui.${teamAvatarEvent.actionSubject}.${teamAvatarEvent.action}.${teamAvatarEvent.actionSubjectId}`,
					teamAvatarEvent.attributes,
				);

				await expect(document.body).toBeAccessible();
			});

			it('should fire analytics on avatar click when onClick is provided and call onClick', async () => {
				const members = generateMembers(3);

				const onUserClick = jest.fn();

				const { getByRole } = renderWithIntl(
					<TeamProfileCard
						{...defaultProps}
						team={{
							id: '123',
							displayName: 'Team name',
							description: 'A team',
							members,
						}}
						onUserClick={onUserClick}
					/>,
				);

				act(() => {
					fireEvent.click(getByRole('button', { name: members[0].fullName }));
				});

				const teamAvatarEvent = flexiTime(
					teamAvatarClicked({
						duration: SAMPLE_DURATION,
						hasOnClick: true,
						hasHref: false,
						index: 0,
					}),
				);
				expect(analyticsListenerNext).toHaveBeenCalledWith(
					`ui.${teamAvatarEvent.actionSubject}.${teamAvatarEvent.action}.${teamAvatarEvent.actionSubjectId}`,
					teamAvatarEvent.attributes,
				);

				expect(onUserClick).toHaveBeenCalledWith(members[0].id, expect.anything());

				await expect(document.body).toBeAccessible();
			});

			it('should fire analytics on avatar click when onClick and link are provided and call onClick', async () => {
				const members = generateMembers(3);

				const onUserClick = jest.fn();

				const generateUserLink = (userId: string) => `https://example.com/user/${userId}`;

				const { getByRole } = renderWithIntl(
					<TeamProfileCard
						{...defaultProps}
						team={{
							id: '123',
							displayName: 'Team name',
							description: 'A team',
							members,
						}}
						onUserClick={onUserClick}
						generateUserLink={generateUserLink}
					/>,
				);

				const avatarLink = getByRole('link', { name: members[0].fullName });

				act(() => {
					fireEvent.click(avatarLink);
				});

				const teamAvatarEvent = flexiTime(
					teamAvatarClicked({
						duration: SAMPLE_DURATION,
						hasOnClick: true,
						hasHref: true,
						index: 0,
					}),
				);
				expect(analyticsListenerNext).toHaveBeenCalledWith(
					`ui.${teamAvatarEvent.actionSubject}.${teamAvatarEvent.action}.${teamAvatarEvent.actionSubjectId}`,
					teamAvatarEvent.attributes,
				);

				expect(onUserClick).toHaveBeenCalledWith(members[0].id, expect.anything());

				const expectedLink = generateUserLink(members[0].id);

				expect(avatarLink).toHaveAttribute('href', expectedLink);

				await expect(document.body).toBeAccessible();
			});
		});
	});
});
