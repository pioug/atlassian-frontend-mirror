import type { ResourceTiming } from '../types';
import type { CompactResourceTimings, LegacyResourceTimingEntry } from './compact-resource-timing';

const RESOURCE_CODE_TO_TYPE = ['script', 'link', 'fetch', 'other', 'xmlhttprequest'] as const;

const TRANSFER_CODE_TO_TYPE = ['network', 'memory', 'disk'] as const;

function decodeType(type: number | string): string {
	return typeof type === 'number' ? (RESOURCE_CODE_TO_TYPE[type] ?? String(type)) : type;
}

function decodeTransferType(transferType: unknown): unknown {
	return typeof transferType === 'number'
		? (TRANSFER_CODE_TO_TYPE[transferType] ?? transferType)
		: transferType;
}

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function unpackResourceTimings(
	resourceTimings: CompactResourceTimings | LegacyResourceTimingEntry[] | undefined,
): LegacyResourceTimingEntry[] {
	if (!resourceTimings) {
		return [];
	}

	if (Array.isArray(resourceTimings)) {
		return resourceTimings;
	}

	if (resourceTimings.v !== 1 || !Array.isArray(resourceTimings.r)) {
		return [];
	}

	return resourceTimings.r.map((entry) => {
		const data: Record<string, unknown> = {
			startTime: entry.st,
			duration: entry.du,
			workerStart: entry.ws,
			fetchStart: entry.fs,
			type: decodeType(entry.rt),
		};

		if ('tb' in entry) {
			data.ttfb = entry.tb;
		}
		if ('rq' in entry) {
			data.requestStart = entry.rq;
		}
		if ('tr' in entry) {
			data.transferType = decodeTransferType(entry.tr);
		}
		if ('sv' in entry) {
			data.serverTime = entry.sv;
		}
		if ('nw' in entry) {
			data.networkTime = entry.nw;
		}
		if ('es' in entry) {
			data.encodedSize = entry.es;
		}
		if ('ds' in entry) {
			data.decodedSize = entry.ds;
		}
		if ('sz' in entry) {
			data.size = entry.sz;
		}
		if ('ct' in entry) {
			data.count = entry.ct;
		}

		return {
			label: entry.l,
			data: data as unknown as ResourceTiming,
		};
	});
}
