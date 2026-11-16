import { CLIENT_FALLBACK_REASONS } from '../evaluation';

/** Match reasons that report an evaluation failure rather than a served variation. */
export const ERROR_REASONS: ReadonlySet<string> = new Set([
	...CLIENT_FALLBACK_REASONS,
	'general_error',
	'invalid_context',
]);
