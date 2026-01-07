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
import AVPAnalyticsListener from '../../../avp/AVPAnalyticsListener';
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
		render(
			<AVPAnalyticsListener client={analyticsWebClientMock} logger={loggerMock}>
				<div data-testid="avp-listener" />
			</AVPAnalyticsListener>,
		);

		const analyticsListener = screen.getByTestId('avp-listener');
		expect(analyticsListener).toBeInTheDocument();
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

			render(
				<AVPAnalyticsListener client={analyticsWebClientMock} logger={loggerMock}>
					<AnalyticsListener channel="avp" onEvent={() => {}}>
						<AnalyticsContexts>
							<ButtonWithAnalytics onClick={spy} />
						</AnalyticsContexts>
					</AnalyticsListener>
				</AVPAnalyticsListener>,
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
