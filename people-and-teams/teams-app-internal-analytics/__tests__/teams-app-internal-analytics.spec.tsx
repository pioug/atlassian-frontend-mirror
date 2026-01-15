import React from 'react';

import { act, screen } from '@testing-library/react';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import {
	createMockAnalyticsClient,
	renderWithAnalyticsListener,
} from '@atlassian/ptc-test-utils/analytics';

import { ButtonWithAnalytics as ButtonWithPTCHookAnalytics } from '../examples/helpers/button-with-analytics';
import { ButtonWithAnalytics as ButtonWithNextHOCAnalytics } from '../examples/helpers/button-with-analytics-next-hoc';
import { ButtonWithAnalytics as ButtonWithNextHookAnalytics } from '../examples/helpers/button-with-analytics-next-hook';
import {
	operationalExampleEvent,
	screenExampleEvent,
	trackExampleEvent,
	uiExampleEvent,
} from '../examples/helpers/utils';
import {
	defaultAnalyticsContextData as defaultPeopleAndTeamsContextBaseAttributes,
	TeamsAppAnalyticsContext,
} from '../src/ui/analytics-context';

const mockClient = createMockAnalyticsClient();

describe('teams-app-internal-analytics', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe.each([
		['ButtonWithPTCHookAnalytics', ButtonWithPTCHookAnalytics],
		['ButtonWithNextHOCAnalytics', ButtonWithNextHOCAnalytics],
		['ButtonWithNextHookAnalytics', ButtonWithNextHookAnalytics],
	])('%s', (_, ButtonWithAnalytics) => {
		describe('No/Empty Context Provided', () => {
			it('should fire a UI event with default payload when no context is provided', async () => {
				const { user, expectEventToBeFired } = renderWithAnalyticsListener(
					<ButtonWithAnalytics eventType="ui" />,
					{ mockClient },
				);
				await act(() => user.click(screen.getByTestId('button-with-analytics')));

				expectEventToBeFired('ui', {
					...uiExampleEvent,
					attributes: {
						...uiExampleEvent.attributes,
						sourceHierarchy: undefined,
					},
					source: 'unknown',
				});
			});

			it('should fire a UI event with default payload and package information when an empty peopleTeams context is provided', async () => {
				const { user, expectEventToBeFired } = renderWithAnalyticsListener(
					<TeamsAppAnalyticsContext>
						<ButtonWithAnalytics eventType="ui" />
					</TeamsAppAnalyticsContext>,
					{ mockClient },
				);
				await act(() => user.click(screen.getByTestId('button-with-analytics')));

				expectEventToBeFired('ui', {
					...uiExampleEvent,
					attributes: {
						...defaultPeopleAndTeamsContextBaseAttributes,
						...uiExampleEvent.attributes,
						sourceHierarchy: undefined,
					},
					source: 'unknown',
				});
			});

			it('should fire a UI event with default payload when an empty AnalyticsContext is provided', async () => {
				const { user, expectEventToBeFired } = renderWithAnalyticsListener(
					<AnalyticsContext data={{}}>
						<ButtonWithAnalytics eventType="ui" />
					</AnalyticsContext>,
					{ mockClient },
				);
				await act(() => user.click(screen.getByTestId('button-with-analytics')));

				expectEventToBeFired('ui', {
					...uiExampleEvent,
					attributes: {
						...uiExampleEvent.attributes,
						sourceHierarchy: undefined,
					},
					source: 'unknown',
				});
			});
		});

		describe('PeopleTeamsAnalyticsContext Provided', () => {
			it('should have appended context to the payload when a peopleTeams context is provided', async () => {
				const { user, expectEventToBeFired } = renderWithAnalyticsListener(
					<TeamsAppAnalyticsContext
						data={{
							source: 'teamProfileScreen',
							attributes: { consumer: 'embed' },
						}}
					>
						<ButtonWithAnalytics eventType="ui" />
					</TeamsAppAnalyticsContext>,
					{ mockClient },
				);
				await act(() => user.click(screen.getByTestId('button-with-analytics')));

				expectEventToBeFired('ui', {
					...uiExampleEvent,
					attributes: {
						...defaultPeopleAndTeamsContextBaseAttributes,
						...uiExampleEvent.attributes,
						sourceHierarchy: 'teamProfileScreen',
						consumer: 'embed',
					},
					source: 'teamProfileScreen',
				});
			});

			it('should have the lowest level context prioritised in the payload when nested peopleTeams contexts are provided', async () => {
				const { user, expectEventToBeFired } = renderWithAnalyticsListener(
					<TeamsAppAnalyticsContext
						data={{
							source: 'teamProfileScreen',
							attributes: { consumer: 'embed' },
						}}
					>
						<TeamsAppAnalyticsContext
							data={{
								source: 'teamProfileScreen',
								attributes: { consumer: 'preview-panel' },
							}}
						>
							<ButtonWithAnalytics eventType="ui" />
						</TeamsAppAnalyticsContext>
					</TeamsAppAnalyticsContext>,
					{ mockClient },
				);
				await act(() => user.click(screen.getByTestId('button-with-analytics')));

				expectEventToBeFired('ui', {
					...uiExampleEvent,
					attributes: {
						...defaultPeopleAndTeamsContextBaseAttributes,
						...uiExampleEvent.attributes,
						sourceHierarchy: `${'teamProfileScreen'}.${'teamProfileScreen'}`,
						consumer: 'preview-panel',
					},
					source: 'teamProfileScreen',
				});
			});

			it('should prioritise the analytics event payload above all other contexts', async () => {
				const { user, expectEventToBeFired } = renderWithAnalyticsListener(
					<TeamsAppAnalyticsContext
						data={{
							source: 'teamProfileScreen',
							attributes: { consumer: 'embed' },
						}}
					>
						<TeamsAppAnalyticsContext
							data={{
								source: 'teamProfileScreen',
								attributes: { consumer: 'preview-panel', testAttribute: 'will-not-be-prioritised' },
							}}
						>
							<ButtonWithAnalytics eventType="ui" />
						</TeamsAppAnalyticsContext>
					</TeamsAppAnalyticsContext>,
					{ mockClient },
				);
				await act(() => user.click(screen.getByTestId('button-with-analytics')));

				expectEventToBeFired('ui', {
					...uiExampleEvent,
					attributes: {
						...defaultPeopleAndTeamsContextBaseAttributes,
						...uiExampleEvent.attributes,
						sourceHierarchy: `${'teamProfileScreen'}.${'teamProfileScreen'}`,
						consumer: 'preview-panel',
						testAttribute: 'testValue',
					},
					source: 'teamProfileScreen',
				});
			});
		});

		describe('Generic AnalyticsContext Provided', () => {
			it('should not append AnalyticsContext attributes to peopleTeams events', async () => {
				const { user, expectEventToBeFired } = renderWithAnalyticsListener(
					<TeamsAppAnalyticsContext data={{ source: 'teamProfileScreen' }}>
						<AnalyticsContext
							data={{
								source: 'userProfileScreen',
								attributes: { consumer: 'irrelevant', genericAttribute: 'irrelevant' },
							}}
						>
							<ButtonWithAnalytics eventType="ui" />
						</AnalyticsContext>
					</TeamsAppAnalyticsContext>,
					{ mockClient },
				);
				await act(() => user.click(screen.getByTestId('button-with-analytics')));

				expectEventToBeFired('ui', {
					...uiExampleEvent,
					attributes: {
						...defaultPeopleAndTeamsContextBaseAttributes,
						...uiExampleEvent.attributes,
						sourceHierarchy: 'teamProfileScreen.userProfileScreen',
					},
					source: 'userProfileScreen',
				});
			});

			it('should override peopleTeams source when a lower level AnalyticsContext is provided', async () => {
				const { user, expectEventToBeFired } = renderWithAnalyticsListener(
					<TeamsAppAnalyticsContext data={{ source: 'teamProfileScreen' }}>
						<AnalyticsContext
							data={{
								source: 'userProfileScreen',
								attributes: { consumer: 'irrelevant', genericAttribute: 'irrelevant' },
							}}
						>
							<ButtonWithAnalytics eventType="ui" />
						</AnalyticsContext>
					</TeamsAppAnalyticsContext>,
					{ mockClient },
				);
				await act(() => user.click(screen.getByTestId('button-with-analytics')));

				expectEventToBeFired('ui', {
					...uiExampleEvent,
					attributes: {
						...defaultPeopleAndTeamsContextBaseAttributes,
						...uiExampleEvent.attributes,
						sourceHierarchy: 'teamProfileScreen.userProfileScreen',
					},
					source: 'userProfileScreen',
				});
			});
		});

		describe('PeopleTeamsAnalyticsContext provided with different event types', () => {
			it('should fire UI events with the correct payload', async () => {
				const { user, expectEventToBeFired } = renderWithAnalyticsListener(
					<TeamsAppAnalyticsContext
						data={{
							source: 'teamProfileScreen',
							attributes: { consumer: 'embed' },
						}}
					>
						<TeamsAppAnalyticsContext
							data={{
								source: 'teamProfileScreen',
								attributes: { consumer: 'preview-panel', testAttribute: 'will-not-be-prioritised' },
							}}
						>
							<ButtonWithAnalytics eventType="ui" />
						</TeamsAppAnalyticsContext>
					</TeamsAppAnalyticsContext>,
					{ mockClient },
				);
				await act(() => user.click(screen.getByTestId('button-with-analytics')));

				expectEventToBeFired('ui', {
					...uiExampleEvent,
					attributes: {
						...defaultPeopleAndTeamsContextBaseAttributes,
						...uiExampleEvent.attributes,
						sourceHierarchy: 'teamProfileScreen.teamProfileScreen',
						consumer: 'preview-panel',
						testAttribute: 'testValue',
					},
					source: 'teamProfileScreen',
				});
			});
			it('should fire track events with the correct payload', async () => {
				const { user, expectEventToBeFired } = renderWithAnalyticsListener(
					<TeamsAppAnalyticsContext
						data={{
							source: 'teamProfileScreen',
							attributes: { consumer: 'embed' },
						}}
					>
						<TeamsAppAnalyticsContext
							data={{
								source: 'teamProfileScreen',
								attributes: { consumer: 'preview-panel', testAttribute: 'will-not-be-prioritised' },
							}}
						>
							<ButtonWithAnalytics eventType="track" />
						</TeamsAppAnalyticsContext>
					</TeamsAppAnalyticsContext>,
					{ mockClient },
				);
				await act(() => user.click(screen.getByTestId('button-with-analytics')));

				expectEventToBeFired('track', {
					...trackExampleEvent,
					attributes: {
						...defaultPeopleAndTeamsContextBaseAttributes,
						...trackExampleEvent.attributes,
						sourceHierarchy: 'teamProfileScreen.teamProfileScreen',
						consumer: 'preview-panel',
						testAttribute: 'testValue',
					},
					source: 'teamProfileScreen',
				});
			});
			it('should fire screen events with the correct payload', async () => {
				const { user, expectEventToBeFired } = renderWithAnalyticsListener(
					<TeamsAppAnalyticsContext
						data={{
							source: 'teamProfileScreen',
							attributes: { consumer: 'embed' },
						}}
					>
						<TeamsAppAnalyticsContext
							data={{
								source: 'teamProfileScreen',
								attributes: { consumer: 'preview-panel', testAttribute: 'will-not-be-prioritised' },
							}}
						>
							<ButtonWithAnalytics eventType="screen" />
						</TeamsAppAnalyticsContext>
					</TeamsAppAnalyticsContext>,
					{ mockClient },
				);
				await act(() => user.click(screen.getByTestId('button-with-analytics')));

				expectEventToBeFired('screen', {
					...screenExampleEvent,
					attributes: {
						...defaultPeopleAndTeamsContextBaseAttributes,
						...screenExampleEvent.attributes,
						sourceHierarchy: 'teamProfileScreen.teamProfileScreen',
						consumer: 'preview-panel',
						testAttribute: 'testValue',
					},
					tags: ['peopleTeams'],
				});
			});
			it('should fire operational events with the correct payload', async () => {
				const { user, expectEventToBeFired } = renderWithAnalyticsListener(
					<TeamsAppAnalyticsContext
						data={{
							source: 'teamProfileScreen',
							attributes: { consumer: 'embed' },
						}}
					>
						<TeamsAppAnalyticsContext
							data={{
								source: 'teamProfileScreen',
								attributes: { consumer: 'preview-panel', testAttribute: 'will-not-be-prioritised' },
							}}
						>
							<ButtonWithAnalytics eventType="operational" />
						</TeamsAppAnalyticsContext>
					</TeamsAppAnalyticsContext>,
					{ mockClient },
				);
				await act(() => user.click(screen.getByTestId('button-with-analytics')));

				expectEventToBeFired('operational', {
					...operationalExampleEvent,
					attributes: {
						...defaultPeopleAndTeamsContextBaseAttributes,
						...operationalExampleEvent.attributes,
						sourceHierarchy: 'teamProfileScreen.teamProfileScreen',
						consumer: 'preview-panel',
						testAttribute: 'testValue',
					},
					source: 'teamProfileScreen',
				});
			});
		});
	});
});
