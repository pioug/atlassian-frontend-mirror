/**
 * @jest-environment node
 */

import { FlagClient } from '../client';
import type { FlagUser } from '../types';
import { normalizeUser } from '../user-normalization';
import {
	initializedClient,
	result,
	TEST_CLIENT_OPTIONS,
	validPayload,
} from './_utils/test-payload-helper';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('normalizeUser', () => {
	it('keeps string identifiers and string, boolean, or finite-number attributes', () => {
		const normalization = normalizeUser({
			identifiers: { atlassianAccountId: 'abc', tenantId: 'tenant-1' },
			attributes: { plan: 'premium', beta: false, seats: 25, ratio: 0.5, offset: -0 },
		});

		expect(normalization.user.identifiers).toEqual({
			atlassianAccountId: 'abc',
			tenantId: 'tenant-1',
		});
		expect(normalization.user.attributes).toEqual({
			plan: 'premium',
			beta: false,
			seats: 25,
			ratio: 0.5,
			offset: -0,
		});
		expect(normalization.droppedEntries).toEqual([]);
		expect(normalization.emptyMembers).toEqual([]);
	});

	it('drops invalid identifier and attribute entries and reports their keys', () => {
		const normalization = normalizeUser({
			identifiers: { atlassianAccountId: 'abc', tenantId: 42, orgId: null, siteId: undefined },
			attributes: {
				plan: 'premium',
				nested: { deep: true },
				list: ['a'],
				nan: Number.NaN,
				infinite: Number.POSITIVE_INFINITY,
				negativeInfinite: Number.NEGATIVE_INFINITY,
				big: BigInt(1),
				missing: null,
			},
		});

		expect(normalization.user.identifiers).toEqual({ atlassianAccountId: 'abc' });
		expect(normalization.user.attributes).toEqual({ plan: 'premium' });
		expect(normalization.droppedEntries).toEqual([
			'identifiers.tenantId',
			'identifiers.orgId',
			'identifiers.siteId',
			'attributes.nested',
			'attributes.list',
			'attributes.nan',
			'attributes.infinite',
			'attributes.negativeInfinite',
			'attributes.big',
			'attributes.missing',
		]);
		expect(normalization.emptyMembers).toEqual([]);
	});

	it('treats an absent attributes member as empty without reporting it', () => {
		const normalization = normalizeUser({ identifiers: { atlassianAccountId: 'abc' } });

		expect(normalization.user.attributes).toEqual({});
		expect(normalization.emptyMembers).toEqual([]);
	});

	it.each([
		['null', null],
		['undefined', undefined],
		['a string', 'user-a'],
		['an array', [{ identifiers: {} }]],
	])('treats a %s user as empty', (_description, user) => {
		const normalization = normalizeUser(user);

		expect(normalization.user.identifiers).toEqual({});
		expect(normalization.user.attributes).toEqual({});
		expect(normalization.emptyMembers).toEqual(['user']);
	});

	it.each([
		['missing', {}],
		['null', { identifiers: null }],
		['an array', { identifiers: ['abc'] }],
		['a string', { identifiers: 'abc' }],
	])('treats %s identifiers as empty', (_description, user) => {
		const normalization = normalizeUser(user);

		expect(normalization.user.identifiers).toEqual({});
		expect(normalization.emptyMembers).toEqual(['identifiers']);
	});

	it.each([
		['null', null],
		['an array', ['premium']],
		['a number', 7],
	])('treats %s attributes as empty', (_description, attributes) => {
		const normalization = normalizeUser({ identifiers: {}, attributes });

		expect(normalization.user.attributes).toEqual({});
		expect(normalization.emptyMembers).toEqual(['attributes']);
	});

	it('treats members whose read or enumeration throws as empty without throwing', () => {
		const revoked = Proxy.revocable({}, {});
		revoked.revoke();
		const user = {
			get identifiers(): Record<string, string> {
				throw new Error('getter failed');
			},
			attributes: revoked.proxy,
		};

		const normalization = normalizeUser(user);

		expect(normalization.user.identifiers).toEqual({});
		expect(normalization.user.attributes).toEqual({});
		expect(normalization.emptyMembers).toEqual(['identifiers', 'attributes']);
	});

	it('treats a revoked proxy user as empty without throwing', () => {
		const revoked = Proxy.revocable({}, {});
		revoked.revoke();

		expect(normalizeUser(revoked.proxy).emptyMembers).toEqual(['user']);
	});

	it('stores __proto__ as an ordinary key on a null-prototype map', () => {
		const identifiers = JSON.parse(
			'{"__proto__":"proto-value","atlassianAccountId":"abc"}',
		) as Record<string, string>;

		const normalized = normalizeUser({ identifiers }).user.identifiers;

		expect(Object.getPrototypeOf(normalized)).toBeNull();
		expect(Object.keys(normalized)).toEqual(['__proto__', 'atlassianAccountId']);
		// eslint-disable-next-line no-proto -- asserts `__proto__` is stored as an ordinary own key
		expect(normalized['__proto__']).toBe('proto-value');
	});

	it('copies and freezes the normalized user', () => {
		const identifiers: Record<string, string> = { atlassianAccountId: 'abc' };
		const attributes: Record<string, string> = { plan: 'premium' };

		const normalized = normalizeUser({ identifiers, attributes }).user;
		identifiers.atlassianAccountId = 'changed';
		attributes.plan = 'changed';

		expect(normalized.identifiers.atlassianAccountId).toBe('abc');
		expect(normalized.attributes.plan).toBe('premium');
		expect(Object.isFrozen(normalized)).toBe(true);
		expect(Object.isFrozen(normalized.identifiers)).toBe(true);
		expect(Object.isFrozen(normalized.attributes)).toBe(true);
	});
});

