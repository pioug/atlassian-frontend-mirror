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
import OmniChannelAnalyticsListener from '../../../omni-channel/OmniChannelAnalyticsListener';
import { type AnalyticsWebClient, FabricChannel } from '../../../types';
import { createAnalyticsContexts, createLoggerMock } from '../../_testUtils';

type CaseArgs = {
	clientPayload: GasPurePayload;
	context: any[];
	eventPayload: GasPurePayload;
	eventType?: string;
	name: string;
};

describe('OmniChannelAnalyticsListener', () => {
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

	it('should register an Analytics listener on the omniChannel channel', () => {
		render(
			<OmniChannelAnalyticsListener client={analyticsWebClientMock} logger={loggerMock}>
				<div data-testid="omni-channel-listener" />
			</OmniChannelAnalyticsListener>,
		);

		expect(screen.getByTestId('omni-channel-listener')).toBeInTheDocument();
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
				FabricChannel.omniChannel,
			);
			const AnalyticsContexts = createAnalyticsContexts(context);

			render(
				<OmniChannelAnalyticsListener client={analyticsWebClientMock} logger={loggerMock}>
					<AnalyticsListener channel="omniChannel" onEvent={() => {}}>
						<AnalyticsContexts>
							<ButtonWithAnalytics onClick={spy} />
						</AnalyticsContexts>
					</AnalyticsListener>
				</OmniChannelAnalyticsListener>,
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
				context: [{ source: 'omniChannel' }],
				clientPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					attributes: {
						sourceHierarchy: 'omniChannel',
						componentHierarchy: undefined,
						packageHierarchy: undefined,
						packageName: undefined,
						packageVersion: undefined,
					},
					source: 'omniChannel',
					tags: ['omniChannel'],
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
				context: [{ component: 'omniChannelNext', source: 'omniChannel' }],
				clientPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					attributes: {
						sourceHierarchy: 'omniChannel',
						packageHierarchy: undefined,
						componentHierarchy: 'omniChannelNext',
						packageName: undefined,
						packageVersion: undefined,
					},
					source: 'omniChannel',
					tags: ['somethingInteresting', 'omniChannel'],
				},
			},
			{
				name: 'without event type',
				eventPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
				},
				context: [{ component: 'omniChannelNext', source: 'omniChannel' }],
				clientPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					attributes: {
						sourceHierarchy: 'omniChannel',
						packageHierarchy: undefined,
						componentHierarchy: 'omniChannelNext',
						packageName: undefined,
						packageVersion: undefined,
					},
					source: 'omniChannel',
					tags: ['omniChannel'],
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
				context: [{ component: 'omniChannelNext', source: 'omniChannel' }],
				clientPayload: {
					action: 'initialised',
					actionSubject: 'someComponent',
					attributes: {
						sourceHierarchy: 'omniChannel',
						packageHierarchy: undefined,
						componentHierarchy: 'omniChannelNext',
						packageName: undefined,
						packageVersion: undefined,
					},
					source: 'omniChannel',
					tags: ['omniChannel'],
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
				context: [{ component: 'omniChannelNext', source: 'omniChannel' }],
				clientPayload: {
					action: 'requested',
					actionSubject: 'someComponent',
					attributes: {
						sourceHierarchy: 'omniChannel',
						packageHierarchy: undefined,
						componentHierarchy: 'omniChannelNext',
						packageName: undefined,
						packageVersion: undefined,
					},
					source: 'omniChannel',
					tags: ['omniChannel'],
				},
			},
		],
	);
});
