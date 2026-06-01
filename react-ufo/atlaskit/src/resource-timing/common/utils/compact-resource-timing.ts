import { roundEpsilon } from '../../../round-number';
import type { ResourceTiming } from '../types';

type LegacyResourceTimingEntry = {
	label: string;
	data: ResourceTiming;
};

export type CompactResourceTimingEntry = {
	/** label */
	l: string;
	/** resource type */
	rt: number | string;
	/** startTime */
	st: number;
	/** duration */
	du: number;
	/** workerStart */
	ws: number;
	/** fetchStart */
	fs: number;
	/** ttfb */
	tb?: number;
	/** requestStart */
	rq?: number;
	/** transferType */
	tr?: number | string | null;
	/** serverTime */
	sv?: number;
	/** networkTime */
	nw?: number;
	/** encodedSize */
	es?: number | null;
	/** decodedSize */
	ds?: number | null;
	/** size */
	sz?: number;
	/** count */
	ct?: number;
};

export type CompactResourceTimings = {
	v: 1;
	r: CompactResourceTimingEntry[];
};

const RESOURCE_TYPE_TO_CODE: Record<string, number> = {
	script: 0,
	link: 1,
	fetch: 2,
	other: 3,
	xmlhttprequest: 4,
};

const RESOURCE_CODE_TO_TYPE = ['script', 'link', 'fetch', 'other', 'xmlhttprequest'] as const;

const TRANSFER_TYPE_TO_CODE: Record<string, number> = {
	network: 0,
	memory: 1,
	disk: 2,
};

const TRANSFER_CODE_TO_TYPE = ['network', 'memory', 'disk'] as const;

function encodeType(type: string): number | string {
	return RESOURCE_TYPE_TO_CODE[type] ?? type;
}

function decodeType(type: number | string): string {
	return typeof type === 'number' ? (RESOURCE_CODE_TO_TYPE[type] ?? String(type)) : type;
}

function encodeTransferType(transferType: unknown): number | string | null | unknown {
	if (typeof transferType !== 'string') {
		return transferType;
	}
	return TRANSFER_TYPE_TO_CODE[transferType] ?? transferType;
}

function decodeTransferType(transferType: unknown): unknown {
	return typeof transferType === 'number'
		? (TRANSFER_CODE_TO_TYPE[transferType] ?? transferType)
		: transferType;
}

function hasSerializableField(data: ResourceTiming, field: keyof ResourceTiming): boolean {
	return Object.prototype.hasOwnProperty.call(data, field) && data[field] !== undefined;
}

function roundTimingValue(value: number | undefined): number | undefined {
	return typeof value === 'number' ? roundEpsilon(value) : value;
}

export function compactResourceTimings(
	resourceTimings: LegacyResourceTimingEntry[],
): CompactResourceTimings | LegacyResourceTimingEntry[] {
	if (resourceTimings.length === 0) {
		return resourceTimings;
	}

	const compact: CompactResourceTimings = {
		v: 1,
		r: resourceTimings.map(({ label, data }) => {
			const entry: CompactResourceTimingEntry = {
				l: label,
				rt: encodeType(data.type),
				st: roundEpsilon(data.startTime),
				du: roundEpsilon(data.duration),
				ws: roundEpsilon(data.workerStart),
				fs: roundEpsilon(data.fetchStart),
			};

			if (hasSerializableField(data, 'ttfb')) {
				entry.tb = roundTimingValue(data.ttfb);
			}
			if (hasSerializableField(data, 'requestStart')) {
				entry.rq = roundTimingValue(data.requestStart);
			}
			if (hasSerializableField(data, 'transferType')) {
				entry.tr = encodeTransferType(data.transferType) as number | string | null;
			}
			if (hasSerializableField(data, 'serverTime')) {
				entry.sv = roundTimingValue(data.serverTime);
			}
			if (hasSerializableField(data, 'networkTime')) {
				entry.nw = roundTimingValue(data.networkTime);
			}
			if (hasSerializableField(data, 'encodedSize')) {
				entry.es = data.encodedSize === null ? null : roundTimingValue(data.encodedSize);
			}
			if (hasSerializableField(data, 'decodedSize')) {
				entry.ds = data.decodedSize === null ? null : roundTimingValue(data.decodedSize);
			}
			if (hasSerializableField(data, 'size')) {
				entry.sz = roundTimingValue(data.size);
			}
			if (hasSerializableField(data, 'count')) {
				entry.ct = roundTimingValue(data.count);
			}

			return entry;
		}),
	};

	return JSON.stringify(compact).length < JSON.stringify(resourceTimings).length
		? compact
		: resourceTimings;
}

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
