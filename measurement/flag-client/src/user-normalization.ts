import { isString } from './type-guards';
import type { FlagContextValue } from './types';

/** A user after normalization: frozen, null-prototype maps containing only valid entries. */
export interface FFPUser {
	readonly identifiers: Readonly<Record<string, string>>;
	readonly attributes: Readonly<Record<string, FlagContextValue>>;
}

/** The normalized user plus what normalization discarded, for one diagnostic warning. */
export interface UserNormalization {
	readonly user: FFPUser;
	/** Dropped entries as `identifiers.<key>` or `attributes.<key>`, in enumeration order. */
	readonly droppedEntries: readonly string[];
	/** Members treated as empty: `user`, `identifiers`, or `attributes`. */
	readonly emptyMembers: readonly string[];
}

type UserMember = 'identifiers' | 'attributes';

/**
 * Normalize a caller-supplied user without throwing.
 *
 * Keeps string identifier values and string, boolean, or finite-number attribute values. A user or
 * member that is not a non-null, non-array object, or that cannot be read or enumerated, is treated
 * as empty. An absent `attributes` member is empty without being reported. The result is a copy, so
 * later caller mutation cannot change it.
 */
export function normalizeUser(user: unknown): UserNormalization {
	const droppedEntries: string[] = [];
	const emptyMembers: string[] = [];

	if (!isRecord(user)) {
		emptyMembers.push('user');
		return {
			user: freezeUser(createMap<string>(), createMap<FlagContextValue>()),
			droppedEntries,
			emptyMembers,
		};
	}

	const identifiers = copyValidEntries(
		user,
		'identifiers',
		isString,
		droppedEntries,
		emptyMembers,
		false,
	);
	const attributes = copyValidEntries(
		user,
		'attributes',
		isFlagContextValue,
		droppedEntries,
		emptyMembers,
		true,
	);

	return { user: freezeUser(identifiers, attributes), droppedEntries, emptyMembers };
}

/** The user before any initialization attempt: frozen, null-prototype, and empty. */
export const EMPTY_USER: FFPUser = freezeUser(createMap<string>(), createMap<FlagContextValue>());

/** Whether normalization discarded anything that the caller should be warned about. */
export function hasNormalizationFindings(normalization: UserNormalization): boolean {
	return normalization.droppedEntries.length > 0 || normalization.emptyMembers.length > 0;
}

function copyValidEntries<T>(
	user: Record<string, unknown>,
	member: UserMember,
	isValid: (value: unknown) => value is T,
	droppedEntries: string[],
	emptyMembers: string[],
	absentIsEmpty: boolean,
): Record<string, T> {
	const copy = createMap<T>();

	let entries: Array<[string, unknown]>;
	try {
		const value: unknown = user[member];
		if (value === undefined && absentIsEmpty) {
			return copy;
		}
		if (!isRecord(value)) {
			emptyMembers.push(member);
			return copy;
		}
		entries = Object.entries(value);
	} catch {
		emptyMembers.push(member);
		return copy;
	}

	for (const [key, value] of entries) {
		if (isValid(value)) {
			copy[key] = value;
		} else {
			droppedEntries.push(`${member}.${key}`);
		}
	}
	return copy;
}

function freezeUser(
	identifiers: Record<string, string>,
	attributes: Record<string, FlagContextValue>,
): FFPUser {
	return Object.freeze({
		identifiers: Object.freeze(identifiers),
		attributes: Object.freeze(attributes),
	});
}

/** Null-prototype map, so keys such as `__proto__` are stored as ordinary entries. */
function createMap<T>(): Record<string, T> {
	return Object.create(null) as Record<string, T>;
}

function isFlagContextValue(value: unknown): value is FlagContextValue {
	return (
		typeof value === 'string' ||
		typeof value === 'boolean' ||
		(typeof value === 'number' && Number.isFinite(value))
	);
}

/** Object check that never throws, including for revoked proxies. */
function isRecord(value: unknown): value is Record<string, unknown> {
	try {
		return typeof value === 'object' && value !== null && !Array.isArray(value);
	} catch {
		return false;
	}
}
