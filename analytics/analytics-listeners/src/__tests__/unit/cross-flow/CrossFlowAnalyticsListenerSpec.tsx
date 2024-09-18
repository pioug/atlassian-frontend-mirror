import React from 'react';
import CrossFlowAnalyticsListener from '../../../cross-flow/CrossFlowAnalyticsListener';
import { type AnalyticsWebClient, FabricChannel } from '../../../types';
import type Logger from '../../../helpers/logger';
import { render, screen, fireEvent } from '@testing-library/react';
import { createAnalyticsContexts, createLoggerMock } from '../../_testUtils';
import { createButtonWithAnalytics } from '../../../../examples/helpers';
import { UI_EVENT_TYPE } from '@atlaskit/analytics-gas-types';

describe('CrossFlowAnalyticsListener', () => {
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

	const buttonClickedEvent = {
		action: 'clicked',
		actionSubject: 'someComponent',
		actionSubjectId: 'someComponentId',
	};
	[
		{
			description:
				'Should set namespaces to join all sources, and source is the last one from context, ' +
				'when source from original payload is undefined',
			eventPayload: {
				...buttonClickedEvent,
				eventType: UI_EVENT_TYPE,
				attributes: {
					recommendedProductIds: ['d8a847a4-cde4-4c50-8ea1-dc3d4193214f'],
				},
			},
			context: [{ source: 'navigation' }, { source: 'discoverSection' }],
			expectedEvent: {
				...buttonClickedEvent,
				source: 'discoverSection',
				tags: ['crossFlow'],
				attributes: {
					recommendedProductIds: ['d8a847a4-cde4-4c50-8ea1-dc3d4193214f'],
					namespaces: 'navigation.discoverSection',
				},
			},
		},
		{
			description:
				'Should set namespaces to join all sources, ' +
				'when source from original payload is same as the last source from context',
			eventPayload: {
				...buttonClickedEvent,
				eventType: UI_EVENT_TYPE,
				source: 'discoverSection',
				attributes: {
					recommendedProductIds: ['d8a847a4-cde4-4c50-8ea1-dc3d4193214f'],
				},
			},
			context: [{ source: 'navigation' }, { source: 'discoverSection' }],
			expectedEvent: {
				...buttonClickedEvent,
				source: 'discoverSection',
				tags: ['crossFlow'],
				attributes: {
					recommendedProductIds: ['d8a847a4-cde4-4c50-8ea1-dc3d4193214f'],
					namespaces: 'navigation.discoverSection',
				},
			},
		},
		{
			description:
				'Should set namespaces to join all sources, ' +
				'when source from original payload is different from the last source from context',
			eventPayload: {
				...buttonClickedEvent,
				eventType: UI_EVENT_TYPE,
				source: 'appRecSection',
				attributes: {
					recommendedProductIds: ['d8a847a4-cde4-4c50-8ea1-dc3d4193214f'],
				},
			},
			context: [{ source: 'navigation' }, { source: 'discoverSection' }],
			expectedEvent: {
				...buttonClickedEvent,
				source: 'appRecSection',
				tags: ['crossFlow'],
				attributes: {
					recommendedProductIds: ['d8a847a4-cde4-4c50-8ea1-dc3d4193214f'],
					namespaces: 'navigation.discoverSection.appRecSection',
				},
			},
		},
		{
			description: 'Should use attributes from context',
			eventPayload: {
				...buttonClickedEvent,
				eventType: UI_EVENT_TYPE,
				source: 'appRecSection',
				attributes: {
					recommendedProductIds: ['d8a847a4-cde4-4c50-8ea1-dc3d4193214f'],
				},
			},
			context: [
				{
					source: 'navigation',
					attributes: {
						packageVersion: '1.0.0',
						packageName: 'AtlassianSwitcher',
					},
				},
				{
					source: 'discoverSection',
					attributes: {
						isSPA: true,
						projectId: 1,
					},
				},
			],
			expectedEvent: {
				...buttonClickedEvent,
				source: 'appRecSection',
				tags: ['crossFlow'],
				attributes: {
					recommendedProductIds: ['d8a847a4-cde4-4c50-8ea1-dc3d4193214f'],
					namespaces: 'navigation.discoverSection.appRecSection',
					packageVersion: '1.0.0',
					packageName: 'AtlassianSwitcher',
					isSPA: true,
					projectId: 1,
				},
			},
		},
		{
			description: 'Should use attributes from navigation context',
			eventPayload: {
				...buttonClickedEvent,
				eventType: UI_EVENT_TYPE,
				source: 'appRecSection',
				attributes: {
					recommendedProductIds: ['d8a847a4-cde4-4c50-8ea1-dc3d4193214f'],
				},
			},
			context: [
				{
					source: 'navigation',
					navigationCtx: {
						attributes: {
							packageVersion: '1.0.0',
							packageName: 'AtlassianSwitcher',
						},
					},
				},
				{
					source: 'discoverSection',
					attributes: {
						isSPA: true,
						projectId: 1,
					},
				},
			],
			expectedEvent: {
				...buttonClickedEvent,
				source: 'appRecSection',
				tags: ['crossFlow'],
				attributes: {
					recommendedProductIds: ['d8a847a4-cde4-4c50-8ea1-dc3d4193214f'],
					namespaces: 'navigation.discoverSection.appRecSection',
					packageVersion: '1.0.0',
					packageName: 'AtlassianSwitcher',
					isSPA: true,
					projectId: 1,
				},
			},
		},
	].map((testCase) => {
		const { description, context, eventPayload, expectedEvent } = testCase;
		it(description, () => {
			const AnalyticsContexts = createAnalyticsContexts(context);
			const spy = jest.fn();
			const ButtonWithAnalytics = createButtonWithAnalytics(eventPayload, FabricChannel.crossFlow);
			render(
				<CrossFlowAnalyticsListener client={analyticsWebClientMock} logger={loggerMock}>
					<AnalyticsContexts>
						<ButtonWithAnalytics onClick={spy} />
					</AnalyticsContexts>
				</CrossFlowAnalyticsListener>,
			);

			const dummyButton = screen.getByRole('button', { name: 'Test [click on me]' });
			fireEvent.click(dummyButton);
			expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledWith(expectedEvent);
		});
	});
});
