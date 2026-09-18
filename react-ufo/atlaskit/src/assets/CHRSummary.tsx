import type { AssetsReporter } from '../common';
import type { ResourceEntry } from '../resource-timing/common/types';
import { calculateTransferType } from './calculateTransferType';
import { round } from './round';
import { DISK_KEY, MEMORY_KEY, NETWORK_KEY } from './utils';

export class CHRSummary {
	bundles: {
		mem: number;
		disk: number;
		net: number;
	} = { [MEMORY_KEY]: 0, [DISK_KEY]: 0, [NETWORK_KEY]: 0 };

	bundlesCount = 0;

	size: {
		mem: number;
		disk: number;
		net: number;
	} = { [MEMORY_KEY]: 0, [DISK_KEY]: 0, [NETWORK_KEY]: 0 };

	sizeTotal = 0;

	add(asset: ResourceEntry): void {
		const encodedSize = asset.encodedSize || 0;
		const type = calculateTransferType(
			asset.name,
			asset.initiatorType,
			asset.duration,
			asset.transferSize,
		);
		if (type === null) {
			return;
		}
		this.bundles[type] += 1;
		this.bundlesCount += 1;
		this.size[type] += encodedSize;
		this.sizeTotal += encodedSize;
	}

	static makePayload(summary: CHRSummary): AssetsReporter {
		const { size, bundlesCount, sizeTotal } = summary;
		const cachedSize = size[MEMORY_KEY] + size[DISK_KEY];
		const sizeRatio = round(cachedSize / summary.sizeTotal);
		return {
			size: sizeTotal,
			chr: sizeRatio,
			count: bundlesCount,
		};
	}
}
