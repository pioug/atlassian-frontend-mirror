import { fg } from '@atlaskit/platform-feature-flags';

import type { RevisionPayloadEntry, VCAbortReason } from '../../../common/vc/types';
import type { VCObserverEntry } from '../types';

import calculateTTVCPercentiles from './percentile-calc';
import type { VCCalculator, VCCalculatorParam } from './types';
import getViewportHeight from './utils/get-viewport-height';
import getViewportWidth from './utils/get-viewport-width';

export default abstract class AbstractVCCalculatorBase implements VCCalculator {
	private revisionNo: string;
	constructor(revisionNo: string) {
		this.revisionNo = revisionNo;
	}
	protected abstract isEntryIncluded(entry: VCObserverEntry): boolean;

	protected abstract isVCClean(filteredEntries: ReadonlyArray<VCObserverEntry>): boolean;

	protected abstract getVCCleanStatus(filteredEntries: ReadonlyArray<VCObserverEntry>): {
		isVCClean: boolean;
		dirtyReason?: VCAbortReason;
	};

	async calculate({
		startTime,
		stopTime,
		orderedEntries,
	}: VCCalculatorParam): Promise<RevisionPayloadEntry | undefined> {
		const filteredEntries = orderedEntries.filter((entry) => {
			return this.isEntryIncluded(entry);
		});

		if (fg('platform_ufo_add_vc_abort_reason_by_revisions')) {
			const { isVCClean, dirtyReason } = this.getVCCleanStatus(filteredEntries);

			if (!isVCClean) {
				return {
					revision: this.revisionNo,
					'metric:vc90': null,
					clean: false,
					abortReason: dirtyReason,
				};
			}
		} else {
			const isVCClean = this.isVCClean(filteredEntries);

			if (!isVCClean) {
				return {
					revision: this.revisionNo,
					'metric:vc90': null,
					clean: false,
				};
			}
		}

		const vcDetails = await calculateTTVCPercentiles({
			viewport: {
				width: getViewportWidth(),
				height: getViewportHeight(),
			},
			startTime,
			stopTime,
			orderedEntries: filteredEntries,
			percentiles: [25, 50, 75, 80, 85, 90, 95, 98, 99],
		});

		return {
			revision: this.revisionNo,
			clean: true,
			'metric:vc90': vcDetails?.['90']?.t ?? null,
			vcDetails: vcDetails ?? undefined,
		};
	}
}
