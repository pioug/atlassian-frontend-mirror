import type { NavigationMetrics } from '../../../create-payload/utils/get-navigation-metrics';

import { BACKEND_RESOURCE_TIMING_INITIATOR_TYPES } from './resource-timing-initiator-types';
import { calculateTransferType, isCacheableType } from './transfer-type';

const num = (v: unknown): number => (typeof v === 'number' ? Math.round(v) : 0);

// Accepted source values from forge-cdn bridge:
//   - 'forge-framework' (PR #775+) — Forge runtime assets (bridge.js, iframeResizer*, etc.)
//   - 'forge-app'       (PR #775+) — app-author assets on installation-scoped subdomain
//   - 'external'        (both schemes) — anything outside Atlassian-controlled domains
//   - 'internal'        (PR #769 only, LEGACY) — bridges still emit this until PR #775
//                       rolls out everywhere; safe to remove from this allowlist after
//                       the rollout has been stable for a release cycle. Do NOT remove
//                       'external' during that cleanup — it's a first-class value in
//                       both the old and new schemes.
const ACCEPTED_SOURCES: ReadonlyArray<unknown> = [
	'forge-framework',
	'forge-app',
	'external',
	'internal',
];

const ASSET_RESOURCE_TYPES = new Set(['script', 'link', 'css']);
const OTHER_JS_RESOURCE_TYPE = 'other';
const SCRIPT_EXTENSIONS = ['.js', '.mjs', '.cjs'];
const STYLESHEET_EXTENSIONS = ['.css'];
const ASSET_EXTENSIONS = [...SCRIPT_EXTENSIONS, ...STYLESHEET_EXTENSIONS];
const FILE_OR_MEDIA_EXTENSIONS = [
	'.pdf',
	'.doc',
	'.docx',
	'.xls',
	'.xlsx',
	'.ppt',
	'.pptx',
	'.csv',
	'.zip',
	'.heic',
	'.mov',
	'.mp4',
	'.mp3',
	'.wav',
	'.woff',
	'.woff2',
	'.ttf',
	'.otf',
];
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico'];
const IMAGE_RESOURCE_LABEL = '<image-resource>';
const FILE_RESOURCE_LABEL = '<file-resource>';
const AVATAR_RESOURCE_LABEL = '<avatar-resource>';
const ATTACHMENT_OR_DOWNLOAD_PATH_PATTERNS = [
	/(?:^|\/)secure\/attachment(?:\/|$)/,
	/(?:^|\/)download\/attachments(?:\/|$)/,
	/(?:^|\/)wiki\/download(?:\/|$)/,
	/(?:^|\/)child\/attachment(?:\/|$)/,
	/(?:^|\/)attachment(?:\/|$)/,
];

