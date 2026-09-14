import React from 'react';

import { act, screen } from '@testing-library/react';

import type { EventType } from '@atlaskit/analytics-gas-types';
import AnalyticsContext from '@atlaskit/analytics-next/AnalyticsContext';
import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import withAnalyticsEvents, {
	type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next/withAnalyticsEvents';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import Button from '@atlaskit/button/default/button';
import {
	createMockAnalyticsClient,
	renderWithAnalyticsListener,
} from '@atlassian/ptc-test-utils/analytics';

import { EVENT_CHANNEL } from '../src/common/utils/constants';
import { useAnalyticsEvents as usePTCAnalyticsEvents } from '../src/common/utils/generated/use-analytics-events';
import {
	defaultAnalyticsContextData as defaultPeopleAndTeamsContextBaseAttributes,
	TeamsAppAnalyticsContext,
} from '../src/ui/analytics-context';

const uiExampleEvent = {
	action: 'clicked',
	actionSubject: 'button',
	actionSubjectId: 'analyticsExample',
	attributes: {
		testAttribute: 'testValue',
	},
};

const operationalExampleEvent = {
	action: 'fired',
	actionSubject: 'automation',
	actionSubjectId: 'analyticsExample',
	attributes: {
		testAttribute: 'testValue',
	},
};

const trackExampleEvent = {
	action: 'triggered',
	actionSubject: 'automation',
	actionSubjectId: 'analyticsExample',
	attributes: {
		testAttribute: 'testValue',
	},
};

const screenExampleEvent = {
	name: 'analyticsExampleScreen',
	attributes: {
		testAttribute: 'testValue',
	},
};

type ButtonProps = {
	eventType: EventType;
};

function fireAnalyticsEvent(
	createAnalyticsEvent: CreateUIAnalyticsEvent | undefined,
	eventType: string,
	body: Record<string, unknown>,
) {
	if (!createAnalyticsEvent) {
		return;
	}
	createAnalyticsEvent({ eventType, ...body }).fire(EVENT_CHANNEL);
}

function getEventPayload(eventType: EventType) {
	switch (eventType) {
		case 'operational':
			return { eventType: 'operational', ...operationalExampleEvent };
		case 'track':
			return { eventType: 'track', ...trackExampleEvent };
		case 'screen':
			return { eventType: 'screen', ...screenExampleEvent };
		case 'ui':
		default:
			return { eventType: 'ui', ...uiExampleEvent };
	}
}

function ButtonWithPTCHookAnalytics({ eventType }: ButtonProps) {
	const { fireEvent } = usePTCAnalyticsEvents();
	const onClick = () => {
		switch (eventType) {
			case 'operational':
				fireEvent('operational.automation.fired.analyticsExample', { testAttribute: 'testValue' });
				break;
			case 'track':
				fireEvent('track.automation.triggered.analyticsExample', { testAttribute: 'testValue' });
				break;
			case 'screen':
				fireEvent('screen.analyticsExampleScreen.viewed', { testAttribute: 'testValue' });
				break;
			case 'ui':
			default:
				fireEvent('ui.button.clicked.analyticsExample', { testAttribute: 'testValue' });
				break;
		}
	};
	return (
		<Button onClick={onClick} testId="button-with-analytics">
			{`Fire ${eventType} Analytics Event`}
		</Button>
	);
}

function ButtonWithNextHookAnalytics({ eventType }: ButtonProps) {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const onClick = () => {
		const payload = getEventPayload(eventType);
		fireAnalyticsEvent(createAnalyticsEvent, payload.eventType, payload);
	};
	return (
		<Button onClick={onClick} testId="button-with-analytics">
			{`Fire ${eventType} Analytics Event`}
		</Button>
	);
}

const ButtonWithNextHOCAnalytics = withAnalyticsEvents()(({
	eventType,
	createAnalyticsEvent,
}: ButtonProps & WithAnalyticsEventsProps) => {
	const onClick = () => {
		const payload = getEventPayload(eventType);
		fireAnalyticsEvent(createAnalyticsEvent, payload.eventType, payload);
	};
	return (
		<Button onClick={onClick} testId="button-with-analytics">
			{`Fire ${eventType} Analytics Event`}
		</Button>
	);
});

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
