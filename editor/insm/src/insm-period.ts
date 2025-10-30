/* eslint-disable @repo/internal/dom-events/no-unsafe-event-listeners */
import { fg } from '@atlaskit/platform-feature-flags';

import type { INSMSession } from './insm-session';
import type { Measure } from './types';

export class PeriodTracking {
	private periodMeasurements: {
		active: {
			count: number;
			duration: number;
			features: Set<string>;
			heavyTasks: Set<string>;
			measurements: { [key: string]: Measure };
		};
		inactive: {
			count: number;
			duration: number;
			features: Set<string>;
			heavyTasks: Set<string>;
			measurements: { [key: string]: Measure };
		};
	} = {
		active: {
			features: new Set(),
			heavyTasks: new Set(),
			measurements: {},
			duration: 0,
			count: 0,
		},
		inactive: {
			features: new Set(),
			heavyTasks: new Set(),
			measurements: {},
			duration: 0,
			count: 0,
		},
	};

	/**
	 * On creation - this is set to the currently running sessions features,
	 * and is updated throughout the period for any additional features triggered.
	 * It is reset when starting a new period.
	 */
	// Currently unused - this will be used when the outlier periods tracking is updated
	private latestPeriodFeatures: Set<string>;

	// Currently unused - this will be used when the outlier periods tracking is updated
	private latestHeavyTasks: Set<string>;

	state: 'inactive' | 'active' = 'inactive';
	pauses = new Set<string>();
	/**
	 * Warning: this can be reset mid period when pausing/resuming.
	 * It's intended use is to build the `periodMeasurements` duration.
	 */
	private currentPeriodStart = performance.now();

	private session: INSMSession;

	constructor(session: INSMSession) {
		this.session = session;

		this.latestPeriodFeatures = new Set(session.runningFeatures);
		this.latestHeavyTasks = new Set(session.insm.runningHeavyTasks);
		this.pauses = new Set(session.insm.runningHeavyTasks);

		const startInteractivityMeasuresPaused = this.latestHeavyTasks.size !== 0;

		for (const periodMeasurer of session.insm.periodMeasurers) {
			periodMeasurer.start(startInteractivityMeasuresPaused);
			this.periodMeasurements.active.measurements[periodMeasurer.name] = {
				numerator: 0,
				denominator: 0,
				max: 0,
				min: 0,
				average: 0,
			};

			this.periodMeasurements.inactive.measurements[periodMeasurer.name] = {
				numerator: 0,
				denominator: 0,
				max: 0,
				min: 0,
				average: 0,
			};
		}

		this.setupActiveStartInteractionListeners();
	}

	startFeature(featureName: string) {
		this.latestPeriodFeatures.add(featureName);
		this.periodMeasurements[this.state].features.add(featureName);
	}

	startHeavyTask(heavyTaskName: string) {
		this.latestHeavyTasks.add(heavyTaskName);
		this.periodMeasurements[this.state].heavyTasks.add(heavyTaskName);
		this.pause(heavyTaskName);
	}

	endHeavyTask(heavyTaskName: string) {
		this.resume(heavyTaskName);
	}

	/**
	 * Sets a pause based on a key.  If this is the first pause, then it will also halt
	 * running interactivity measures, and update the current measurements duration.
	 */
	pause(pauseName: string) {
		if (this.pauses.size === 0) {
			this.periodMeasurements[this.state].duration =
				this.periodMeasurements[this.state].duration +
				(performance.now() - this.currentPeriodStart);
			for (const periodMeasurer of this.session.insm.periodMeasurers) {
				periodMeasurer.pause();
			}
		}

		this.pauses.add(pauseName);
	}

	/**
	 * Releases a pause for a key.
	 *
	 * **NOTE**: The session will only resume if this was the only
	 * currently tracked pause key.
	 */
	resume(pauseName: string) {
		this.pauses.delete(pauseName);

		if (this.pauses.size === 0) {
			this.currentPeriodStart = performance.now();
			for (const periodMeasurer of this.session.insm.periodMeasurers) {
				periodMeasurer.resume();
			}
		}
	}

	get endResults() {
		this.changePeriodAndTrackLast(this.state);
		if (fg('cc_editor_insm_fix_attributes')) {
			return {
				active: {
					features: Array.from(this.periodMeasurements.active.features),
					heavyTasks: Array.from(this.periodMeasurements.active.heavyTasks),
					measurements: this.periodMeasurements.active.measurements,
					duration: this.periodMeasurements.active.duration,
					count: this.periodMeasurements.active.count,
				},
				inactive: {
					features: Array.from(this.periodMeasurements.inactive.features),
					heavyTasks: Array.from(this.periodMeasurements.inactive.heavyTasks),
					measurements: this.periodMeasurements.inactive.measurements,
					duration: this.periodMeasurements.inactive.duration,
					count: this.periodMeasurements.inactive.count,
				},
			};
		}
		return this.periodMeasurements;
	}

	private activeStartListeners: [string, () => void][] = [];
	private setupActiveStartInteractionListeners() {
		const events = ['mousemove', 'pointerdown', 'pointerup', 'click', 'keydown', 'keyup', 'scroll'];
		for (const event of events) {
			const eventListener = () => {
				// start event
				this.changePeriodAndTrackLast('inactive', 'active');
			};
			window.addEventListener(event, eventListener, { once: true });
			this.activeStartListeners.push([event, eventListener]);
		}
	}

