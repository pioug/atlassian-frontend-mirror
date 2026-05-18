export type TerminalErrorCategory =
	| 'product'
	| 'network-client'
	| 'network-server'
	| 'chunk-load'
	| 'auth'
	| 'abort';

const ABORT_ERROR_NAMES = new Set(['AbortError']);

const ABORT_ERROR_MESSAGES = ['The operation was aborted', 'auth_window_closed'];

// Only treated as abort when combined with AuthError name — the same string
// can appear in other error messages (e.g. 403 response bodies) where it
// should not be classified as abort.
const AUTH_ERROR_ABORT_MESSAGES = ['access_denied'];

// AuthError is thrown by @atlaskit/outbound-auth-flow-client during OAuth flows
// (e.g. connecting third-party apps like GitHub or Bitbucket to Jira).
// User-initiated outcomes (closing the popup, denying consent) are classified
// as abort; server/config failures are classified as auth.
const AUTH_ERROR_NAMES = new Set(['AuthError']);

const CHUNK_LOAD_ERROR_NAMES = new Set(['ChunkLoadError']);

const CHUNK_LOAD_ERROR_MESSAGES = [
	'Unable to fetch manifest',
	'dynamically imported module',
	'Importing a module script failed',
];

const NETWORK_CLIENT_ERROR_NAMES = new Set(['NetworkError', 'Network error']);

const NETWORK_CLIENT_ERROR_MESSAGES = [
	'Failed to fetch',
	'Load failed',
	'Network request failed',
	'NetworkError',
	'server with the specified hostname could not be found',
	'The network connection was lost',
	'The request timed out',
	'connection failure',
	'CloseEvent: Ping timeout',
	'Curl Error: Failure when receiving data from the peer',
];

const NETWORK_SERVER_ERROR_MESSAGES = [
	'... is not valid JSON',
	'in JSON at position 0',
	'JSON.parse: unexpected character',
	'JSON.parse: unexpected end of data',
	'Unexpected end of input',
	'Unexpected end of JSON input',
	'cannot parse response',
	'Syntax or http error',
];

function matchesCategory(error: Error): TerminalErrorCategory | null {
	const name = error.name ?? '';
	const message = error.message ?? '';

	if (
		ABORT_ERROR_NAMES.has(name) ||
		ABORT_ERROR_MESSAGES.some((pattern) => message.includes(pattern)) ||
		// OAuth Abort errors
		(AUTH_ERROR_NAMES.has(name) &&
			AUTH_ERROR_ABORT_MESSAGES.some((pattern) => message.includes(pattern)))
	) {
		return 'abort';
	}

	if (AUTH_ERROR_NAMES.has(name)) {
		return 'auth';
	}

	if (
		CHUNK_LOAD_ERROR_NAMES.has(name) ||
		CHUNK_LOAD_ERROR_MESSAGES.some((pattern) => message.includes(pattern))
	) {
		return 'chunk-load';
	}

	if (
		NETWORK_CLIENT_ERROR_NAMES.has(name) ||
		NETWORK_CLIENT_ERROR_MESSAGES.some((pattern) => message.includes(pattern))
	) {
		return 'network-client';
	}

	if (NETWORK_SERVER_ERROR_MESSAGES.some((pattern) => message.includes(pattern))) {
		return 'network-server';
	}

	return null;
}

/**
 * Classifies an error into a TerminalErrorCategory for UFO terminal error
 * reporting. The category is included in the event payload so that Databricks
 * and SignalFx dashboards can filter/alert by category without silently
 * dropping events.
 *
 * Checks both the error itself and error.cause (one level deep), matching the
 * behaviour of isClientFetchError in jira-fetch. Checks are ordered from
 * most-specific to least-specific to ensure the first matching category wins.
 */
export function classifyTerminalError(error: Error): TerminalErrorCategory {
	const directMatch = matchesCategory(error);
	if (directMatch) {
		return directMatch;
	}

	if (
		typeof error === 'object' &&
		error !== null &&
		'cause' in error &&
		error.cause instanceof Error
	) {
		const cause = error.cause;
		const causeMatch = matchesCategory(cause);
		if (causeMatch) {
			return causeMatch;
		}
	}

	return 'product';
}
