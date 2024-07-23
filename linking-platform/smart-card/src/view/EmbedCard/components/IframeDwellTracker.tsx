/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useRef, useState } from 'react';

export interface IframeDwellTrackerProps {
	isIframeLoaded: boolean;
	isMouseOver: boolean;
	isWindowFocused: boolean;
	iframePercentVisible: number;
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
		time: number;
		percentVisible: number;
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

		if (isIframeLoaded && isMouseOver && isWindowFocused && iframePercentVisible > 0.75) {
			if (dwellTimeoutId.current) {
				clearInterval(dwellTimeoutId.current);
			}
			dwellTimeoutId.current = setInterval(incrementDwellTime, 1000);
		}
		return () => {
			if (dwellTimeoutId.current) {
				clearInterval(dwellTimeoutId.current);
			}
		};
	}, [setDwell, isMouseOver, isWindowFocused, isIframeLoaded, iframePercentVisible]);

	return null;
};
