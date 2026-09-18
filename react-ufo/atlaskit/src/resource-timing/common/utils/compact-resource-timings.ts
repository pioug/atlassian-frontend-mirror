import { roundEpsilon } from '../../../round-number';
import type { ResourceTiming } from '../types';
import type {
	CompactResourceTimingEntry,
	CompactResourceTimings,
	LegacyResourceTimingEntry,
} from './compact-resource-timing';

const RESOURCE_TYPE_TO_CODE: Record<string, number> = {
	script: 0,
	link: 1,
	fetch: 2,
	other: 3,
	xmlhttprequest: 4,
};

const TRANSFER_TYPE_TO_CODE: Record<string, number> = {
	network: 0,
	memory: 1,
	disk: 2,
};

function encodeType(type: string): number | string {
	return RESOURCE_TYPE_TO_CODE[type] ?? type;
}

function encodeTransferType(transferType: unknown): number | string | null | unknown {
	if (typeof transferType !== 'string') {
		return transferType;
	}
	return TRANSFER_TYPE_TO_CODE[transferType] ?? transferType;
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
