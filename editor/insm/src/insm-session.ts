import Bowser from 'bowser-ultralight';

import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { INSM } from './insm';
import type { AddedProperties, ExperienceProperties } from './types';

import { PeriodTracking } from './insm-period';
import { LongAnimationFrameMeasurer } from './session-measurers/LongAnimationFrameMeasurer';

/**
 * Only intended for internal use.
 *
 * Exported for consumers who may require the type.
 *
 * Note: Events are not reliably fired from mobile browsers (ie. when a browser is closed when not in use)
 */
export class INSMSession {
	private experienceKey: string;
	private experienceProperties: ExperienceProperties;
	private startedAt = performance.now();
	private pageLoadTime: number | null = null;
	insm: INSM;
	private running = true;
	private addedProperties: AddedProperties[] = [];

	runningFeatures: Set<string> = new Set();
	periodTracking: PeriodTracking;
	longAnimationFrameMeasurer: LongAnimationFrameMeasurer;

	constructor(experienceKey: string, experienceProperties: ExperienceProperties, insm: INSM) {
		this.experienceKey = experienceKey;
		this.experienceProperties = experienceProperties;
		this.insm = insm;
		this.periodTracking = new PeriodTracking(this);

		this.longAnimationFrameMeasurer = new LongAnimationFrameMeasurer({
			initial: this.experienceProperties.initial,
			limit: 3,
			insmSession: this,
			reportingThreshold: 500,
		});
	}

	/**
	 * Completes the page load timing. This is called automatically when ending a heavy task
	 * with the key 'PageLoad'.
	 */
	completePageLoad() {
		this.pageLoadTime = performance.now() - this.startedAt;
	}

	updateExperienceKey(experienceKey: string) {
		this.experienceKey = experienceKey;
	}

	/**
	 * Adds a feature to the currently running session
	 */
	startFeature(featureName: string) {
		this.runningFeatures.add(featureName);
		this.periodTracking?.startFeature(featureName);
	}

	/**
	 * Ends a features usage in the currently running session
	 */
	endFeature(featureName: string) {
		this.runningFeatures.delete(featureName);
	}

	/**
	 * Returns details on the current session.
	 */
	get details() {
		return {
			experienceKey: this.experienceKey,
			experienceProperties: this.experienceProperties,
			paused: this.periodTracking.pauses.size > 0,
			periodState: this.periodTracking.state,
			/**
			 * The only scenario where this value should return false is when
			 * the experience has been stopped early.
			 */
			running: this.running,
		};
	}

	/**
	 * This api takes either a static single-level key-value object, or callbacks which return the same and
	 * will be evaluated on session end.
	 *
	 * When ending a session, all properties received via this api are merged, in order, into the resulting
	 * insm event’s properties; last write wins.
	 *
	 * Callback values are evaluated at session end.
	 *
	 * For example, for the following
	 *
	 * ```ts
	 * insm.experience.addProperties({ one: 1, two: 2 });
	 * insm.experience.addProperties(() => ({ one: 'one' }));
	 * insm.experience.addProperties({ three: 3 });
	 * ```
	 *
	 * The resulting added properties will be
	 *
	 * ```ts
	 * { one: 'one', two: 2, three: 3 }
	 * ```
	 */
	addProperties(propertiesToAdd: AddedProperties) {
		this.addedProperties.push(propertiesToAdd);
	}

	/**
	 * In some scenarios (ie. when a page error boundary is hit), you will want to exit early.
	 * This is api supports these scenarios
	 *
	 * ```ts
	 * insm.stopEarly(reasonKey: string, description: string);
	 * ```
	 *
	 * Sessions closed early are identifiable by their end details
	 * `"endDetails": { stoppedBy: "early-stop", reasonKey, description }`.
	 *
	 * **Note**: The session is ended as soon as this is called, and any `addProperties` handlers will
	 * called immediately.
	 */
	earlyStop(reason: string, description?: string) {
		this.end({ stoppedBy: 'early-stop', reason, description });
	}

