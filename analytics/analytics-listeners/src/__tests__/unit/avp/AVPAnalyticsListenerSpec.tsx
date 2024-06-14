import {
	type GasPurePayload,
	OPERATIONAL_EVENT_TYPE,
	UI_EVENT_TYPE,
	TRACK_EVENT_TYPE,
	SCREEN_EVENT_TYPE,
} from '@atlaskit/analytics-gas-types';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { mount } from 'enzyme';
import cases from 'jest-in-case';
import React from 'react';
import { createButtonWithAnalytics } from '../../../../examples/helpers';
import type Logger from '../../../helpers/logger';
import AVPAnalyticsListener from '../../../avp/AVPAnalyticsListener';
import { type AnalyticsWebClient, FabricChannel } from '../../../types';
import { createAnalyticsContexts, createLoggerMock } from '../../_testUtils';

type CaseArgs = {
	name: string;
	eventPayload: GasPurePayload;
	clientPayload: GasPurePayload;
	eventType?: string;
	context: any[];
};

describe('AVPAnalyticsListener', () => {
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

	it('should register an Analytics listener on the avp channel', () => {
		const component = mount(
			<AVPAnalyticsListener client={analyticsWebClientMock} logger={loggerMock}>
				<div />
			</AVPAnalyticsListener>,
		);

		const analyticsListener = component.find(AnalyticsListener);
		expect(analyticsListener.props()).toHaveProperty('channel', 'avp');
	});

	cases(
		'should transform events from analyticsListener and fire UI and Operational events to the analyticsWebClient',
		(
			{ eventPayload, clientPayload, eventType = UI_EVENT_TYPE, context = [] }: CaseArgs,
			done: Function,
		) => {
			const spy = jest.fn();
			const ButtonWithAnalytics = createButtonWithAnalytics(eventPayload, FabricChannel.avp);
			const AnalyticsContexts = createAnalyticsContexts(context);

			const component = mount(
				<AVPAnalyticsListener client={analyticsWebClientMock} logger={loggerMock}>
					<AnalyticsContexts>
						<ButtonWithAnalytics onClick={spy} />
					</AnalyticsContexts>
				</AVPAnalyticsListener>,
			);

			component.find(ButtonWithAnalytics).simulate('click');

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
				context: [{ source: 'avp' }],
				clientPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					attributes: {
						sourceHierarchy: 'avp',
						componentHierarchy: undefined,
						packageHierarchy: undefined,
						packageName: undefined,
						packageVersion: undefined,
					},
					source: 'avp',
					tags: ['avp'],
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
				context: [{ component: 'avpNext', source: 'avp' }],
				clientPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					attributes: {
						sourceHierarchy: 'avp',
						packageHierarchy: undefined,
						componentHierarchy: 'avpNext',
						packageName: undefined,
						packageVersion: undefined,
					},
					source: 'avp',
					tags: ['somethingInteresting', 'avp'],
				},
			},
			{
				name: 'without event type',
				eventPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
				},
				context: [{ component: 'avpNext', source: 'avp' }],
				clientPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					attributes: {
						sourceHierarchy: 'avp',
						packageHierarchy: undefined,
						componentHierarchy: 'avpNext',
						packageName: undefined,
						packageVersion: undefined,
					},
					source: 'avp',
					tags: ['avp'],
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
				context: [{ component: 'avpNext', source: 'avp' }],
				clientPayload: {
					action: 'initialised',
					actionSubject: 'someComponent',
					attributes: {
						sourceHierarchy: 'avp',
						packageHierarchy: undefined,
						componentHierarchy: 'avpNext',
						packageName: undefined,
						packageVersion: undefined,
					},
					source: 'avp',
					tags: ['avp'],
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
				context: [{ component: 'avpNext', source: 'avp' }],
				clientPayload: {
					action: 'requested',
					actionSubject: 'someComponent',
					attributes: {
						sourceHierarchy: 'avp',
						packageHierarchy: undefined,
						componentHierarchy: 'avpNext',
						packageName: undefined,
						packageVersion: undefined,
					},
					source: 'avp',
					tags: ['avp'],
				},
			},
		],
	);
});
