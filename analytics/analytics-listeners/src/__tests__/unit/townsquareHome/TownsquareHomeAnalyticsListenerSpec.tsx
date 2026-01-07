import {
	type GasPurePayload,
	OPERATIONAL_EVENT_TYPE,
	UI_EVENT_TYPE,
	TRACK_EVENT_TYPE,
	SCREEN_EVENT_TYPE,
} from '@atlaskit/analytics-gas-types';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { render, screen, fireEvent } from '@testing-library/react';
import cases from 'jest-in-case';
import React from 'react';
import { createButtonWithAnalytics } from '../../../../examples/helpers';
import type Logger from '../../../helpers/logger';
import TownsquareHomeAnalyticsListener from '../../../townsquareHome/TownsquareHomeAnalyticsListener';
import { type AnalyticsWebClient, FabricChannel } from '../../../types';
import { createAnalyticsContexts, createLoggerMock } from '../../_testUtils';

type CaseArgs = {
	clientPayload: GasPurePayload;
	context: any[];
	eventPayload: GasPurePayload;
	eventType?: string;
	name: string;
};

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('TownsquareHomeAnalyticsListener', () => {
	const analyticsWebClientMock: AnalyticsWebClient = {
		sendUIEvent: jest.fn(),
		sendOperationalEvent: jest.fn(),
		sendTrackEvent: jest.fn(),
		sendScreenEvent: jest.fn(),
	};
	const loggerMock: Logger = createLoggerMock();

	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('should register an Analytics listener on the townsquareHome channel', () => {
		render(
			<TownsquareHomeAnalyticsListener client={analyticsWebClientMock} logger={loggerMock}>
				<div data-testid="townsquareHome-listener" />
			</TownsquareHomeAnalyticsListener>,
		);

		expect(screen.getByTestId('townsquareHome-listener')).toBeInTheDocument();
	});

	cases(
		'should transform events from analyticsListener and fire UI and Operational events to the analyticsWebClient',
		(
			{ eventPayload, clientPayload, eventType = UI_EVENT_TYPE, context = [] }: CaseArgs,
			done: Function,
		) => {
			const spy = jest.fn();
			const ButtonWithAnalytics = createButtonWithAnalytics(
				eventPayload,
				FabricChannel.townsquareHome,
			);
			const AnalyticsContexts = createAnalyticsContexts(context);

			render(
				<TownsquareHomeAnalyticsListener client={analyticsWebClientMock} logger={loggerMock}>
					<AnalyticsListener channel="townsquareHome" onEvent={() => {}}>
						<AnalyticsContexts>
							<ButtonWithAnalytics onClick={spy} />
						</AnalyticsContexts>
					</AnalyticsListener>
				</TownsquareHomeAnalyticsListener>,
			);

			const dummyButton = screen.getByRole('button', { name: 'Test [click on me]' });
			fireEvent.click(dummyButton);

			let mockFn = analyticsWebClientMock.sendUIEvent;

			if (eventType === OPERATIONAL_EVENT_TYPE) {
				mockFn = analyticsWebClientMock.sendOperationalEvent;
			}

			if (eventType === TRACK_EVENT_TYPE) {
				mockFn = analyticsWebClientMock.sendTrackEvent;
			}

			if (eventType === SCREEN_EVENT_TYPE) {
				analyticsWebClientMock.sendScreenEvent;
			}

			window.setTimeout(() => {
				expect((mockFn as any).mock.calls[0][0]).toMatchObject(clientPayload);
				done();
			});
		},
		[
			{
				name: 'basic',
				eventPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					eventType: UI_EVENT_TYPE,
				},
				context: [{ source: 'townsquareHome' }],
				clientPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					attributes: {
						sourceHierarchy: 'townsquareHome',
						componentHierarchy: undefined,
						packageHierarchy: undefined,
						packageName: undefined,
						packageVersion: undefined,
					},
					source: 'townsquareHome',
					tags: ['townsquare', 'townsquareHome'],
				},
			},
			{
				name: 'withSources',
				eventPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					eventType: UI_EVENT_TYPE,
				},
				context: [
					{ source: 'firstSource' },
					{ townsquareHomeCtx: { source: 'secondSource' } },
					{ townsquareHomeCtx: { source: 'thirdSource' } },
				],
				clientPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					attributes: {
						sourceHierarchy: 'firstSource.secondSource.thirdSource',
						packageHierarchy: undefined,
						componentHierarchy: undefined,
						packageName: undefined,
						packageVersion: undefined,
					},
					source: 'thirdSource',
					tags: ['townsquare', 'townsquareHome'],
				},
			},
			{
				name: 'withPackageInfo',
				eventPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					eventType: UI_EVENT_TYPE,
				},
				context: [
					{
						townsquareHomeCtx: {
							packageName: '@townsquare/feeds',
							packageVersion: '0.0.1',
						},
					},
					{
						source: 'starred-list',
						packageName: '@townsquare/starred-list',
						packageVersion: '0.0.4',
					},
				],
				clientPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					attributes: {
						sourceHierarchy: 'starred-list',
						packageHierarchy: '@townsquare/feeds@0.0.1,@townsquare/starred-list@0.0.4',
						componentHierarchy: undefined,
						packageName: '@townsquare/starred-list',
						packageVersion: '0.0.4',
					},
					source: 'starred-list',
					tags: ['townsquare', 'townsquareHome'],
				},
			},
			{
				name: 'withComponentInfo',
				eventPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					eventType: UI_EVENT_TYPE,
				},
				context: [
					{ component: 'feeds', source: 'home' },
					{ townsquareHomeCtx: { component: 'starred-feed' } },
					{ component: 'starred-feed' },
				],
				clientPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					attributes: {
						sourceHierarchy: 'home',
						packageHierarchy: undefined,
						componentHierarchy: 'feeds.starred-feed.starred-feed',
						packageName: undefined,
						packageVersion: undefined,
					},
					source: 'home',
					tags: ['townsquare', 'townsquareHome'],
				},
			},
			{
				name: 'extraAttributesViaContext',
				eventPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					attributes: {
						a: 'b',
						c: {
							d: 'e',
							z: 'y',
						},
					},
					eventType: UI_EVENT_TYPE,
				},
				context: [
					{ component: 'feeds', source: 'home' },
					{
						townsquareHomeCtx: {
							component: 'starred-feed',
							attributes: { f: 'l', c: { m: 'n' } },
						},
					},
					{
						component: 'insideStarred',
						attributes: { f: 'z', c: { y: 'w', v: 'u' } },
					},
				],
				clientPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					attributes: {
						sourceHierarchy: 'home',
						packageHierarchy: undefined,
						componentHierarchy: 'feeds.starred-feed.insideStarred',
						packageName: undefined,
						packageVersion: undefined,
						a: 'b',
						c: {
							d: 'e',
							m: 'n',
						},
					},
					source: 'home',
					tags: ['townsquare', 'townsquareHome'],
				},
			},
			{
				name: 'tags',
				eventPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					tags: ['somethingInteresting'],
					eventType: UI_EVENT_TYPE,
				},
				context: [{ component: 'feeds', source: 'home' }],
				clientPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					attributes: {
						sourceHierarchy: 'home',
						packageHierarchy: undefined,
						componentHierarchy: 'feeds',
						packageName: undefined,
						packageVersion: undefined,
					},
					source: 'home',
					tags: ['somethingInteresting', 'townsquare', 'townsquareHome'],
				},
			},
			{
				name: 'without event type',
				eventPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
				},
				context: [{ component: 'feeds', source: 'home' }],
				clientPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					attributes: {
						sourceHierarchy: 'home',
						packageHierarchy: undefined,
						componentHierarchy: 'feeds',
						packageName: undefined,
						packageVersion: undefined,
					},
					source: 'home',
					tags: ['townsquare', 'townsquareHome'],
				},
			},

			{
				name: 'with operational event type',
				eventType: OPERATIONAL_EVENT_TYPE,
				eventPayload: {
					action: 'initialised',
					actionSubject: 'someComponent',
					eventType: OPERATIONAL_EVENT_TYPE,
				},
				context: [{ component: 'feeds', source: 'home' }],
				clientPayload: {
					action: 'initialised',
					actionSubject: 'someComponent',
					attributes: {
						sourceHierarchy: 'home',
						packageHierarchy: undefined,
						componentHierarchy: 'feeds',
						packageName: undefined,
						packageVersion: undefined,
					},
					source: 'home',
					tags: ['townsquare', 'townsquareHome'],
				},
			},
			{
				name: 'with track event type',
				eventType: TRACK_EVENT_TYPE,
				eventPayload: {
					action: 'requested',
					actionSubject: 'someComponent',
					eventType: TRACK_EVENT_TYPE,
				},
				context: [{ component: 'feeds', source: 'home' }],
				clientPayload: {
					action: 'requested',
					actionSubject: 'someComponent',
					attributes: {
						sourceHierarchy: 'home',
						packageHierarchy: undefined,
						componentHierarchy: 'feeds',
						packageName: undefined,
						packageVersion: undefined,
					},
					source: 'home',
					tags: ['townsquare', 'townsquareHome'],
				},
			},
		],
	);
});
