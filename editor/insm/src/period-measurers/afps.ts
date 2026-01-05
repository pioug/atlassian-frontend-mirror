import type { PeriodMeasurer } from '../types';

export class AnimationFPSIM implements PeriodMeasurer {
	/**
	 * AFPS stands for Animation Frames Per Second
	 */
	name = 'afps';

	monitor: AnimationFPSMonitor = new AnimationFPSMonitor();

	start(paused: boolean) {
		const result = this.monitor.startNewWindow(paused);
		return result;
	}

	end() {
		const result = this.monitor.end();
		return result;
	}

	pause(): void {
		this.monitor.pause();
	}

	resume(): void {
		this.monitor.resume();
	}
}

class AnimationFPSMonitor {
	paused: boolean = false;

	private currentState: {
		numerator: number;
		denominator: number;
		max: number;
		min: number;
		average: number;
	} = { numerator: 0, denominator: 0, max: 0, average: 0, min: 0 };

	// Current measurement window
	private windowFrameCount: number = 0;
	private windowTotalTime: number = 0;
	private currentFrameStart: number = 0;

	animationFrame?: ReturnType<typeof requestAnimationFrame>;

	private measureWindowFPS() {
		// Calculate FPS for this window
		// Note: windowFrameCount and windowTotalTime is reset after each window measurement
		const windowSeconds = this.windowTotalTime / 1000;
		// frames / seconds
		const windowFPS = this.windowFrameCount / windowSeconds;

		// Update overall tracking
		this.currentState.numerator += this.windowFrameCount;
		// The denominator is seconds not ms
		this.currentState.denominator += windowSeconds;

		// Calculate overall average FPS: (total frames / total time measured in seconds
		this.currentState.average = this.currentState.numerator / this.currentState.denominator;

		if (this.currentState.max === 0 || windowFPS > this.currentState.max) {
			this.currentState.max = windowFPS;
		}

		if (this.currentState.min === 0 || windowFPS < this.currentState.min) {
			this.currentState.min = windowFPS;
		}
	}

	/**
	 * If there is running tracking - it will be reset
	 */
	private startWindowTracking() {
		// Clear any previous tracking state
		this.resetOverallTracking();

		const measureFrame = () => {
			this.currentFrameStart = global.performance.now();
			this.animationFrame = requestAnimationFrame(() => {
				// While measurement is paused -- we don't count the animation frame towards the monitored
				// period.
				if (!this.paused) {
					const frameDuration = performance.now() - this.currentFrameStart;

					// Add frame to current window
					this.windowFrameCount++;
					this.windowTotalTime += frameDuration;

					// Check if window is >= 1 second (1000ms)
					// When the page is running smoothly it's expected this will not be hit frequently
					if (this.windowTotalTime >= 1000) {
						this.measureWindowFPS();
						// Reset window for next measurement
						this.resetWindow();
					}
				}

				measureFrame();
			});
		};

		measureFrame();
	}

	startNewWindow(paused: boolean) {
		const lastWindowResult = {
			numerator: this.currentState.numerator,
			denominator: this.currentState.denominator,
			max: this.currentState.max,
			min: this.currentState.min,
			average: this.currentState.average,
		};

		this.paused = paused;
		this.startWindowTracking();
		return lastWindowResult;
	}

	private resetWindow() {
		this.windowFrameCount = 0;
		this.windowTotalTime = 0;
		// Note this.currentFrameStart is over ridden
		// as part of tracking - so does not need to be
		// reset.
	}

	private endWindowTracking() {
		if (this.animationFrame) {
			cancelAnimationFrame(this.animationFrame);
		}
	}

	private resetOverallTracking() {
		this.resetWindow();
		this.endWindowTracking();
		this.currentState = { numerator: 0, denominator: 0, max: 0, min: 0, average: 0 };
	}

	end() {
		try {
			this.measureWindowFPS();
			return this.currentState;
		} finally {
			this.resetOverallTracking();
		}
	}

	pause(): void {
		// Note - we leave the tracking animationFrame monitoring running, and on resume
		// simply set the currentFrameStart and paused to true
		// This works because the tracking builds windows of tracked time rather than
		// basing itself off a window start time and time elapsed time since then.
		this.paused = true;
	}

	resume(): void {
		// Note - We don't need to handle the gap in measurement - as the raf logic builds/increments a window time
		// based on the currentFrameStart (and any previous measurements which can only happen while the tracking
		// is not paused).
		this.currentFrameStart = performance.now();
		this.paused = false;
		if (!this.animationFrame) {
			this.startWindowTracking();
		}
	}
}