describe('FlagClient user normalization', () => {
	it('initializes with an empty identifier map', () => {
		const client = new FlagClient(TEST_CLIENT_OPTIONS);

		expect(client.initialize(() => validPayload(), { identifiers: {} })).toEqual({
			initialized: true,
		});
	});

	it('succeeds and warns exactly once listing dropped keys but not values', () => {
		const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
		const client = new FlagClient(TEST_CLIENT_OPTIONS);

		const outcome = client.initialize(() => validPayload(), {
			identifiers: { atlassianAccountId: 'abc', tenantId: 12345 },
			attributes: { plan: 'premium', ratio: Number.NaN, nested: { secret: 'hidden' } },
		} as unknown as FlagUser);

		expect(outcome).toEqual({ initialized: true });
		expect(warnSpy).toHaveBeenCalledTimes(1);
		expect(warnSpy).toHaveBeenCalledWith('Flag client user normalization dropped invalid entries', {
			operation: 'initialize',
			droppedEntries: ['identifiers.tenantId', 'attributes.ratio', 'attributes.nested'],
			emptyMembers: [],
			tip: 'Pass identifier values as strings and attribute values as strings, booleans, or finite numbers.',
		});
		expect(JSON.stringify(warnSpy.mock.calls)).not.toMatch(/12345|hidden|NaN/);
	});

	it('does not warn when nothing is dropped', () => {
		const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

		initializedClient();

		expect(warnSpy).not.toHaveBeenCalled();
	});

	it('warns once for normalization and separately for a failure in the same attempt', () => {
		const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
		const client = new FlagClient(TEST_CLIENT_OPTIONS);

		client.initialize(
			() => {
				throw new Error('provider failed');
			},
			{ identifiers: null } as unknown as FlagUser,
		);

		expect(warnSpy.mock.calls.map(([message]) => message)).toEqual([
			'Flag client user normalization dropped invalid entries',
			'Flag client initialization failed',
		]);
	});

	it('labels replacement normalization warnings with the replace operation', () => {
		const client = initializedClient();
		const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

		expect(
			client.replace(() => validPayload({ flags: { 'flag-a': result() } }), {
				identifiers: { atlassianAccountId: 7 },
			} as unknown as FlagUser),
		).toEqual({ replaced: true });

		expect(warnSpy).toHaveBeenCalledTimes(1);
		expect(warnSpy).toHaveBeenCalledWith(
			'Flag client user normalization dropped invalid entries',
			expect.objectContaining({
				operation: 'replace',
				droppedEntries: ['identifiers.atlassianAccountId'],
			}),
		);
	});

	it('ignores caller mutation of the user after initialization', () => {
		const identifiers: Record<string, string> = { AtlassianAccountId: 'abc' };
		const client = initializedClient(validPayload({ flags: { 'flag-a': result() } }), {
			identifiers,
		});

		identifiers.AtlassianAccountId = 'changed';

		expect(client.getBooleanDetails('flag-a', false).metadata.identifierValue).toBe('abc');
	});
});
