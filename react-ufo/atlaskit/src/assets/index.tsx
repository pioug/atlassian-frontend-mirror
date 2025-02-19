import type { AssetsClassification, AssetsData, AssetsReporter } from '../common';
import type { ResourceTiming, ResourceTimings } from '../resource-timing';

import { calculateTransferType, DISK_KEY, MEMORY_KEY, NETWORK_KEY, round } from './utils';
export class CHRSummary {
	bundles = { [MEMORY_KEY]: 0, [DISK_KEY]: 0, [NETWORK_KEY]: 0 };

	bundlesCount = 0;

	size = { [MEMORY_KEY]: 0, [DISK_KEY]: 0, [NETWORK_KEY]: 0 };

	sizeTotal = 0;

	add(asset: ResourceTiming) {
		const size = 'size' in asset ? asset.size : undefined;
		const encodedSize = 'encodedSize' in asset ? Number(asset.encodedSize) : 0;
		const type = calculateTransferType(asset.type, asset.duration, size);
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

export class CHRReporter {
	all = new CHRSummary();
	allAtlassian = new CHRSummary();
	preloaded = new CHRSummary();

	constructor() {}

	get(
		resourceTimings: ResourceTimings,
		assetsClassification: AssetsClassification,
	): AssetsData | null {
		try {
			Object.entries(resourceTimings).map(([label, entry]) => {
				if (assetsClassification.all) {
					this.all.add(entry);
				}
				if (assetsClassification.allAtlassian({ label, entry })) {
					this.allAtlassian.add(entry);
				}
				if (assetsClassification.preloaded({ label, entry })) {
					this.preloaded.add(entry);
				}
			});
			if (this.all.bundlesCount === 0) {
				return null;
			}
			return {
				all: CHRSummary.makePayload(this.all),
				allAtlassian: CHRSummary.makePayload(this.allAtlassian),
				preloaded: CHRSummary.makePayload(this.preloaded),
			};
		} catch (error: unknown) {
			return null;
		}
	}
}