	end(
		endDetails:
			| {
					contentId?: string | null;
					experienceKey: string;
					stoppedBy: 'new-experience';
			  }
			| { stoppedBy: 'beforeunload' }
			| { description?: string; reason: string; stoppedBy: 'early-stop' },
	) {
		if (this.running === false) {
			// If an experience has already been ended -- don't repeat the ending
			return;
		}
		this.running = false;
		const endedAt = performance.now();
		const duration = endedAt - this.startedAt;

		const evaluatedAddedProperties = {};
		for (const addedProperty of this.addedProperties) {
			if (typeof addedProperty === 'function') {
				Object.assign(evaluatedAddedProperties, addedProperty());
			} else {
				Object.assign(evaluatedAddedProperties, addedProperty);
			}
		}

		const periodResults = this.periodTracking.endResults;

		/**
		 * This event ends up as "insm measured"
		 */
		const operationalEvent = {
			actionSubject: 'insm',
			action: 'measured',
			attributes: {
				// Added first to ensure these don't overwrite any insm properties
				...evaluatedAddedProperties,
				'event:population': this.insm.options.population,
				experienceKey: this.experienceKey,
				initial: this.experienceProperties.initial,
				contentId: this.experienceProperties.contentId,
				timing: {
					startedAt: this.startedAt,
					// Note: this will not match up with the periods sum of durations, as it includes
					// time paused when heavy tasks were running, and/or the page is in the background.
					duration,
				},
				periods: periodResults,
				endDetails: endDetails,
				...(expValEquals('cc_editor_insm_outlier_events', 'cohort', 'test')
					? {
							longScripts: this.longAnimationFrameMeasurer.current,
							pageLoadTime: this.pageLoadTime,
							deviceDetails: getDeviceDetails(),
						}
					: {}),
				// these health attributes drive our SLOs
				healthAFPS: periodResults.active.measurements.afps?.average
					? periodResults.active.measurements.afps?.average >= 50
					: undefined,
				healthINP: periodResults.active.measurements.inp?.average
					? periodResults.active.measurements.inp?.average >= 200
					: undefined,
			},
			highPriority: true,
			tags: ['editor'],
			source: 'unknown',
		};

		this.insm.analyticsWebClient?.sendOperationalEvent(operationalEvent);
		this.longAnimationFrameMeasurer.cleanup();
	}
}

// Functionality vendored from UFO
function getDeviceDetails() {
	const telemetry = {};

	// /platform/packages/data/ufo-internal/src/core/publisher/plugins/browser.ts
	if (Bowser.getParser) {
		const browser = Bowser.getParser(
			(typeof window !== 'undefined' && !!window ? window : undefined)?.navigator?.userAgent || '',
		);
		Object.assign(telemetry, {
			'event:browser:name': browser.getBrowserName(),
			'event:browser:version': browser.getBrowserVersion(),
		});
	}

	// /platform/packages/data/ufo-internal/src/core/publisher/plugins/cpus.ts
	Object.assign(telemetry, { 'event:cpus': navigator.hardwareConcurrency });

	// /platform/packages/data/ufo-internal/src/core/publisher/plugins/memory.ts
	// @ts-ignore: deviceMemory is exposed in some browsers
	Object.assign(telemetry, { 'event:memory': navigator.deviceMemory });

	// /platform/packages/data/ufo-internal/src/core/publisher/plugins/network.ts
	Object.assign(telemetry, {
		// Network
		// @ts-ignore: connection is available in some browsers
		// eslint-disable-next-line compat/compat
		'event:network:effectiveType': navigator.connection?.effectiveType,
		// @ts-ignore: connection is available in some browsers
		// eslint-disable-next-line compat/compat
		'event:network:rtt': navigator.connection?.rtt,
		// @ts-ignore: connection is available in some browsers
		// eslint-disable-next-line compat/compat
		'event:network:downlink': navigator.connection?.downlink,
	});

	return telemetry;
}
