import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';

import { INSMSession } from './insm-session';
import type { ExperienceProperties, INSMOptions } from './types';
import { AnimationFPSIM } from './period-measurers/afps';
import { INPTracker } from './inp-measurers/inp';

export class INSM {
	analyticsWebClient?: AnalyticsWebClient;
	runningSession?: INSMSession;
	options: INSMOptions;
	periodMeasurers: [AnimationFPSIM, INPTracker];

	/**
	 * Heavy tasks are tracked at the insm layer as heavy tasks
	 * are expected at times to be unrelated to the current
	 * page session.
	 */
	runningHeavyTasks: Set<string> = new Set();

	constructor(options: INSMOptions) {
		this.periodMeasurers = [new AnimationFPSIM(), new INPTracker()];
		this.options = options;

		// If this does throw -- we do want an unhandledRejection rejection to be passed to the window
		// this is to ease debugging.
		options.getAnalyticsWebClient.then(
			(analyticsWebClient) => (this.analyticsWebClient = analyticsWebClient),
		);

		// No cleanup needs to be performed -- as this tooling is intended to run until the tab is closed
		// The use of beforeunload here is because using pagehide does not reliably result in the analytics
		// being fired by the analytics web client.
		// The use of this means we will miss events from mobile safari which does not reliably call this api
		// however mobile browsers do not call when a browser closes - so we expect limited mobile data from
		// this tooling in its current form.

		// window will not be defined in server envs - in these envs -- there can never be a session end
		if (typeof window !== 'undefined') {
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			window.addEventListener('beforeunload', () => {
				this.runningSession?.end({ stoppedBy: 'beforeunload' });
			});
		}
	}

	/**
	 * Starts a heavy task in the currently running session.
	 *
	 * This also pauses measurement.
	 */
	startHeavyTask(heavyTaskName: string) {
		this.runningHeavyTasks.add(heavyTaskName);
		this.runningSession?.periodTracking?.startHeavyTask(heavyTaskName);
		this.runningSession?.periodTracking.pause(heavyTaskName);
		this.session?.longAnimationFrameMeasurer.pause();
	}

	/**
	 * Ends a heavy task in the currently running session
	 */
	endHeavyTask(heavyTaskName: string) {
		this.runningHeavyTasks.delete(heavyTaskName);
		this.runningSession?.periodTracking.resume(heavyTaskName);

		if (this.runningHeavyTasks.size === 0) {
			this.session?.longAnimationFrameMeasurer.resume();
		}
	}

	/**
	 * Call this when starting a new experience.  This is expected to be wired to the product
	 * routing solution.
	 *
	 * It's expected this call will be paired with a `insm.session.startHeavyTask('page-load')` and subsequent `insm.session.endHeavyTask('page-load')`
	 * so that performance degradations linked to the page initialisation are excluded from the active interactivity monitoring.
	 *
	 *
	 * ```ts
	 * insm.start('edit-page', { initial: true, contentId: '9001' })
	 * insm.session.startHeavyTask(''page-load')
	 * // ... heavy initialisation work
	 * insm.session.endHeavyTask(''page-load')
	 * ```
	 */
	start(experienceKey: string, experienceProperties: ExperienceProperties) {
		if (this.runningSession !== undefined) {
			this.runningSession.end({
				stoppedBy: 'new-experience',
				experienceKey: experienceKey,
				contentId: experienceProperties.contentId,
			});
		}
		this.lastStartedExperienceProperties = experienceProperties;
		if (this.options.experiences[experienceKey]?.enabled) {
			this.runningSession = new INSMSession(experienceKey, experienceProperties, this);
		}
	}

	private lastStartedExperienceProperties: ExperienceProperties | undefined;

	/**
	 * Call this to update the name of the running session after it's started
	 * In the case it's been started with an unregistered name, and there is not running
	 * session. This will also trigger the session being started.
	 */
	overrideExperienceKey(experienceKey: string) {
		if (this.runningSession !== undefined) {
			// If there is a running session - we update its name
			this.runningSession.updateExperienceKey(experienceKey);
		} else {
			// otherwise - we assume the last session was not registered, and start it with the new name
			if (
				this.options.experiences[experienceKey]?.enabled &&
				this.lastStartedExperienceProperties
			) {
				this.runningSession = new INSMSession(
					experienceKey,
					this.lastStartedExperienceProperties,
					this,
				);
			}
		}
	}

	/**
	 * This prematurely halts any running experience measurement. It's expected to be used in
	 * scenarios such as when error boundaries are hit.
	 */
	stopEarly(reasonKey: string, description: string) {
		this.runningSession?.earlyStop(reasonKey, description);
	}

	/**
	 * Gets the current running session details
	 */
	get session() {
		return this.runningSession;
	}
}
