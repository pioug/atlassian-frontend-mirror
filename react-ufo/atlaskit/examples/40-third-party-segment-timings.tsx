/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useRef, useState } from 'react';

import { css, jsx } from '@compiled/react';

import UFOLoadHold from '@atlaskit/react-ufo/load-hold';
import UFOSegment, {
	UFOThirdPartySegment,
	type IframeSegmentEvent,
} from '@atlaskit/react-ufo/segment';

const containerStyle = css({
	display: 'flex',
	flexDirection: 'column',
	gap: '20px',
	padding: '20px',
	fontFamily: 'Arial, sans-serif',
});

const sectionStyle = css({
	borderColor: '#dddddd',
	borderStyle: 'solid',
	borderWidth: '2px',
	borderRadius: '8px',
	padding: '20px',
	backgroundColor: '#f9f9f9',
});

export default function Example(): JSX.Element {
	const listenersRef = useRef<Set<(event: IframeSegmentEvent) => void>>(new Set());
	const [isContentLoading, setIsContentLoading] = useState(true);

	const onRegisterIframeEventListener = useCallback(
		(listener: (event: IframeSegmentEvent) => void) => {
			listenersRef.current.add(listener);

			// Simulate the event sequence from Forge UI's PerformanceAnalyticsContext (validated timeline).
			// Events must have type='ufo-event' and name starting with 'ufo-forge-' to be processed.
			// A 'navigation-timing' event releases the forge-ui-requests UFO hold.
			const timer = setTimeout(() => {
				const emit = (event: IframeSegmentEvent) => {
					listenersRef.current.forEach((l) => l(event));
				};

				// ufo-forge-init is the early handshake signal — confirms the iframe is on the new
				// rollout cohort and extends the abort window from 6s to 60s.
				emit({
					type: 'ufo-event',
					name: 'ufo-forge-init',
					elapsed: performance.now(),
				});

				// navigation-timing releases the forge-ui-requests hold and is recorded as a segment3pTimings row.
				// Uses the real Forge iframe event structure: { name, elapsed, payload: { name, startTime,
				// duration, type, redirectCount, timing: { fetchStart, responseStart, responseEnd, ... } } }
				emit({
					type: 'ufo-event',
					name: 'ufo-forge-navigation-timing',
					elapsed: performance.now(),
					payload: {
						name: 'https://forge.example.com/iframe',
						startTime: 0,
						duration: 300,
						type: 'navigate',
						redirectCount: 0,
						timing: {
							fetchStart: 10,
							domainLookupStart: 10,
							domainLookupEnd: 20,
							connectStart: 20,
							connectEnd: 50,
							secureConnectionStart: 30,
							requestStart: 55,
							responseStart: 150,
							responseEnd: 300,
							workerStart: 0,
							redirectStart: 0,
							redirectEnd: 0,
							unloadEventStart: 0,
							unloadEventEnd: 0,
						},
					},
				});
				// paint-timing is recorded as a segment3pTimings row.
				// Uses the real Forge iframe event structure: { name, elapsed, payload: { name, startTime, duration, entryType } }
				emit({
					type: 'ufo-event',
					name: 'ufo-forge-paint-timing',
					elapsed: performance.now(),
					payload: {
						name: 'first-contentful-paint',
						startTime: 120,
						duration: 0,
						entryType: 'paint',
					},
				});

				setIsContentLoading(false);
			}, 200);

			return () => {
				listenersRef.current.delete(listener);
				clearTimeout(timer);
			};
		},
		[],
	);

	return (
		<UFOSegment name="third-party-segment-timings-example">
			{/* First-party hold that keeps the interaction alive until iframe events have been emitted.
			    Models the real-world scenario where the host app (Jira, Confluence) has its own loading
			    states active while third-party iframe performance events flow in. */}
			<UFOLoadHold name="test-content-loading" hold={isContentLoading} />
			<div css={containerStyle} data-testid="main">
				<h1>UFO Third-Party Segment timings (segment3pTimings) example</h1>
				<div css={sectionStyle}>
					<h3>UFOThirdPartySegment with onRegisterIframeEventListener</h3>
					<UFOThirdPartySegment
						name="forge-iframe-widget"
						onRegisterIframeEventListener={onRegisterIframeEventListener}
						extraData={{ appType: 'custom', name: 'forge-iframe-widget' }}
					>
						<div data-testid="iframe-content">Iframe content placeholder</div>
					</UFOThirdPartySegment>
				</div>
			</div>
		</UFOSegment>
	);
}
