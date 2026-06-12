import { COMMERCIAL, FEDRAMP_MODERATE, ISOLATED_CLOUD } from '../../common/constants';
import { cloudEnvironment } from '../perimeter';

export type BoundaryUrlMap = {
	[ISOLATED_CLOUD]?: URL | null;
	[FEDRAMP_MODERATE]?: URL | null;
	[COMMERCIAL]?: URL | null;
	default: URL | null;
};

/**
 * Resolves a user-provided URL based on the current boundary.
 *
 * Given a map of boundary keys to URL objects, returns the URL associated with the current boundary.
 * Pass null for a boundary key to explicitly opt out of returning a URL for that boundary.
 * Resolution order:
 * 1. Specific boundary key ('isolated-cloud', 'fedramp-moderate', or 'commercial')
 * 2. 'default' key (always required as a fallback)
 *
 * Note: URL values are constructed by the caller using `new URL(...)`. Invalid URL strings will
 * throw a TypeError.
 *
 * @param urls - A map of boundary keys to URL objects or null. The 'default' key is required.
 * @returns The URL for the current boundary, null if explicitly opted out, falling back to 'default' if no specific key matched
 *
 * @example
 * const url = resolveProvidedUrlByBoundary({
 *   'isolated-cloud':   new URL('https://ic.example.com'),
 *   'fedramp-moderate': null, // explicitly no URL in FedRAMP
 *   default:            new URL('https://example.com'),
 * });
 */
export function resolveProvidedUrlByBoundary(urls: BoundaryUrlMap): URL | null {
	const env = cloudEnvironment();

	if (env !== undefined) {
		if (env.type === ISOLATED_CLOUD && urls[ISOLATED_CLOUD] !== undefined) {
			return urls[ISOLATED_CLOUD];
		}
		if (env.type !== ISOLATED_CLOUD) {
			if (env.perimeter === FEDRAMP_MODERATE && urls[FEDRAMP_MODERATE] !== undefined) {
				return urls[FEDRAMP_MODERATE];
			}
			if (env.perimeter === COMMERCIAL && urls[COMMERCIAL] !== undefined) {
				return urls[COMMERCIAL];
			}
		}
	}

	return urls['default'];
}
