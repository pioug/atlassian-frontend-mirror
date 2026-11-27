import { classifyEvent } from './classify-event';
import type { RegisterFirstInSessionEvent } from './create-first-in-session-enrichers';
import { enrichFirstInSession, type ClassifyFirstInSession } from './enrich-first-in-session';

const identify = () => '';
const classify: ClassifyFirstInSession = ({ event, appearance }) =>
	classifyEvent(event, appearance, identify);

/** Enriches Editor starts and uncaught errors. */
export function registerEditorEvents(register: RegisterFirstInSessionEvent): void {
	register((options) => {
		const { action, actionSubject, eventType } = options.event;
		if (actionSubject !== 'editor') {
			return;
		}
		if (
			(action === 'started' && eventType === 'ui') ||
			(action === 'unhandledErrorCaught' && eventType === 'operational')
		) {
			return enrichFirstInSession(options, classify);
		}
	});
}
