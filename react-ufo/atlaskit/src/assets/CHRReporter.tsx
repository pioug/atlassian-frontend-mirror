import type { AssetsConfig, AssetsData } from '../common';
import type { ResourceEntry } from '../resource-timing/common/types';
import { checkIfTimingsAvailable } from './checkIfTimingsAvailable';
import { CHRSummary } from './CHRSummary';
import { getTypeOfRequest } from './getTypeOfRequest';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
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

				if (
					entry.encodedSize === entry.decodedSize ||
					entry.encodedSize === undefined ||
					entry.encodedSize === null
				) {
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
		} catch {
			return null;
		}
	}
}
