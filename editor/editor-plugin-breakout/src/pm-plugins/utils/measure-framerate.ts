/**
 * Measure the FPS of a resizing component.
 *
 * This is a simplified version of the `useMeasureFramerate` hook from `editor-plugin-table`.
 * (packages/editor/editor-plugin-table/src/pm-plugins/utils/analytics.ts)
 */

export const reduceResizeFrameRateSamples = (frameRateSamples: number[]) => {
	if (frameRateSamples.length > 1) {
		const frameRateSum = frameRateSamples.reduce((sum, frameRate, index) => {
			if (index === 0) {
				return sum;
			} else {
				return sum + frameRate;
			}
		}, 0);
		const averageFrameRate = Math.round(frameRateSum / (frameRateSamples.length - 1));
		return [frameRateSamples[0], averageFrameRate];
	} else {
		return frameRateSamples;
	}
};

type MeasureFramerateConfig = {
	maxSamples?: number;
	minFrames?: number;
	minTimeMs?: number;
	sampleRateMs?: number;
	timeoutMs?: number;
};

/**
 * Measures the framerate of a component over a given time period.
 * @param {object} [config] - Configuration options for framerate measurement.
 * @returns {object} An object containing startMeasure, endMeasure, and countFrames methods.
 * @example
 * const { startMeasure, endMeasure, countFrames } = measureFramerate();
 * startMeasure();
 * // ... animation loop with countFrames() calls
 * const samples = endMeasure(); // [60, 58, 62]
 */
export const measureFramerate = (config?: MeasureFramerateConfig) => {
	const {
		maxSamples = 10,
		minFrames = 5,
		minTimeMs = 500,
		sampleRateMs = 1000,
		timeoutMs = 200,
	} = config || {};

	let frameCount = 0;
	let lastTime = 0;
	let timeoutId: NodeJS.Timeout | undefined;
	let frameRateSamples: number[] = [];

	const startMeasure = () => {
		frameCount = 0;
		lastTime = performance.now();
	};

	/**
	 * Returns an array of frame rate samples as integers.
	 * @returns {number[]} An array of frame rate samples as integers.
	 * @example
	 * const samples = endMeasure(); // [60, 58, 62]
	 */
	const endMeasure = () => {
		const samples = frameRateSamples;
		frameRateSamples = [];
		return samples;
	};

	const sampleFrameRate = (delay = 0) => {
		const currentTime = performance.now();
		const deltaTime = currentTime - lastTime - delay;
		const isValidSample = deltaTime > minTimeMs && frameCount >= minFrames;
		if (isValidSample) {
			const frameRate = Math.round(frameCount / (deltaTime / 1000));
			frameRateSamples.push(frameRate);
		}
		frameCount = 0;
		lastTime = 0;
	};

	/**
	 * Counts the number of frames that occur within a given time period. Intended to be called
	 * inside a `requestAnimationFrame` callback.
	 * @example
	 * const animate = () => {
	 *   countFrames();
	 *   requestAnimationFrame(animate);
	 * };
	 */
	const countFrames = () => {
		if (frameRateSamples.length >= maxSamples && timeoutId) {
			clearTimeout(timeoutId);
			return;
		}

		/**
		 * Allows us to keep counting frames even if `startMeasure` is not called
		 */
		if (lastTime === 0) {
			lastTime = performance.now();
		}
		frameCount++;

		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		if (performance.now() - lastTime > sampleRateMs) {
			sampleFrameRate();
		} else {
			timeoutId = setTimeout(() => sampleFrameRate(timeoutMs), timeoutMs);
		}
	};

	return { startMeasure, endMeasure, countFrames };
};
