import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';

import { INSMSession } from './insm-session';
import type { ExperienceProperties, INSMOptions } from './types';
import { AnimationFPSIM } from './period-measurers/afps';

export class INSM {
	analyticsWebClient?: AnalyticsWebClient;
	runningSession?: INSMSession;
	options: INSMOptions;
	periodMeasurers: [AnimationFPSIM];

	/**
	 * Heavy tasks are tracked at the insm layer as heavy tasks
	 * are expected at times to be unrelated to the current
	 * page session.
	 */
	runningHeavyTasks: Set<string> = new Set();

	constructor(options: INSMOptions) {
		this.periodMeasurers = [new AnimationFPSIM()];
		this.options = options;

		// If this does throw -- we do want an unhandledRejection rejection to be passed to the window
		// this is to ease debugging.
		options.getAnalyticsWebClient.then(
			(analyticsWebClient) => (this.analyticsWebClient = analyticsWebClient),
		);

		// No cleanup needs to be performed -- as this is intended to run until the tab is closed
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		window.addEventListener('pagehide', () => {
			this.runningSession?.end({ stoppedBy: 'pagehide' });
		});
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
	}

	/**
	 * Ends a heavy task in the currently running session
	 */
	endHeavyTask(heavyTaskName: string) {
		this.runningHeavyTasks.delete(heavyTaskName);
		this.runningSession?.periodTracking.resume(heavyTaskName);
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
		if (this.options.experiences[experienceKey]?.enabled) {
			this.runningSession = new INSMSession(experienceKey, experienceProperties, this);
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
