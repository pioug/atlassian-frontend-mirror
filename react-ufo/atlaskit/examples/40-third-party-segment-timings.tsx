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
				const emitResourceTiming = ({
					name,
					initiatorType,
					startTime,
					duration,
					fetchStart,
					requestStart,
					responseStart,
					transferSize = 123,
					encodedBodySize = 100,
					decodedBodySize = 200,
				}: {
					name: string;
					initiatorType: string;
					startTime: number;
					duration: number;
					fetchStart: number;
					requestStart: number;
					responseStart: number;
					transferSize?: number;
					encodedBodySize?: number;
					decodedBodySize?: number;
				}) => {
					emit({
						type: 'ufo-event',
						name: 'ufo-forge-resource-timing',
						elapsed: performance.now(),
						payload: {
							name,
							startTime,
							duration,
							initiatorType,
							transferSize,
							encodedBodySize,
							decodedBodySize,
							timing: {
								fetchStart,
								requestStart,
								responseStart,
								workerStart: 0,
							},
						},
					});
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

				// resource-timing rows are filtered to CSS/JS assets or BE fetch/XHR calls with sanitized labels.
				emitResourceTiming({
					name: 'https://cdn.example.com/static/runtime.js?workspace=private-workspace',
					initiatorType: 'script',
					startTime: 310,
					duration: 40,
					fetchStart: 310,
					requestStart: 315,
					responseStart: 340,
				});
				emitResourceTiming({
					name: 'https://cdn.example.com/static/theme.css?theme=customer-theme',
					initiatorType: 'link',
					startTime: 360,
					duration: 30,
					fetchStart: 360,
					requestStart: 365,
					responseStart: 385,
				});
				emitResourceTiming({
					name: 'https://api.example.com/rest/api/content/123?expand=body.storage#hash',
					initiatorType: 'fetch',
					startTime: 400,
					duration: 80,
					fetchStart: 400,
					requestStart: 420,
					responseStart: 470,
				});
				emitResourceTiming({
					name: 'https://site.atlassian.net/secure/attachment/12345/Screen%20Shot%202026-06-18.jpg',
					initiatorType: 'fetch',
					startTime: 450,
					duration: 70,
					fetchStart: 450,
					requestStart: 460,
					responseStart: 510,
				});
				emitResourceTiming({
					name: 'https://site.atlassian.net/wiki/download/attachments/12345/customer-plan.pdf',
					initiatorType: 'xmlhttprequest',
					startTime: 460,
					duration: 75,
					fetchStart: 460,
					requestStart: 468,
					responseStart: 520,
				});
				emitResourceTiming({
					name: 'https://avatar-management--avatars.example.com/initials/AB-1.png',
					initiatorType: 'xmlhttprequest',
					startTime: 470,
					duration: 45,
					fetchStart: 470,
					requestStart: 475,
					responseStart: 505,
				});
				emitResourceTiming({
					name: 'https://cdn.example.com/uploads/customer-plan.pdf',
					initiatorType: 'link',
					startTime: 500,
					duration: 50,
					fetchStart: 500,
					requestStart: 505,
					responseStart: 540,
				});
				emitResourceTiming({
					name: 'https://cdn.example.com/uploads/customer-roadmap.png',
					initiatorType: 'img',
					startTime: 560,
					duration: 35,
					fetchStart: 560,
					requestStart: 565,
					responseStart: 590,
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
