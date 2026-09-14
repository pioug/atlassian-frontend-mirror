import { calculateTransferType } from './calculate-transfer-type';
import { isCacheableType } from './is-cacheable-type';
import { BACKEND_RESOURCE_TIMING_INITIATOR_TYPES } from './resource-timing-initiator-types';
import {
	AVATAR_RESOURCE_LABEL,
	FILE_RESOURCE_LABEL,
	IMAGE_RESOURCE_LABEL,
	OTHER_JS_RESOURCE_TYPE,
	num,
} from './shape-resource-timing';

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
