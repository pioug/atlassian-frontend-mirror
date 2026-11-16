/** Hashing stays behind the lazily loaded exposure delivery boundary. */
import type { IHasher } from 'hash-wasm';

import { localHash64 } from './local-hash';
import { createXXHash3 } from './xxhash3';

export const BROWSER_EXPOSURE_DOMAIN = 'ffp-exp-v1';
export const BROWSER_EXPOSURE_KEY_PREFIX = 'ffp-exp-v1:';
export type ExposureHasher = (identity: string) => string | undefined;
let initialization: Promise<void> | undefined;
let hasher: IHasher | undefined;
let fallback = false;
let encoder: TextEncoder | undefined;

/** Initialize once. Initialization or runtime WASM failure permanently selects local fallback. */
export function initializeExposureHash(): Promise<void> {
	initialization ??= Promise.resolve()
		.then(() => createXXHash3(0, 0))
		.then(
			(value) => {
				hasher = value;
			},
			() => {
				fallback = true;
			},
		);
	return initialization;
}

/** Hash once without retaining the identity; both implementations produce the same key. */
export function exposureDigest(identity: string): string | undefined {
	if (fallback) return localExposureDigest(identity);
	try {
		if (hasher === undefined) return undefined;
		return (
			BROWSER_EXPOSURE_KEY_PREFIX +
			hasher
				.init()
				.update(BROWSER_EXPOSURE_DOMAIN + '\0')
				.update(identity)
				.digest('hex')
		);
	} catch {
		fallback = true;
		hasher = undefined;
		return localExposureDigest(identity);
	}
}

/** Hash the same canonical bytes with the JavaScript XXH3 fallback. */
export function localExposureDigest(identity: string): string | undefined {
	try {
		encoder ??= new TextEncoder();
		return (
			BROWSER_EXPOSURE_KEY_PREFIX +
			localHash64(encoder.encode(BROWSER_EXPOSURE_DOMAIN + '\0' + identity))
		);
	} catch {
		return undefined;
	}
}
