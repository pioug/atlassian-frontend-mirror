import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import cases from 'jest-in-case';

import {
	type GasPurePayload,
	type GasPureScreenEventPayload,
	OPERATIONAL_EVENT_TYPE,
	SCREEN_EVENT_TYPE,
	TRACK_EVENT_TYPE,
	UI_EVENT_TYPE,
} from '@atlaskit/analytics-gas-types';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';

import { createButtonWithAnalytics } from '../../../../examples/helpers';
import A2UIAnalyticsListener from '../../../a2ui/A2UIAnalyticsListener';
import type Logger from '../../../helpers/logger';
import { type AnalyticsWebClient, FabricChannel } from '../../../types';
import { createAnalyticsContexts, createLoggerMock } from '../../_testUtils';

type CaseArgs = {
	clientPayload: GasPurePayload | GasPureScreenEventPayload;
	context: any[];
	eventPayload: GasPurePayload | GasPureScreenEventPayload;
	eventType?: string;
	name: string;
};

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('A2UIAnalyticsListener', () => {
	let analyticsWebClientMock: AnalyticsWebClient;
	let loggerMock: Logger;

	beforeEach(() => {
		analyticsWebClientMock = {
			sendUIEvent: jest.fn(),
			sendOperationalEvent: jest.fn(),
			sendTrackEvent: jest.fn(),
			sendScreenEvent: jest.fn(),
		};
		loggerMock = createLoggerMock();
	});

	it('should register an Analytics listener on the a2ui channel', () => {
		render(
			<A2UIAnalyticsListener client={analyticsWebClientMock} logger={loggerMock}>
				<div data-testid="a2ui-listener" />
			</A2UIAnalyticsListener>,
		);

		expect(screen.getByTestId('a2ui-listener')).toBeInTheDocument();
	});

	cases(
		'should transform A2UI events and fire them to the matching analyticsWebClient method',
		(
			{ eventPayload, clientPayload, eventType = UI_EVENT_TYPE, context = [] }: CaseArgs,
			done: Function,
		) => {
			const spy = jest.fn();
			const ButtonWithAnalytics = createButtonWithAnalytics(eventPayload, FabricChannel.a2ui);
			const AnalyticsContexts = createAnalyticsContexts(context);

			render(
				<A2UIAnalyticsListener client={analyticsWebClientMock} logger={loggerMock}>
					<AnalyticsListener channel={FabricChannel.a2ui} onEvent={() => {}}>
						<AnalyticsContexts>
							<ButtonWithAnalytics onClick={spy} />
						</AnalyticsContexts>
					</AnalyticsListener>
				</A2UIAnalyticsListener>,
			);

			fireEvent.click(screen.getByRole('button', { name: 'Test [click on me]' }));

			let mockFn: AnalyticsWebClient[keyof AnalyticsWebClient] = analyticsWebClientMock.sendUIEvent;

			if (eventType === OPERATIONAL_EVENT_TYPE) {
				mockFn = analyticsWebClientMock.sendOperationalEvent;
			}

			if (eventType === TRACK_EVENT_TYPE) {
				mockFn = analyticsWebClientMock.sendTrackEvent;
			}

			if (eventType === SCREEN_EVENT_TYPE) {
				mockFn = analyticsWebClientMock.sendScreenEvent;
			}

			window.setTimeout(() => {
				expect(mockFn).toHaveBeenCalledTimes(1);
				expect((mockFn as any).mock.calls[0][0]).toMatchObject(clientPayload);
				done();
			});
		},
		[
			{
				name: 'with UI event type',
				eventPayload: {
					action: 'selected',
					actionSubject: 'codeDiff',
					actionSubjectId: 'file',
					eventType: UI_EVENT_TYPE,
				},
				context: [
					{
						source: 'a2ui',
						a2ui: { attributes: { product: 'jira' } },
					},
				],
				clientPayload: {
					action: 'selected',
					actionSubject: 'codeDiff',
					actionSubjectId: 'file',
					attributes: {
						product: 'jira',
						sourceHierarchy: 'a2ui',
						componentHierarchy: undefined,
						packageHierarchy: undefined,
						packageName: undefined,
						packageVersion: undefined,
					},
					source: 'a2ui',
					tags: ['a2ui'],
				},
			},
			{
				name: 'with operational event type',
				eventType: OPERATIONAL_EVENT_TYPE,
				eventPayload: {
					action: 'failed',
					actionSubject: 'codeDiff',
					actionSubjectId: 'diffRender',
					eventType: OPERATIONAL_EVENT_TYPE,
				},
				context: [{ source: 'a2ui' }],
				clientPayload: {
					action: 'failed',
					actionSubject: 'codeDiff',
					actionSubjectId: 'diffRender',
					attributes: {
						sourceHierarchy: 'a2ui',
						componentHierarchy: undefined,
						packageHierarchy: undefined,
						packageName: undefined,
						packageVersion: undefined,
					},
					source: 'a2ui',
					tags: ['a2ui'],
				},
			},
			{
				name: 'with track event type',
				eventType: TRACK_EVENT_TYPE,
				eventPayload: {
					action: 'submitted',
					actionSubject: 'codeDiff',
					actionSubjectId: 'selectedLinesFeedback',
					eventType: TRACK_EVENT_TYPE,
				},
				context: [{ source: 'a2ui' }],
				clientPayload: {
					action: 'submitted',
					actionSubject: 'codeDiff',
					actionSubjectId: 'selectedLinesFeedback',
					attributes: {
						sourceHierarchy: 'a2ui',
						componentHierarchy: undefined,
						packageHierarchy: undefined,
						packageName: undefined,
						packageVersion: undefined,
					},
					source: 'a2ui',
					tags: ['a2ui'],
				},
			},
			{
				name: 'with screen event type',
				eventType: SCREEN_EVENT_TYPE,
				eventPayload: {
					eventType: SCREEN_EVENT_TYPE,
					name: 'codeDiffFullScreenView',
				},
				context: [{ source: 'a2ui' }],
				clientPayload: {
					name: 'codeDiffFullScreenView',
					attributes: {
						sourceHierarchy: 'a2ui',
						componentHierarchy: undefined,
						packageHierarchy: undefined,
						packageName: undefined,
						packageVersion: undefined,
					},
					tags: ['a2ui'],
				},
			},
		],
	);
});
