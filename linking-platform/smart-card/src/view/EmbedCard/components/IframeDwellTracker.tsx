/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useRef, useState } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

export interface IframeDwellTrackerProps {
	iframePercentVisible: number;
	isIframeLoaded: boolean;
	isMouseOver: boolean;
	isWindowFocused: boolean;
	onIframeDwell?: (dwellTime: number, dwellPercentVisible: number) => void;
}

/**
 * A kind of cheap logarithmic backoff. Fire analytics after the user has
 * dwelled for 5 seconds, then 10 seconds, and so on.
 */
const INTERVALS_TO_LOG = [5, 10, 15, 20, 25, 30, 45, 60, 90, 120, 180];

export const IframeDwellTracker = ({
	isIframeLoaded,
	isMouseOver,
	isWindowFocused,
	iframePercentVisible,
	onIframeDwell,
}: IframeDwellTrackerProps) => {
	const [dwell, setDwell] = useState<{
		percentVisible: number;
		time: number;
	}>({ time: 0, percentVisible: 0 });
	const dwellTimeoutId = useRef<ReturnType<typeof setTimeout>>();

	// fire analytics when the dwell timer reaches 5 seconds
	useEffect(() => {
		if (dwell.time > 0 && INTERVALS_TO_LOG.includes(dwell.time)) {
			onIframeDwell && onIframeDwell(dwell.time, dwell.percentVisible);
		}
	}, [dwell, onIframeDwell]);

	// start and stop tracking dwell time
	useEffect(() => {
		const incrementDwellTime = () => {
			// callback is called on dwell state changes, so change percentVisible and time together
			setDwell(({ time }) => {
				return {
					time: time + 1,
					// snapshot of percent visible, rounded down to nearest 5%
					percentVisible: Math.floor((iframePercentVisible || 0) * 20) * 5,
				};
			});
		};

		// Require: iframe loaded, mouse over, and >75% visible
		const isDwellAndHoverMetricsEnabled = fg('rovo_chat_embed_card_dwell_and_hover_metrics');
		if (isDwellAndHoverMetricsEnabled) {
			// Note: Removed isWindowFocused requirement as it's unreliable and prevents tracking
			// The mouse over check is sufficient to indicate user engagement
			const shouldTrack = isIframeLoaded && isMouseOver && iframePercentVisible > 0.75;

			if (shouldTrack) {
				if (dwellTimeoutId.current) {
					clearInterval(dwellTimeoutId.current);
				}
				dwellTimeoutId.current = setInterval(incrementDwellTime, 1000);
			} else {
				if (dwellTimeoutId.current) {
					clearInterval(dwellTimeoutId.current);
					dwellTimeoutId.current = undefined;
				}
			}
		} else {
			if (isIframeLoaded && isMouseOver && isWindowFocused && iframePercentVisible > 0.75) {
				if (dwellTimeoutId.current) {
					clearInterval(dwellTimeoutId.current);
				}
				dwellTimeoutId.current = setInterval(incrementDwellTime, 1000);
			}
		}
		return () => {
			if (dwellTimeoutId.current) {
				clearInterval(dwellTimeoutId.current);
			}
		};
	}, [setDwell, isMouseOver, isWindowFocused, isIframeLoaded, iframePercentVisible]);

	return null;
};
