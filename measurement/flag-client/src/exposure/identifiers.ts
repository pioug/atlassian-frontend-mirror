/**
 * The attribution identifiers of an exposure, and the string check exposure mapping shares with
 * them. Separate from the mapper so a read can build its deduplication identity without loading the
 * delivery subsystem. Not part of the public API.
 */
import type { RequestContext } from '../types';
import type { FFPUser } from '../user-normalization';

/**
 * What an exposure is attributed to: the held payload's request context, which supersedes `user`, or
 * the user alone while the client holds no payload.
 */
export interface AttributionContext {
	readonly requestContext?: Required<RequestContext>;
	readonly user: FFPUser;
}

/**
 * The nonempty identifiers of the attribution context, which a record carries as
 * `atl.identifiers.*`.
 */
export function attributionIdentifiers(input: AttributionContext): [name: string, value: string][] {
	return Object.entries((input.requestContext ?? input.user).identifiers).filter(
		(entry): entry is [string, string] => entry[0] !== '' && isNonEmptyString(entry[1]),
	);
}

export function isNonEmptyString(value: unknown): value is string {
	return typeof value === 'string' && value !== '';
}
