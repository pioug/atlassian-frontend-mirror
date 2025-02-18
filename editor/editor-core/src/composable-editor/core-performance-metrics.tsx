/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useCallback, useState, useRef, Fragment, memo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import {
	ACTION_SUBJECT,
	EVENT_TYPE,
	fireAnalyticsEvent,
	type FireAnalyticsCallback,
} from '@atlaskit/editor-common/analytics';
import {
	PerformanceMetrics,
	type LatencyPercentileTargets,
	type TTVCTargets,
	type OnTTAI,
	type OnTTVC,
	type OnUserLatency,
} from '@atlaskit/editor-performance-metrics/react';
import UFOLoadHold from '@atlaskit/react-ufo/load-hold';

export const EditorUFOBridge = memo(() => {
	const [hold, setHold] = useState(true);

	const onTTAI = useCallback(() => {
		setHold(false);
	}, []);

	return (
		<Fragment>
			<UFOLoadHold name="editor-core" hold={hold} />
			<PerformanceMetrics onTTAI={onTTAI} />
		</Fragment>
	);
});

export const EditorPerformanceMetrics = memo(() => {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const [ttai, setTTAI] = useState<DOMHighResTimeStamp | null>(null);
	const [ttvc, setTTVC] = useState<TTVCTargets | null>(null);
	const [latency, setUserLatency] = useState<LatencyPercentileTargets | null>(null);
	const ttvcSentRef = useRef(false);
	const latencySentRef = useRef(false);

	const handleAnalyticsEvent: FireAnalyticsCallback = useCallback(
		(data) => {
			fireAnalyticsEvent(createAnalyticsEvent)(data);
		},
		[createAnalyticsEvent],
	);

	const onTTAI: OnTTAI = useCallback(({ idleAt }) => {
		setTTAI(idleAt);
	}, []);

	const onTTVC: OnTTVC = useCallback(({ ttvc }) => {
		setTTVC(ttvc);
	}, []);

	const onUserLatency: OnUserLatency = useCallback(({ latency }) => {
		setUserLatency(latency);
	}, []);

	useEffect(() => {
		if (!ttai || !ttvc || ttvcSentRef.current) {
			return;
		}
		ttvcSentRef.current = true;

		handleAnalyticsEvent({
			payload: {
				// @ts-expect-error Temporary data - let's not extend the public analytics enum
				action: 'ttvc',
				actionSubject: ACTION_SUBJECT.EDITOR,
				eventType: EVENT_TYPE.OPERATIONAL,
				attributes: {
					ttvc,
					ttai,
				},
			},
		});
	}, [handleAnalyticsEvent, ttai, ttvc]);

	useEffect(() => {
		if (!latency || latencySentRef.current) {
			return;
		}
		latencySentRef.current = true;

		handleAnalyticsEvent({
			payload: {
				// @ts-expect-error Temporary data - let's not extend the public analytics enum
				action: 'latency',
				actionSubject: ACTION_SUBJECT.EDITOR,
				eventType: EVENT_TYPE.OPERATIONAL,
				attributes: {
					latency,
				},
			},
		});
	}, [handleAnalyticsEvent, latency]);

	return <PerformanceMetrics onTTAI={onTTAI} onTTVC={onTTVC} onUserLatency={onUserLatency} />;
});
