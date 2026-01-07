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
import RovoExtensionAnalyticsListener from '../../../rovoExtension/RovoExtensionAnalyticsListener';
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
describe('RovoExtensionAnalyticsListener', () => {
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

	it('should register an Analytics listener on the rovoExtension channel', () => {
		render(
			<RovoExtensionAnalyticsListener client={analyticsWebClientMock} logger={loggerMock}>
				<div data-testid="rovo-extension-listener" />
			</RovoExtensionAnalyticsListener>,
		);

		expect(screen.getByTestId('rovo-extension-listener')).toBeInTheDocument();
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
				FabricChannel.rovoExtension,
			);
			const AnalyticsContexts = createAnalyticsContexts(context);

			render(
				<RovoExtensionAnalyticsListener client={analyticsWebClientMock} logger={loggerMock}>
					<AnalyticsListener channel="rovoExtension" onEvent={() => {}}>
						<AnalyticsContexts>
							<ButtonWithAnalytics onClick={spy} />
						</AnalyticsContexts>
					</AnalyticsListener>
				</RovoExtensionAnalyticsListener>,
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
				context: [{ source: 'rovoExtension' }],
				clientPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					attributes: {
						sourceHierarchy: 'rovoExtension',
						componentHierarchy: undefined,
						packageHierarchy: undefined,
						packageName: undefined,
						packageVersion: undefined,
					},
					source: 'rovoExtension',
					tags: ['rovoExtension'],
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
					{ rovoExtensionCtx: { source: 'secondSource' } },
					{ rovoExtensionCtx: { source: 'thirdSource' } },
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
					tags: ['rovoExtension'],
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
						rovoExtensionCtx: {
							packageName: '@rovo/extension',
							packageVersion: '0.0.1',
						},
					},
					{
						source: 'search-results',
						packageName: '@rovo/search-results',
						packageVersion: '0.0.4',
					},
				],
				clientPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					attributes: {
						sourceHierarchy: 'search-results',
						packageHierarchy: '@rovo/extension@0.0.1,@rovo/search-results@0.0.4',
						componentHierarchy: undefined,
						packageName: '@rovo/search-results',
						packageVersion: '0.0.4',
					},
					source: 'search-results',
					tags: ['rovoExtension'],
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
					{ component: 'searchPanel', source: 'home' },
					{ rovoExtensionCtx: { component: 'search-results' } },
					{ component: 'result-item' },
				],
				clientPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					attributes: {
						sourceHierarchy: 'home',
						packageHierarchy: undefined,
						componentHierarchy: 'searchPanel.search-results.result-item',
						packageName: undefined,
						packageVersion: undefined,
					},
					source: 'home',
					tags: ['rovoExtension'],
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
					{ component: 'searchPanel', source: 'home' },
					{
						rovoExtensionCtx: {
							component: 'search-results',
							attributes: { f: 'l', c: { m: 'n' } },
						},
					},
					{
						component: 'result-item',
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
						componentHierarchy: 'searchPanel.search-results.result-item',
						packageName: undefined,
						packageVersion: undefined,
						a: 'b',
						c: {
							d: 'e',
							m: 'n',
						},
					},
					source: 'home',
					tags: ['rovoExtension'],
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
				context: [{ component: 'searchPanel', source: 'home' }],
				clientPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					attributes: {
						sourceHierarchy: 'home',
						packageHierarchy: undefined,
						componentHierarchy: 'searchPanel',
						packageName: undefined,
						packageVersion: undefined,
					},
					source: 'home',
					tags: ['somethingInteresting', 'rovoExtension'],
				},
			},
			{
				name: 'without event type',
				eventPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
				},
				context: [{ component: 'searchPanel', source: 'home' }],
				clientPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					attributes: {
						sourceHierarchy: 'home',
						packageHierarchy: undefined,
						componentHierarchy: 'searchPanel',
						packageName: undefined,
						packageVersion: undefined,
					},
					source: 'home',
					tags: ['rovoExtension'],
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
				context: [{ component: 'searchPanel', source: 'home' }],
				clientPayload: {
					action: 'initialised',
					actionSubject: 'someComponent',
					attributes: {
						sourceHierarchy: 'home',
						packageHierarchy: undefined,
						componentHierarchy: 'searchPanel',
						packageName: undefined,
						packageVersion: undefined,
					},
					source: 'home',
					tags: ['rovoExtension'],
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
				context: [{ component: 'searchPanel', source: 'home' }],
				clientPayload: {
					action: 'requested',
					actionSubject: 'someComponent',
					attributes: {
						sourceHierarchy: 'home',
						packageHierarchy: undefined,
						componentHierarchy: 'searchPanel',
						packageName: undefined,
						packageVersion: undefined,
					},
					source: 'home',
					tags: ['rovoExtension'],
				},
			},
		],
	);
});
