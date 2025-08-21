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
import PostOfficeAnalyticsListener from '../../../postOffice/PostOfficeAnalyticsListener';
import { type AnalyticsWebClient, FabricChannel } from '../../../types';
import { createAnalyticsContexts, createLoggerMock } from '../../_testUtils';

type CaseArgs = {
	clientPayload: GasPurePayload;
	context: any[];
	eventPayload: GasPurePayload;
	eventType?: string;
	name: string;
};

describe('PostOfficeAnalyticsListener', () => {
	const analyticsWebClientMock: jest.Mocked<AnalyticsWebClient> = {
		sendUIEvent: jest.fn(),
		sendOperationalEvent: jest.fn(),
		sendTrackEvent: jest.fn(),
		sendScreenEvent: jest.fn(),
	};
	const loggerMock: Logger = createLoggerMock();

	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('should register an Analytics listener on the postOffice channel', () => {
		render(
			<PostOfficeAnalyticsListener client={analyticsWebClientMock} logger={loggerMock}>
				<div data-testid="postOffice-listener" />
			</PostOfficeAnalyticsListener>,
		);

		expect(screen.getByTestId('postOffice-listener')).toBeInTheDocument();
	});

	cases(
		'should transform events from analyticsListener and fire UI, Operational, Track and Screen events to the analyticsWebClient',
		(
			{ eventPayload, clientPayload, eventType = UI_EVENT_TYPE, context = [] }: CaseArgs,
			done: Function,
		) => {
			const spy = jest.fn();
			const ButtonWithAnalytics = createButtonWithAnalytics(eventPayload, FabricChannel.postOffice);
			const AnalyticsContexts = createAnalyticsContexts(context);

			render(
				<PostOfficeAnalyticsListener client={analyticsWebClientMock} logger={loggerMock}>
					<AnalyticsListener channel="postOffice" onEvent={() => {}}>
						<AnalyticsContexts>
							<ButtonWithAnalytics onClick={spy} />
						</AnalyticsContexts>
					</AnalyticsListener>
				</PostOfficeAnalyticsListener>,
			);

			const dummyButton = screen.getByRole('button', { name: 'Test [click on me]' });
			fireEvent.click(dummyButton);

			const expectedMethod = (() => {
				switch (eventType) {
					case OPERATIONAL_EVENT_TYPE:
						return analyticsWebClientMock.sendOperationalEvent;
					case TRACK_EVENT_TYPE:
						return analyticsWebClientMock.sendTrackEvent;
					case SCREEN_EVENT_TYPE:
						return analyticsWebClientMock.sendScreenEvent;
					case UI_EVENT_TYPE:
					default:
						return analyticsWebClientMock.sendUIEvent;
				}
			})();

			window.setTimeout(() => {
				expect(expectedMethod).toHaveBeenCalledTimes(1);
				expect(expectedMethod).toHaveBeenCalledWith(clientPayload);
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
				context: [{ source: 'postOffice' }],
				clientPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					attributes: {
						sourceHierarchy: 'postOffice',
						componentHierarchy: undefined,
						packageHierarchy: undefined,
						packageName: undefined,
						packageVersion: undefined,
						listenerVersion: '0.0.0',
					},
					source: 'postOffice',
					tags: ['postOffice'],
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
					{ source: 'source1' },
					{ postOfficeCtx: { source: 'source2' } },
					{ postOfficeCtx: { source: 'source3' } },
					{ postOfficeCtx: { source: 'source4' } },
				],
				clientPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					attributes: {
						sourceHierarchy: 'source1.source2.source3.source4',
						packageHierarchy: undefined,
						componentHierarchy: undefined,
						packageName: undefined,
						packageVersion: undefined,
						listenerVersion: '0.0.0',
					},
					source: 'source4',
					tags: ['postOffice'],
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
						postOfficeCtx: {
							packageName: '@atlaskit/package1',
							packageVersion: '0.0.7',
						},
					},
					{
						source: 'source2',
						packageName: '@atlaskit/package2',
						packageVersion: '0.0.4',
					},
				],
				clientPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					attributes: {
						sourceHierarchy: 'source2',
						packageHierarchy: '@atlaskit/package1@0.0.7,@atlaskit/package2@0.0.4',
						componentHierarchy: undefined,
						packageName: '@atlaskit/package2',
						packageVersion: '0.0.4',
						listenerVersion: '0.0.0',
					},
					source: 'source2',
					tags: ['postOffice'],
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
					{ component: 'component1', source: 'postOffice' },
					{ postOfficeCtx: { component: 'component2' } },
					{ postOfficeCtx: { component: 'component3' } },
				],
				clientPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					attributes: {
						sourceHierarchy: 'postOffice',
						packageHierarchy: undefined,
						componentHierarchy: 'component1.component2.component3',
						packageName: undefined,
						packageVersion: undefined,
						listenerVersion: '0.0.0',
					},
					source: 'postOffice',
					tags: ['postOffice'],
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
					{ source: 'postOffice' },
					{
						postOfficeCtx: {
							attributes: { f: 'l', c: { m: 'n' } },
						},
					},
					{
						postOfficeCtx: {
							attributes: { f: 'g', c: { h: 'i', z: 'x' } },
						},
					},
					{
						attributes: { f: 'z', c: { y: 'w', v: 'u' } },
					},
				],
				clientPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					attributes: {
						sourceHierarchy: 'postOffice',
						packageHierarchy: undefined,
						componentHierarchy: undefined,
						packageName: undefined,
						packageVersion: undefined,
						listenerVersion: '0.0.0',
						a: 'b',
						c: {
							d: 'e',
							h: 'i',
							m: 'n',
							z: 'y',
						},
						f: 'g',
					},
					source: 'postOffice',
					tags: ['postOffice'],
				},
			},
			{
				name: 'tags',
				eventPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					tags: ['tag0'],
					eventType: UI_EVENT_TYPE,
				},
				context: [{ component: 'component0', source: 'postOffice' }],
				clientPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					attributes: {
						sourceHierarchy: 'postOffice',
						packageHierarchy: undefined,
						componentHierarchy: 'component0',
						packageName: undefined,
						packageVersion: undefined,
						listenerVersion: '0.0.0',
					},
					source: 'postOffice',
					tags: ['tag0', 'postOffice'],
				},
			},
			{
				name: 'without event type',
				eventPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
				},
				context: [{ component: 'component0', source: 'postOffice' }],
				clientPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					attributes: {
						sourceHierarchy: 'postOffice',
						packageHierarchy: undefined,
						componentHierarchy: 'component0',
						packageName: undefined,
						packageVersion: undefined,
						listenerVersion: '0.0.0',
					},
					source: 'postOffice',
					tags: ['postOffice'],
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
				context: [{ component: 'component0', source: 'postOffice' }],
				clientPayload: {
					action: 'initialised',
					actionSubject: 'someComponent',
					attributes: {
						sourceHierarchy: 'postOffice',
						packageHierarchy: undefined,
						componentHierarchy: 'component0',
						packageName: undefined,
						packageVersion: undefined,
						listenerVersion: '0.0.0',
					},
					source: 'postOffice',
					tags: ['postOffice'],
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
				context: [{ component: 'component0', source: 'postOffice' }],
				clientPayload: {
					action: 'requested',
					actionSubject: 'someComponent',
					attributes: {
						sourceHierarchy: 'postOffice',
						packageHierarchy: undefined,
						componentHierarchy: 'component0',
						packageName: undefined,
						packageVersion: undefined,
						listenerVersion: '0.0.0',
					},
					source: 'postOffice',
					tags: ['postOffice'],
				},
			},
			{
				name: 'with screen event type',
				eventType: SCREEN_EVENT_TYPE,
				eventPayload: {
					name: 'screen0',
					actionSubject: 'someComponent',
					eventType: SCREEN_EVENT_TYPE,
				},
				context: [{ component: 'component0', source: 'postOffice' }],
				clientPayload: {
					name: 'screen0',
					attributes: {
						sourceHierarchy: 'postOffice',
						packageHierarchy: undefined,
						componentHierarchy: 'component0',
						packageName: undefined,
						packageVersion: undefined,
						listenerVersion: '0.0.0',
					},
					tags: ['postOffice'],
				},
			},
		],
	);
});
