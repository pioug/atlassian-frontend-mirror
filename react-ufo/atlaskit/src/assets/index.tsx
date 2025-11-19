import { fg } from '@atlaskit/platform-feature-flags';

import type { AssetsConfig, AssetsData, AssetsReporter } from '../common';
import type { ResourceEntry } from '../resource-timing/common/types';

import {
	calculateTransferType,
	checkIfTimingsAvailable,
	DISK_KEY,
	getTypeOfRequest,
	MEMORY_KEY,
	NETWORK_KEY,
	round,
} from './utils';
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

export class CHRReporter {
	all: CHRSummary = new CHRSummary();
	allAtlassian: CHRSummary = new CHRSummary();
	preloaded: CHRSummary = new CHRSummary();
	defaultAllowedTypes: string[] = ['js'];

	get(
		resourceTimings: ResourceEntry[] | null,
		assetsConfig: AssetsConfig,
		SSRDoneTime: number | undefined,
	): AssetsData | null {
		try {
			if (resourceTimings === null) {
				return null;
			}

			resourceTimings.forEach((entry) => {
				if (!checkIfTimingsAvailable(entry)) {
					return;
				}

				const hasNanValues = fg('platform_ufo_assets_check_for_nan')
					? entry.encodedSize === undefined || entry.encodedSize === null
					: false;

				if (entry.encodedSize === entry.decodedSize || hasNanValues) {
					// incorrectly reported or lack of size
					return;
				}

				const type = getTypeOfRequest(entry);

				if (!(assetsConfig.allowedTypes || this.defaultAllowedTypes).includes(type)) {
					return;
				}

				if (assetsConfig.classification.all) {
					this.all.add(entry);
				}
				if (assetsConfig.classification.allAtlassian({ entry })) {
					this.allAtlassian.add(entry);
				}
				if (assetsConfig.classification.preloaded({ entry, SSRDoneTime })) {
					this.preloaded.add(entry);
				}
			});

			if (this.all.bundlesCount === 0) {
				return null;
			}

			const CHRData = {
				all: CHRSummary.makePayload(this.all),
				allAtlassian: CHRSummary.makePayload(this.allAtlassian),
				preloaded: CHRSummary.makePayload(this.preloaded),
			};

			return CHRData;
		} catch (error: unknown) {
			return null;
		}
	}
}
