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
import NavigationListener from '../../../navigation/NavigationListener';
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
describe('NavigationListener', () => {
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

	it('should register an Analytics listener on the navigation channel', () => {
		render(
			<NavigationListener client={analyticsWebClientMock} logger={loggerMock}>
				<div data-testid="navigation-listener" />
			</NavigationListener>,
		);

		expect(screen.getByTestId('navigation-listener')).toBeInTheDocument();
	});

	cases(
		'should transform events from analyticsListener and fire UI and Operational events to the analyticsWebClient',
		(
			{ eventPayload, clientPayload, eventType = UI_EVENT_TYPE, context = [] }: CaseArgs,
			done: Function,
		) => {
			const spy = jest.fn();
			const ButtonWithAnalytics = createButtonWithAnalytics(eventPayload, FabricChannel.navigation);
			const AnalyticsContexts = createAnalyticsContexts(context);

			render(
				<NavigationListener client={analyticsWebClientMock} logger={loggerMock}>
					<AnalyticsListener channel="navigation" onEvent={() => {}}>
						<AnalyticsContexts>
							<ButtonWithAnalytics onClick={spy} />
						</AnalyticsContexts>
					</AnalyticsListener>
				</NavigationListener>,
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
				context: [{ source: 'navigation' }],
				clientPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					attributes: {
						sourceHierarchy: 'navigation',
						componentHierarchy: undefined,
						listenerVersion: '0.0.0',
						packageHierarchy: undefined,
						packageName: undefined,
						packageVersion: undefined,
					},
					source: 'navigation',
					tags: ['navigation'],
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
					{ source: 'issuesPage' },
					{ navigationCtx: { source: 'navigationNext' } },
					{ navigationCtx: { source: 'globalNavigation' } },
					{ navigationCtx: { source: 'searchDrawer' } },
				],
				clientPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					attributes: {
						sourceHierarchy: 'issuesPage.navigationNext.globalNavigation.searchDrawer',
						packageHierarchy: undefined,
						componentHierarchy: undefined,
						listenerVersion: '0.0.0',
						packageName: undefined,
						packageVersion: undefined,
					},
					source: 'searchDrawer',
					tags: ['navigation'],
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
						navigationCtx: {
							packageName: '@atlaskit/navigation-next',
							packageVersion: '0.0.7',
						},
					},
					{
						source: 'globalNavigation',
						packageName: '@atlaskit/global-navigation',
						packageVersion: '0.0.4',
					},
				],
				clientPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					attributes: {
						sourceHierarchy: 'globalNavigation',
						packageHierarchy: '@atlaskit/navigation-next@0.0.7,@atlaskit/global-navigation@0.0.4',
						componentHierarchy: undefined,
						listenerVersion: '0.0.0',
						packageName: '@atlaskit/global-navigation',
						packageVersion: '0.0.4',
					},
					source: 'globalNavigation',
					tags: ['navigation'],
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
					{ component: 'navigationNext', source: 'navigation' },
					{ navigationCtx: { component: 'globalNavigation' } },
					{ component: 'globalItem' },
				],
				clientPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					attributes: {
						sourceHierarchy: 'navigation',
						packageHierarchy: undefined,
						componentHierarchy: 'navigationNext.globalNavigation.globalItem',
						listenerVersion: '0.0.0',
						packageName: undefined,
						packageVersion: undefined,
					},
					source: 'navigation',
					tags: ['navigation'],
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
					{ component: 'navigationNext', source: 'navigation' },
					{
						navigationCtx: {
							component: 'globalNavigation',
							attributes: { f: 'l', c: { m: 'n' } },
						},
					},
					{
						navigationCtx: {
							component: 'globalItem',
							attributes: { f: 'g', c: { h: 'i', z: 'x' } },
						},
					},
					{
						component: 'insideGlobalItem',
						attributes: { f: 'z', c: { y: 'w', v: 'u' } },
					},
				],
				clientPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					attributes: {
						sourceHierarchy: 'navigation',
						packageHierarchy: undefined,
						componentHierarchy: 'navigationNext.globalNavigation.globalItem.insideGlobalItem',
						listenerVersion: '0.0.0',
						packageName: undefined,
						packageVersion: undefined,
						a: 'b',
						c: {
							d: 'e',
							h: 'i',
							m: 'n',
							z: 'y',
						},
						f: 'g',
					},
					source: 'navigation',
					tags: ['navigation'],
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
				context: [{ component: 'navigationNext', source: 'navigation' }],
				clientPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					attributes: {
						sourceHierarchy: 'navigation',
						packageHierarchy: undefined,
						componentHierarchy: 'navigationNext',
						listenerVersion: '0.0.0',
						packageName: undefined,
						packageVersion: undefined,
					},
					source: 'navigation',
					tags: ['somethingInteresting', 'navigation'],
				},
			},
			{
				name: 'without event type',
				eventPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
				},
				context: [{ component: 'navigationNext', source: 'navigation' }],
				clientPayload: {
					action: 'someAction',
					actionSubject: 'someComponent',
					actionSubjectId: 'someComponentId',
					attributes: {
						sourceHierarchy: 'navigation',
						packageHierarchy: undefined,
						componentHierarchy: 'navigationNext',
						listenerVersion: '0.0.0',
						packageName: undefined,
						packageVersion: undefined,
					},
					source: 'navigation',
					tags: ['navigation'],
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
				context: [{ component: 'navigationNext', source: 'navigation' }],
				clientPayload: {
					action: 'initialised',
					actionSubject: 'someComponent',
					attributes: {
						sourceHierarchy: 'navigation',
						packageHierarchy: undefined,
						componentHierarchy: 'navigationNext',
						listenerVersion: '0.0.0',
						packageName: undefined,
						packageVersion: undefined,
					},
					source: 'navigation',
					tags: ['navigation'],
				},
			},
		],
	);
});