	private activeEndListeners: [string, () => void][] = [];
	/**
	 * This works by;
	 * On setup
	 * - starts activity listeners
	 *   - on activity received
	 *     - possible end active count down started.
	 *       3 animation frames or 3 seconds of inactivity - whichever comes first
	 *     - any existing end count down ended
	 */
	private activeEndCountDownAbortController: AbortController = new AbortController();
	private activeEndCountDownVisibilityListener: (() => void) | undefined;
	private setupEndActiveInteractionListeners() {
		this.activeEndCountDownVisibilityListener = () => {
			if (document.visibilityState === 'hidden') {
				endSession();
			}
		};
		window.addEventListener('visibilitychange', this.activeEndCountDownVisibilityListener);

		const events = ['mousemove', 'pointerdown', 'pointerup', 'click', 'keydown', 'keyup', 'scroll'];

		for (const event of events) {
			const eventListener = () => {
				this.activeEndCountDownAbortController.abort();
				this.activeEndCountDownAbortController = new AbortController();

				startPeriodEndCountDown(this.activeEndCountDownAbortController.signal, () => {
					endSession();
				});
			};

			window.addEventListener(event, eventListener);

			this.activeEndListeners.push([event, eventListener]);
		}

		const endSession = () => {
			this.activeEndCountDownAbortController.abort();
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			window.removeEventListener('visibilitychange', this.activeEndCountDownVisibilityListener!);

			for (const activeEndListener of this.activeEndListeners) {
				window.removeEventListener(activeEndListener[0], activeEndListener[1]);
			}

			this.changePeriodAndTrackLast('active', 'inactive');
		};

		// When first setting up -- there has just been an interaction -- so we start a countdown
		this.activeEndCountDownAbortController.abort();
		this.activeEndCountDownAbortController = new AbortController();
		startPeriodEndCountDown(this.activeEndCountDownAbortController.signal, () => {
			endSession();
		});
	}

	private changePeriodAndTrackLast(
		lastPeriod: 'active' | 'inactive',
		newPeriod?: 'active' | 'inactive',
	) {
		this.periodMeasurements[lastPeriod].duration =
			this.periodMeasurements[lastPeriod].duration + (performance.now() - this.currentPeriodStart);
		this.periodMeasurements[lastPeriod].count++;

		const interactivityMeasuresPaused = this.latestHeavyTasks.size !== 0;

		for (const interactivityMeasure of this.session.insm.periodMeasurers) {
			const finalResult = newPeriod
				? interactivityMeasure.start(interactivityMeasuresPaused)
				: interactivityMeasure.end();
			const tracked = this.periodMeasurements[lastPeriod].measurements[interactivityMeasure.name];

			if (finalResult.average === 0) {
				// In this case -- we haven't had any measurements complete since last measurement
				// so we do nothing
			} else if (tracked.average === 0) {
				// In this case -- we haven't had any entries come through yet - so we replace any existing entries
				this.periodMeasurements[lastPeriod].measurements[interactivityMeasure.name] = finalResult;
			} else {
				// In this case there is a new measurement which we merge with the previous measurement
				const merged: Measure = {
					numerator: finalResult.numerator + tracked.numerator,
					denominator: finalResult.denominator + tracked.denominator,
					average:
						(finalResult.numerator + tracked.numerator) /
						(finalResult.denominator + tracked.denominator),
					max: tracked.max === 0 || finalResult.max > tracked.max ? finalResult.max : tracked.max,
					min: tracked.min === 0 || finalResult.min < tracked.min ? finalResult.min : tracked.min,
				};

				this.periodMeasurements[lastPeriod].measurements[interactivityMeasure.name] = merged;
			}
		}

		for (const listener of this.activeStartListeners) {
			window.removeEventListener(listener[0], listener[1]);
		}

		for (const listener of this.activeEndListeners) {
			window.removeEventListener(listener[0], listener[1]);
		}
		this.activeEndCountDownAbortController?.abort();
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		window.removeEventListener('visibilitychange', this.activeEndCountDownVisibilityListener!);

		if (newPeriod) {
			this.latestPeriodFeatures = new Set(this.session.runningFeatures);
			this.session.runningFeatures.forEach((featureName) => {
				this.periodMeasurements[newPeriod].features.add(featureName);
			});
			this.latestHeavyTasks = new Set(this.session.insm.runningHeavyTasks);
			this.currentPeriodStart = performance.now();

			switch (newPeriod) {
				case 'active':
					this.setupEndActiveInteractionListeners();
					this.state = 'active';
					break;
				case 'inactive':
					this.setupActiveStartInteractionListeners();
					this.state = 'inactive';
					break;
			}
		}
	}
}

function startPeriodEndCountDown(signal: AbortController['signal'], handleEnd: () => void) {
	let animationFramesSinceLastInteraction = 0;
	let inactiveTimeReached = false;

	let timer: ReturnType<typeof setTimeout>;
	let animationFrameHandler: ReturnType<typeof requestAnimationFrame>;

	const monitorAnimationFrames = () => {
		animationFrameHandler = requestAnimationFrame(() => {
			animationFramesSinceLastInteraction++;
			if (animationFramesSinceLastInteraction < 3) {
				monitorAnimationFrames();
			} else {
				if (inactiveTimeReached) {
					handleEnd();
				}
			}
		});
	};

	const monitorTime = () => {
		timer = setTimeout(() => {
			inactiveTimeReached = true;

			if (animationFramesSinceLastInteraction === 3) {
				handleEnd();
			}
		}, 3000);
	};

	monitorTime();
	monitorAnimationFrames();

	signal.addEventListener('abort', () => {
		clearTimeout(timer);
		cancelAnimationFrame(animationFrameHandler);
	});
}
