import { withProfiling } from '../../../self-measurements';
import type { VCObserverEntry } from '../types';

import calculateTTVCPercentiles from './percentile-calc';
import type { RevisionPayloadEntry, VCCalculator, VCCalculatorParam } from './types';
import getViewportHeight from './utils/get-viewport-height';
import getViewportWidth from './utils/get-viewport-width';

export default abstract class AbstractVCCalculatorBase implements VCCalculator {
	private revisionNo: string;
	constructor(revisionNo: string) {
		this.revisionNo = revisionNo;
		this.calculate = withProfiling(this.calculate.bind(this), ['vc']);
	}
	protected abstract isEntryIncluded(entry: VCObserverEntry): boolean;

	protected abstract isVCClean(filteredEntries: ReadonlyArray<VCObserverEntry>): boolean;

	async calculate({
		startTime,
		stopTime,
		orderedEntries,
	}: VCCalculatorParam): Promise<RevisionPayloadEntry | undefined> {
		const filteredEntries = orderedEntries.filter((entry) => {
			return this.isEntryIncluded(entry);
		});
		const isVCClean = this.isVCClean(filteredEntries);

		if (!isVCClean) {
			return {
				revision: this.revisionNo,
				'metric:vc90': null,
				clean: false,
			};
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
			vcDetails: vcDetails ?? undefined,
			clean: isVCClean,
			'metric:vc90': vcDetails?.['90']?.t ?? null,
		};
	}
}
