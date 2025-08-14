import { getConfig as getConfigUFO } from '../config';
import { roundEpsilon } from '../round-number';

import type { ResourceEntry, ResourceTiming, ResourceTimings } from './common/types';
import { getConfig } from './common/utils/config';
import { filterResourceTimings } from './common/utils/resource-timing-buffer';

const alwaysCacheableTypes = ['script', 'link'];
const resourceTypes = ['fetch', 'xmlhttprequest'];
const CACHE_NETWORK = 'network';
const CACHE_MEMORY = 'memory';
const CACHE_DISK = 'disk';

function isCacheableType(url: string, type: string) {
	if (alwaysCacheableTypes.includes(type)) {
		return true;
	}

	if (type === 'other' && url.includes('.js')) {
		return true;
	}

	return false;
}

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
function calculateTransferType(name: string, type: string, duration: number, size: number | void) {
	if (!isCacheableType(name, type)) {
		return CACHE_NETWORK;
	}

	if ((size === undefined || size === 0) && duration === 0) {
		return CACHE_MEMORY;
	}
	if (size === 0 && duration > 0) {
		return CACHE_DISK;
	}
	if (size === undefined) {
		return null;
	}

	return CACHE_NETWORK;
}

function getWindowObject() {
	return typeof window !== 'undefined' && !!window ? window : undefined;
}

function hasAccessToResourceSize(
	url: string,
	type: string,
	entry: ResourceEntry,
	hasTimingHeaders: (url: string, entry: ResourceEntry) => boolean,
) {
	return (
		!isCacheableType(url, type) ||
		url.includes('localhost') ||
		(!!getWindowObject() && url.includes(window.location.hostname)) ||
		hasTimingHeaders(url, entry)
	);
}

function getReportedInitiatorTypes(xhrEnabled: boolean) {
	const ufoConfig = getConfigUFO();
	if (!ufoConfig?.allowedResources) {
		if (xhrEnabled) {
			return ['script', 'link', 'fetch', 'other', 'xmlhttprequest'];
		}
		return ['script', 'link', 'fetch', 'other'];
	}
	return ufoConfig.allowedResources;
}

function evaluateAccessToResourceTimings(_: string, entry: ResourceEntry) {
	return !(entry.responseStart === 0 && entry.startTime > entry.responseStart);
}

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
function getSizeObject(size?: number | void) {
	return size !== undefined ? { size } : null;
}

function getNetworkData(
	item: ResourceEntry,
	eventStart: number,
	hasTimingHeaders: (
		url: string,
		entry: ResourceEntry,
	) => boolean = evaluateAccessToResourceTimings,
) {
	const {
		name,
		duration,
		transferSize,
		initiatorType,
		responseStart,
		requestStart,
		serverTime,
		networkTime,
		encodedSize,
		decodedSize,
	} = item;

	const ttfb = roundEpsilon(responseStart - eventStart);
	const requestStartRelative = roundEpsilon(requestStart - eventStart);

	if (!hasAccessToResourceSize(name, initiatorType, item, hasTimingHeaders)) {
		return {};
	}

	if (isCacheableType(name, initiatorType)) {
		const transferType = calculateTransferType(name, initiatorType, duration, transferSize);

		return {
			ttfb,
			transferType,
			serverTime,
			networkTime,
			encodedSize,
			decodedSize,
			...getSizeObject(transferSize),
		};
	}

	return {
		ttfb,
		serverTime,
		networkTime,
		requestStart: requestStartRelative,
		...getSizeObject(transferSize),
	};
}

export function getResourceTimings(interactionStart: number, interactionEnd: number) {
	const resourceTiming: ResourceTimings = {};
	if (interactionStart === null) {
		return resourceTiming;
	}

	const resources = filterResourceTimings(interactionStart, interactionEnd);

	if (!resources?.length) {
		return resourceTiming;
	}

	const { xhrFilter, sanitiseEndpoints, mapResources, hasTimingHeaders } = getConfig();
	const reportedInitiatorTypes = getReportedInitiatorTypes(!!xhrFilter);

	resources.forEach((item) => {
		if (!reportedInitiatorTypes.includes(item.initiatorType)) {
			return;
		}

		const { name, startTime, duration, workerStart, fetchStart, initiatorType } = item;

		if (!name) {
			return;
		}

		if (
			initiatorType === 'xmlhttprequest' &&
			(xhrFilter === undefined || xhrFilter(name) === false)
		) {
			return;
		}

		if (initiatorType === 'other' && !name.includes('.js')) {
			return;
		}

		const url = resourceTypes.includes(initiatorType)
			? sanitiseEndpoints(name)
			: mapResources(name);

		if (!url) {
			return;
		}

		if (resourceTiming[url]) {
			resourceTiming[url].count = (resourceTiming[url].count || 1) + 1;
			return;
		}

		resourceTiming[url] = {
			startTime: roundEpsilon(startTime - interactionStart),
			duration: roundEpsilon(duration),
			workerStart: Math.max(roundEpsilon(workerStart - interactionStart), 0),
			fetchStart: Math.max(roundEpsilon(fetchStart - interactionStart), 0),
			type: initiatorType,
			...getNetworkData(item, interactionStart, hasTimingHeaders),
		} as ResourceTiming;
	});

	return resourceTiming;
}
