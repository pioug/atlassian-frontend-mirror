import type React from 'react';
import { useCallback, useLayoutEffect, useMemo } from 'react';

import type {
	AnalyticsEventPayload,
	PluginPerformanceReportData,
} from '@atlaskit/editor-common/analytics';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import { countNodes } from '@atlaskit/editor-common/count-nodes';
import { type EditorPluginInjectionAPI } from '@atlaskit/editor-common/preset';
import { type EditorState } from '@atlaskit/editor-prosemirror/state';

import { PluginPerformanceObserver } from '../../utils/performance/plugin-performance-observer';

export const usePluginPerformanceObserver = (
	editorState: React.MutableRefObject<EditorState>,
	pluginInjectionAPI: React.MutableRefObject<EditorPluginInjectionAPI>,
	dispatchAnalyticsEvent: (payload: AnalyticsEventPayload) => void,
) => {
	const onPluginObservation = useCallback(
		(report: PluginPerformanceReportData) => {
			dispatchAnalyticsEvent({
				action: ACTION.TRANSACTION_DISPATCHED,
				actionSubject: ACTION_SUBJECT.EDITOR,
				eventType: EVENT_TYPE.OPERATIONAL,
				attributes: {
					report,
					participants:
						pluginInjectionAPI.current
							?.api()
							.collabEdit?.sharedState.currentState()
							?.participants?.size() || 1,
				},
			});
		},
		[dispatchAnalyticsEvent, pluginInjectionAPI],
	);

	const getPluginNames = useCallback(() => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return editorState.current?.plugins.map((p: any) => p.key) as string[];
	}, [editorState]);

	const pluginPerformanceObserver = useMemo(
		() =>
			new PluginPerformanceObserver((report) => onPluginObservation(report))
				.withPlugins(() => getPluginNames())
				.withNodeCounts(() =>
					editorState.current
						? countNodes(editorState.current)
						: { nodeCount: {}, extensionNodeCount: {} },
				),
		[onPluginObservation, getPluginNames, editorState],
	);

	useLayoutEffect(() => {
		return () => {
			pluginPerformanceObserver.disconnect();
		};
	}, [pluginPerformanceObserver]);
};
