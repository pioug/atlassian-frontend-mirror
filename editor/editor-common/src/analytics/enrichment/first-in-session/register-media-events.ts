import { classifyEvent, type IdentityMapper } from './classify-event';
import type { RegisterFirstInSessionEvent } from './create-first-in-session-enrichers';
import { enrichFirstInSession, type ClassifyFirstInSession } from './enrich-first-in-session';

// The media render detectors group these client error codes into one integrator failure cohort.
const cardErrors = new Set([
	'invalidFileId',
	'authProviderTimedOut',
	'serverForbidden',
	'serverUnauthorized',
	'clientAbortedRequest',
	'serverRateLimited',
	'serverBadGateway',
	'failedAuthProvider',
	'tokenExpired',
	'zeroVersionFile',
	'serverNotFound',
	'fileSizeExceedsLimit',
	'emptyItems',
]);
const inlineErrors = new Set([...cardErrors, 'emptyFileName']);

function createMediaFailureMapper(errors: ReadonlySet<string>): IdentityMapper {
	return ({ attributes }) => {
		const error = attributes?.error;
		return typeof error === 'string' && errors.has(error) ? 'integratorError' : null;
	};
}

function createMediaClassifier(identify: IdentityMapper): ClassifyFirstInSession {
	return ({ event, appearance }) => classifyEvent(event, appearance, identify);
}

const classifyCardFailure = createMediaClassifier(createMediaFailureMapper(cardErrors));
const classifyInlineFailure = createMediaClassifier(createMediaFailureMapper(inlineErrors));
const classifySuccess = createMediaClassifier(() => '');

/** Enriches render events used by the media detectors. */
export function registerMediaEvents(register: RegisterFirstInSessionEvent): void {
	register((options) => {
		const { action, actionSubject, eventType } = options.event;
		if (
			eventType !== 'operational' ||
			(actionSubject !== 'mediaCardRender' && actionSubject !== 'mediaInlineRender')
		) {
			return;
		}
		if (action === 'succeeded') {
			return enrichFirstInSession(options, classifySuccess);
		}
		if (action === 'failed') {
			const classify =
				actionSubject === 'mediaCardRender' ? classifyCardFailure : classifyInlineFailure;
			return enrichFirstInSession(options, classify);
		}
	});
}
