/** @jest-environment node */
import { xxhash3 } from 'hash-wasm';

import {
	BROWSER_EXPOSURE_DOMAIN,
	BROWSER_EXPOSURE_KEY_PREFIX,
	exposureDigest,
	initializeExposureHash,
} from '../exposure/digest';

beforeAll(async () => initializeExposureHash());

describe('browser WASM exposure digest', () => {
	it.each(['{"value":true}', '{"flagKey":"flag-🧪","value":{"a":1,"b":2}}', ''])(
		'hashes UTF-8 identity with XXHash3-64, seed zero, and the exposure domain: %s',
		async (identity) => {
			const expected = await xxhash3(BROWSER_EXPOSURE_DOMAIN + '\0' + identity, 0, 0);
			expect(exposureDigest(identity)).toBe(BROWSER_EXPOSURE_KEY_PREFIX + expected);
			expect(exposureDigest(identity)).toMatch(/^ffp-exp-v1:[0-9a-f]{16}$/);
		},
	);

	it('reuses its initialized hasher without leaking state between identities', () => {
		const first = exposureDigest('first');
		expect(exposureDigest('second')).not.toBe(first);
		expect(exposureDigest('first')).toBe(first);
	});

	it('hashes without browser crypto.subtle', () => {
		const previous = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
		try {
			Object.defineProperty(globalThis, 'crypto', { configurable: true, value: undefined });
			expect(exposureDigest('identity')).toMatch(/^ffp-exp-v1:[0-9a-f]{16}$/);
		} finally {
			if (previous !== undefined) Object.defineProperty(globalThis, 'crypto', previous);
			else Reflect.deleteProperty(globalThis, 'crypto');
		}
	});

	it('uses a domain-separated input', async () => {
		expect(exposureDigest('identity')).not.toBe(
			BROWSER_EXPOSURE_KEY_PREFIX + (await xxhash3('identity')),
		);
	});
});