function stripQueryAndHash(value: string): string {
	return value.split(/[?#]/, 1)[0] ?? '';
}

function getSanitizedLastPathSegment(value: string): string {
	const trimmedValue = stripQueryAndHash(value).replace(/\/+$/, '');
	if (!trimmedValue.includes('/')) {
		return trimmedValue;
	}
	return trimmedValue.split('/').filter(Boolean).pop() ?? trimmedValue;
}

function hasExtension(value: string, extensions: ReadonlyArray<string>): boolean {
	const path = stripQueryAndHash(value).toLowerCase();
	return extensions.some((extension) => path.endsWith(extension));
}

function hasAttachmentOrDownloadPath(value: string): boolean {
	return ATTACHMENT_OR_DOWNLOAD_PATH_PATTERNS.some((pattern) => pattern.test(value));
}

function isAvatarResource(value: string): boolean {
	return (
		value.includes('avatar-management') ||
		value.includes('/initials/') ||
		value.includes('%2finitials%2f') ||
		value.includes('viewavatar')
	);
}

function getSanitizedBackendResourceLabel(rawName: string): string {
	const querylessName = stripQueryAndHash(rawName);
	const normalizedRawName = rawName.toLowerCase();
	const normalizedQuerylessName = querylessName.toLowerCase();

	if (isAvatarResource(normalizedRawName)) {
		return AVATAR_RESOURCE_LABEL;
	}
	if (hasExtension(normalizedQuerylessName, IMAGE_EXTENSIONS)) {
		return IMAGE_RESOURCE_LABEL;
	}
	if (
		hasAttachmentOrDownloadPath(normalizedQuerylessName) ||
		hasExtension(normalizedQuerylessName, FILE_OR_MEDIA_EXTENSIONS)
	) {
		return FILE_RESOURCE_LABEL;
	}

	return querylessName;
}

function isBackendResourceTiming(initiatorType: string): boolean {
	return BACKEND_RESOURCE_TIMING_INITIATOR_TYPES.has(initiatorType);
}

function isScriptOrStylesheetResource(rawName: string, initiatorType: string): boolean {
	if (initiatorType === OTHER_JS_RESOURCE_TYPE) {
		return hasExtension(rawName, ASSET_EXTENSIONS);
	}
	if (!ASSET_RESOURCE_TYPES.has(initiatorType)) {
		return false;
	}
	return hasExtension(rawName, ASSET_EXTENSIONS);
}

/**
 * Shapes a raw iframe navigation-timing event data object into the same field set
 * produced by getNavigationMetrics() in create-payload/utils/get-navigation-metrics.ts,
 * so that iframe navigation timings are consistent with host-page navigation timings.
 *
 * Deliberately omitted fields (same rationale as host-page):
 *   domComplete, domContentLoadedEventStart/End, domInteractive, loadEventStart/End
 * Also dropped: iframe-specific pre-computed `metrics` object, top-level `startTime`/`duration`
 *
 * The iframe event structure is: { name, elapsed, payload: { name, startTime, duration, type,
 *   redirectCount, timing: { ... }, metrics: { ... } } }
 */
export function shapeNavigationTimingData(
	data: Record<string, unknown>,
): Partial<NavigationMetrics> & { label: string } {
	const payload = (data?.payload || {}) as Record<string, unknown>;
	// payload.timing.* to payload.* directly. Support both shapes during rollout.
	const timing = (payload?.timing || payload) as Record<string, unknown>;

	// Trim long URLs to just the last path segment to keep payload size manageable.
	const rawName = typeof payload.name === 'string' ? payload.name : '';
	const label = rawName.includes('/')
		? (rawName.split('/').filter(Boolean).pop() ?? rawName)
		: rawName;

	return {
		label,
		// From Resource Timing spec
		redirectStart: num(timing.redirectStart),
		redirectEnd: num(timing.redirectEnd),
		fetchStart: num(timing.fetchStart),
		domainLookupStart: num(timing.domainLookupStart),
		domainLookupEnd: num(timing.domainLookupEnd),
		connectStart: num(timing.connectStart),
		connectEnd: num(timing.connectEnd),
		secureConnectionStart: num(timing.secureConnectionStart),
		requestStart: num(timing.requestStart),
		responseStart: num(timing.responseStart),
		responseEnd: num(timing.responseEnd),
		// Added in PR #769 — present in new flat shape, absent in old nested shape (defaults to 0)
		encodedBodySize: num(timing.encodedBodySize),
		decodedBodySize: num(timing.decodedBodySize),
		transferSize: num(timing.transferSize),
		// From Navigation Timing 2 spec
		redirectCount: num(payload.redirectCount),
		type: typeof payload.type === 'string' ? payload.type : undefined,
		unloadEventStart: num(timing.unloadEventStart),
		unloadEventEnd: num(timing.unloadEventEnd),
		workerStart: num(timing.workerStart),
		nextHopProtocol:
			typeof timing.nextHopProtocol === 'string' ? timing.nextHopProtocol : undefined,
	};
}

/**
 * Shapes a raw iframe resource-timing event data object into the same field set
 * produced by getResourceTimings() / getNetworkData() in resource-timing/main.ts,
 * so that iframe resource timings are consistent with host-page resource timings.
 *
 * The iframe event structure is: { name, elapsed, payload: { name, startTime, ... timing: { ... } } }
 * All timing fields live inside `payload`, with sub-timing fields inside `payload.timing`.
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function shapeResourceTimingData(
	data: Record<string, unknown>,
): Record<string, unknown> | undefined {
	const payload = (data?.payload || {}) as Record<string, unknown>;
	// payload.timing.* to payload.* directly. Support both shapes during rollout.
	const timing = (payload?.timing || payload) as Record<string, unknown>;

	const rawName = typeof payload.name === 'string' ? payload.name : '';
	const initiatorType = typeof payload.initiatorType === 'string' ? payload.initiatorType : 'other';
	const isBackendTiming = isBackendResourceTiming(initiatorType);
	if (!isBackendTiming && !isScriptOrStylesheetResource(rawName, initiatorType)) {
		return undefined;
	}
	const name = isBackendTiming
		? getSanitizedBackendResourceLabel(rawName)
		: getSanitizedLastPathSegment(rawName);
	const startTime = num(payload.startTime);
	const duration = num(payload.duration);
	const fetchStart = num(timing.fetchStart);
	const workerStart = num(timing.workerStart);
	const responseStart = num(timing.responseStart);
	const requestStart = num(timing.requestStart);
	const transferSize = typeof payload.transferSize === 'number' ? payload.transferSize : undefined;
	const encodedSize =
		typeof payload.encodedBodySize === 'number' ? payload.encodedBodySize : undefined;
	const decodedSize =
		typeof payload.decodedBodySize === 'number' ? payload.decodedBodySize : undefined;
	// serverTime / networkTime are not in the current iframe payload but kept for forward-compat
	const serverTime = typeof payload.serverTime === 'number' ? payload.serverTime : undefined;
	const networkTime = typeof payload.networkTime === 'number' ? payload.networkTime : undefined;
	const source = ACCEPTED_SOURCES.includes(payload.source) ? (payload.source as string) : undefined;

	// Base fields — always present (times are relative to interaction start from the iframe)
	const shaped: Record<string, unknown> = {
		label: name,
		startTime,
		duration,
		workerStart: Math.max(workerStart, 0),
		fetchStart: Math.max(fetchStart, 0),
		type: initiatorType,
		...(source !== undefined ? { source } : {}),
	};

	const cacheable = isCacheableType(rawName, initiatorType);

	shaped.ttfb = responseStart;
	if (serverTime !== undefined) {
		shaped.serverTime = serverTime;
	}
	if (networkTime !== undefined) {
		shaped.networkTime = networkTime;
	}
	if (transferSize !== undefined) {
		shaped.size = transferSize;
	}

	// Flag entries where timing-allow-origin headers are missing:
	// duration > 0 but all size fields are 0 means the browser withheld size data.
	if (duration > 0 && transferSize === 0 && encodedSize === 0) {
		shaped.noTA = true;
	}

	if (cacheable) {
		// CacheableResourceTiming — calculateTransferType is only meaningful for cacheable resources
		const transferType = calculateTransferType(rawName, initiatorType, duration, transferSize);
		if (transferType !== null) {
			shaped.transferType = transferType;
		}
		if (encodedSize !== undefined) {
			shaped.encodedSize = encodedSize;
		}
		if (decodedSize !== undefined) {
			shaped.decodedSize = decodedSize;
		}
	} else {
		// NonCacheableResourceTiming (fetch, xmlhttprequest, etc.)
		shaped.requestStart = requestStart;
	}

	return shaped;
}
