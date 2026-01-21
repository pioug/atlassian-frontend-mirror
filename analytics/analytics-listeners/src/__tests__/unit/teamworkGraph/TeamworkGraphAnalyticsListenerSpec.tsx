import { DEFAULT_SOURCE, type GasPayload, UI_EVENT_TYPE } from '@atlaskit/analytics-gas-types';
import {
	AnalyticsListener,
	type AnalyticsEventPayload,
	type UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { createButtonWithAnalytics } from '../../../../examples/helpers';
import type Logger from '../../../helpers/logger';
import TeamworkGraphAnalyticsListener from '../../../teamworkGraph/TeamworkGraphAnalyticsListener';
import { type AnalyticsWebClient, FabricChannel } from '../../../types';
import { createLoggerMock } from '../../_testUtils';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('TeamworkGraphAnalyticsListener', () => {
	let analyticsWebClientMock: AnalyticsWebClient;
	let loggerMock: Logger;

	const EVENT_TYPE = UI_EVENT_TYPE;
	const SOURCE = 'teamwork-app';
	const ACTION = 'clicked';
	const ACTION_SUBJECT = 'button';
	const TEAMWORK_GRAPH_TAG = 'teamworkGraph';
	const LISTENER_VERSION = process.env._PACKAGE_VERSION_;
	const MOCK_PACKAGE = {
		TWG_QUERY_BUILDER: {
			version: '1.0.0',
			name: '@atlassian/twg-query-builder',
		},
		TWG_CORE: {
			version: '2.0.0',
			name: '@atlassian/twg-core',
		},
	};

	beforeEach(() => {
		analyticsWebClientMock = {
			sendUIEvent: jest.fn(),
			sendOperationalEvent: jest.fn(),
			sendTrackEvent: jest.fn(),
			sendScreenEvent: jest.fn(),
		};
		loggerMock = createLoggerMock();
	});

	const fireAndVerify = (
		eventPayload: GasPayload,
		expectedEvent: any,
		context?: AnalyticsEventPayload[],
	) => {
		const spy = jest.fn();
		const ButtonWithAnalytics = createButtonWithAnalytics(
			eventPayload,
			FabricChannel.teamworkGraph,
			context,
		);

		render(
			<TeamworkGraphAnalyticsListener client={analyticsWebClientMock} logger={loggerMock}>
				<AnalyticsListener channel={FabricChannel.teamworkGraph} onEvent={() => {}}>
					<ButtonWithAnalytics onClick={spy} />
				</AnalyticsListener>
			</TeamworkGraphAnalyticsListener>,
		);

		const button = screen.getByRole('button', { name: 'Test [click on me]' });
		fireEvent.click(button);

		expect(analyticsWebClientMock.sendUIEvent).toHaveBeenCalledWith(expectedEvent);
	};

	it('should register an Analytics listener on the teamworkGraph channel', () => {
		render(
			<TeamworkGraphAnalyticsListener client={analyticsWebClientMock} logger={loggerMock}>
				<div data-testid="teamwork-graph-listener" />
			</TeamworkGraphAnalyticsListener>,
		);

		expect(screen.getByTestId('teamwork-graph-listener')).toBeInTheDocument();
	});

	it('should send event with default source', () => {
		fireAndVerify(
			{
				eventType: EVENT_TYPE,
				action: ACTION,
				actionSubject: ACTION_SUBJECT,
			},
			{
				action: ACTION,
				actionSubject: ACTION_SUBJECT,
				source: DEFAULT_SOURCE,
				tags: expect.arrayContaining([TEAMWORK_GRAPH_TAG]),
				attributes: {
					listenerVersion: LISTENER_VERSION,
				},
			},
		);
	});

	it('should include non privacy safe attributes', () => {
		fireAndVerify(
			{
				eventType: EVENT_TYPE,
				action: ACTION,
				actionSubject: ACTION_SUBJECT,
				nonPrivacySafeAttributes: {
					url: 'https://atlassian.com',
				},
			},
			{
				action: ACTION,
				actionSubject: ACTION_SUBJECT,
				source: DEFAULT_SOURCE,
				tags: expect.arrayContaining([TEAMWORK_GRAPH_TAG]),
				attributes: {
					listenerVersion: LISTENER_VERSION,
				},
				nonPrivacySafeAttributes: {
					url: 'https://atlassian.com',
				},
			},
		);
	});

	it('should send event with listener version', () => {
		fireAndVerify(
			{
				eventType: EVENT_TYPE,
				action: ACTION,
				actionSubject: ACTION_SUBJECT,
			},
			{
				action: ACTION,
				actionSubject: ACTION_SUBJECT,
				source: DEFAULT_SOURCE,
				tags: expect.arrayContaining([TEAMWORK_GRAPH_TAG]),
				attributes: {
					listenerVersion: LISTENER_VERSION,
				},
			},
		);
	});

	it('should use nearest source', () => {
		fireAndVerify(
			{
				eventType: EVENT_TYPE,
				action: ACTION,
				actionSubject: ACTION_SUBJECT,
			},
			{
				action: ACTION,
				actionSubject: ACTION_SUBJECT,
				source: 'graph',
				tags: expect.arrayContaining([TEAMWORK_GRAPH_TAG]),
				attributes: {
					listenerVersion: LISTENER_VERSION,
					sourceHierarchy: `${SOURCE}.query.graph`,
				},
			},
			[
				{
					source: SOURCE, // This is the farthest
				},
				{
					source: 'query',
				},
				{
					source: 'graph', // This is the nearest
				},
			],
		);
	});

	it('should include source hierarchy from context', () => {
		const context: UIAnalyticsEvent['context'] = [
			{ source: 'source1' },
			{ source: 'source2' },
			{
				noSourceOnThisContext: '0',
			},
			{ source: 'source3' },
		];
		fireAndVerify(
			{
				eventType: EVENT_TYPE,
				action: ACTION,
				actionSubject: ACTION_SUBJECT,
			},
			{
				action: ACTION,
				actionSubject: ACTION_SUBJECT,
				source: 'source3',
				attributes: {
					listenerVersion: LISTENER_VERSION,
					sourceHierarchy: 'source1.source2.source3',
				},
				tags: expect.arrayContaining([TEAMWORK_GRAPH_TAG]),
			},
			context,
		);
	});

	it('should append teamworkGraph tag if tags are not empty', () => {
		fireAndVerify(
			{
				eventType: EVENT_TYPE,
				action: ACTION,
				actionSubject: ACTION_SUBJECT,
				tags: ['atlaskit'],
			},
			{
				action: ACTION,
				actionSubject: ACTION_SUBJECT,
				source: DEFAULT_SOURCE,
				tags: expect.arrayContaining([TEAMWORK_GRAPH_TAG]),
				attributes: {
					listenerVersion: LISTENER_VERSION,
				},
			},
		);
	});

	it('should add teamworkGraph tag to existing event tags', () => {
		fireAndVerify(
			{
				eventType: EVENT_TYPE,
				action: ACTION,
				actionSubject: ACTION_SUBJECT,
				tags: ['atlaskit'],
			},
			{
				action: ACTION,
				actionSubject: ACTION_SUBJECT,
				source: DEFAULT_SOURCE,
				tags: expect.arrayContaining([TEAMWORK_GRAPH_TAG, 'atlaskit']),
				attributes: {
					listenerVersion: LISTENER_VERSION,
				},
			},
		);
	});

	it('should de-dupe tags', () => {
		fireAndVerify(
			{
				eventType: EVENT_TYPE,
				action: ACTION,
				actionSubject: ACTION_SUBJECT,
				tags: ['atlaskit', 'atlaskit', TEAMWORK_GRAPH_TAG],
			},
			{
				action: ACTION,
				actionSubject: ACTION_SUBJECT,
				source: DEFAULT_SOURCE,
				tags: expect.arrayContaining([TEAMWORK_GRAPH_TAG, 'atlaskit']),
				attributes: {
					listenerVersion: LISTENER_VERSION,
				},
			},
		);
	});

	it('should include package hierarchy based on context data', () => {
		const context = [
			{
				packageName: MOCK_PACKAGE.TWG_CORE.name,
				packageVersion: MOCK_PACKAGE.TWG_CORE.version,
			},
			{
				packageName: MOCK_PACKAGE.TWG_QUERY_BUILDER.name,
				packageVersion: MOCK_PACKAGE.TWG_QUERY_BUILDER.version,
			},
		];
		fireAndVerify(
			{
				eventType: EVENT_TYPE,
				action: ACTION,
				actionSubject: ACTION_SUBJECT,
				tags: ['atlaskit'],
			},
			{
				source: DEFAULT_SOURCE,
				action: ACTION,
				actionSubject: ACTION_SUBJECT,
				tags: expect.arrayContaining([TEAMWORK_GRAPH_TAG, 'atlaskit']),
				attributes: {
					listenerVersion: LISTENER_VERSION,
					packageName: MOCK_PACKAGE.TWG_QUERY_BUILDER.name,
					packageVersion: MOCK_PACKAGE.TWG_QUERY_BUILDER.version,
					packageHierarchy: [
						`${MOCK_PACKAGE.TWG_CORE.name}@${MOCK_PACKAGE.TWG_CORE.version}`,
						`${MOCK_PACKAGE.TWG_QUERY_BUILDER.name}@${MOCK_PACKAGE.TWG_QUERY_BUILDER.version}`,
					].join(','),
				},
			},
			context,
		);
	});

	it('should not be able to override listenerVersion', () => {
		const context: UIAnalyticsEvent['context'] = [
			{
				attributes: {
					listenerVersion: '1.0.0',
				},
			},
		];
		fireAndVerify(
			{
				actionSubject: ACTION_SUBJECT,
				eventType: EVENT_TYPE,
			},
			{
				actionSubject: ACTION_SUBJECT,
				tags: [TEAMWORK_GRAPH_TAG],
				source: DEFAULT_SOURCE,
				attributes: {
					listenerVersion: LISTENER_VERSION,
				},
			},
			context,
		);
	});

	it('should not be able to override sourceHierarchy', () => {
		const context: UIAnalyticsEvent['context'] = [
			{
				source: SOURCE,
			},
			{
				source: 'query',
			},
			{
				attributes: {
					sourceHierarchy: 'confluence.page.comments',
				},
			},
		];
		fireAndVerify(
			{
				actionSubject: ACTION_SUBJECT,
				eventType: EVENT_TYPE,
			},
			{
				actionSubject: ACTION_SUBJECT,
				tags: [TEAMWORK_GRAPH_TAG],
				source: 'query',
				attributes: {
					listenerVersion: LISTENER_VERSION,
					sourceHierarchy: `${SOURCE}.query`,
				},
			},
			context,
		);
	});

	it('should not be able to override packageHierarchy', () => {
		const context: UIAnalyticsEvent['context'] = [
			{
				packageName: '@atlassian/twg-core',
				packageVersion: '2.0.1',
			},
			{
				packageName: '@atlassian/twg-query-builder',
				packageVersion: '1.0.1',
			},
			{
				attributes: {
					packageHierarchy: '@atlassian/editor@40.0.0',
				},
			},
		];
		fireAndVerify(
			{
				actionSubject: ACTION_SUBJECT,
				eventType: EVENT_TYPE,
			},
			{
				actionSubject: ACTION_SUBJECT,
				tags: [TEAMWORK_GRAPH_TAG],
				source: DEFAULT_SOURCE,
				attributes: {
					listenerVersion: LISTENER_VERSION,
					packageName: '@atlassian/twg-query-builder',
					packageVersion: '1.0.1',
					packageHierarchy: '@atlassian/twg-core@2.0.1,@atlassian/twg-query-builder@1.0.1',
				},
			},
			context,
		);
	});

	it('should not be able to override componentHierarchy', () => {
		const context: UIAnalyticsEvent['context'] = [
			{
				component: 'queryBuilder',
			},
			{
				component: 'filterPanel',
			},
			{
				attributes: {
					componentHierarchy: 'editor.comment',
				},
			},
		];
		fireAndVerify(
			{
				actionSubject: ACTION_SUBJECT,
				eventType: EVENT_TYPE,
			},
			{
				actionSubject: ACTION_SUBJECT,
				tags: [TEAMWORK_GRAPH_TAG],
				source: DEFAULT_SOURCE,
				attributes: {
					listenerVersion: LISTENER_VERSION,
					componentHierarchy: 'queryBuilder.filterPanel',
				},
			},
			context,
		);
	});
});
