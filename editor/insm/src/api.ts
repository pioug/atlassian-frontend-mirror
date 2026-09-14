import type { ExperienceProperties, INSMOptions } from './types';
import type { INSMSession } from './insm-session';
import { INSM } from './insm';

let initialisedInsm: INSM;

/**
 * Initializes the INSM (Interactivity Session Measurement) tooling
 */
export function init(options: INSMOptions): void {
	initialisedInsm = new INSM(options);
}

function insmInitialised() {
	if (!initialisedInsm) {
		return false;
	}
	return true;
}

/**
 * **In**teractivity **s**ession **m**onitoring
 */
export const insm: Pick<
	INSM,
	'start' | 'stopEarly' | 'startHeavyTask' | 'endHeavyTask' | 'overrideExperienceKey'
> & {
	session:
		| Pick<INSMSession, 'details' | 'startFeature' | 'endFeature' | 'addProperties' | 'setProperty'>
		| undefined;
} = {
	startHeavyTask(heavyTaskName: string) {
		if (insmInitialised()) {
			initialisedInsm.startHeavyTask(heavyTaskName);
		}
	},
	endHeavyTask(heavyTaskName: string) {
		if (insmInitialised()) {
			initialisedInsm.endHeavyTask(heavyTaskName);
		}
	},

	start(experienceKey: string, experienceProperties: ExperienceProperties) {
		if (insmInitialised()) {
			initialisedInsm.start(experienceKey, experienceProperties);
		}
	},

	overrideExperienceKey(experienceKey: string) {
		if (insmInitialised()) {
			initialisedInsm.overrideExperienceKey(experienceKey);
		}
	},

	stopEarly(reasonKey: string, description: string) {
		if (insmInitialised()) {
			initialisedInsm.stopEarly(reasonKey, description);
		}
	},
	// We only expose details and feature start/stop to consumers
	// as the other properties are internals for the insm and InsmPeriod
	// to interact with the running session.
	get session():
		| Pick<INSMSession, 'details' | 'startFeature' | 'endFeature' | 'addProperties' | 'setProperty'>
		| undefined {
		if (insmInitialised()) {
			return initialisedInsm.runningSession;
		}
	},

	// @ts-expect-error Private method for testing purposes
	__setAnalyticsWebClient(analyticsWebClient?: AnalyticsWebClient) {
		if (initialisedInsm) {
			initialisedInsm.analyticsWebClient = analyticsWebClient;
		}
	},
};
