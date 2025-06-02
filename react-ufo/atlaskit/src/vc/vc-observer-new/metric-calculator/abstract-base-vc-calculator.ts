import { fg } from '@atlaskit/platform-feature-flags';

import type {
	RevisionPayloadEntry,
	RevisionPayloadVCDetails,
	VCAbortReason,
	VCRatioType,
} from '../../../common/vc/types';
import type { VCObserverEntry, ViewportEntryData } from '../types';

import { calculateTTVCPercentilesWithDebugInfo } from './percentile-calc';
import type { PercentileCalcResult } from './percentile-calc/types';
import type { VCCalculator, VCCalculatorParam } from './types';
import getViewportHeight from './utils/get-viewport-height';
import getViewportWidth from './utils/get-viewport-width';

interface WindowWithUFORevisionDebugging extends Window {
	__ufo_devtool_onVCRevisionReady__?: (debugInfo: {
		revision: string;
		abortReason?: string | null;
		isClean: boolean;
		vcLogs: PercentileCalcResult | null;
		interactionId?: string;
	}) => void;
}

export default abstract class AbstractVCCalculatorBase implements VCCalculator {
	private revisionNo: string;
	constructor(revisionNo: string) {
		this.revisionNo = revisionNo;
	}
	protected abstract isEntryIncluded(entry: VCObserverEntry): boolean;

	protected abstract getVCCleanStatus(filteredEntries: ReadonlyArray<VCObserverEntry>): {
		isVCClean: boolean;
		dirtyReason?: VCAbortReason;
	};

	private filterViewportEntries(
		entries: ReadonlyArray<VCObserverEntry>,
	): ReadonlyArray<VCObserverEntry> {
		return entries.filter((entry): entry is VCObserverEntry & { data: ViewportEntryData } => {
			return 'rect' in entry.data;
		});
	}

	/**
	 * Calculate ratios for each element based on their viewport coverage.
	 */
	private calculateRatios(filteredEntries: ReadonlyArray<VCObserverEntry>): VCRatioType {
		const ratios: VCRatioType = {};
		const viewportWidth = getViewportWidth();
		const viewportHeight = getViewportHeight();
		const totalViewportArea = viewportWidth * viewportHeight;

		if (totalViewportArea === 0) {
			return ratios;
		}

		const elementRects = new Map<string, DOMRect>();

		for (const entry of filteredEntries) {
			if ('rect' in entry.data) {
				const viewportEntry = entry.data as ViewportEntryData;
				elementRects.set(viewportEntry.elementName, viewportEntry.rect);
			}
		}

		for (const [elementName, rect] of elementRects) {
			const elementArea = rect.width * rect.height;
			ratios[elementName] = elementArea / totalViewportArea;
		}

		return ratios;
	}

	private async calculateWithDebugInfo(
		filteredEntries: ReadonlyArray<VCObserverEntry>,
		startTime: number,
		stopTime: number,
		isPostInteraction: boolean,
		isVCClean: boolean,
		interactionId?: string,
		dirtyReason?: VCAbortReason,
	): Promise<RevisionPayloadVCDetails> {
		const percentiles = [25, 50, 75, 80, 85, 90, 95, 98, 99];
		const viewportEntries = this.filterViewportEntries(filteredEntries);
		const vcLogs = await calculateTTVCPercentilesWithDebugInfo({
			viewport: {
				width: getViewportWidth(),
				height: getViewportHeight(),
			},
			startTime,
			stopTime,
			orderedEntries: viewportEntries,
		});

		const vcDetails: RevisionPayloadVCDetails = {};
		let percentileIndex = 0;
		const entryDataBuffer = new Set<ViewportEntryData>();

		if (vcLogs) {
			for (const entry of vcLogs) {
				const { time, viewportPercentage, entries } = entry;

				// Only process entries if we haven't reached all percentiles
				if (percentileIndex >= percentiles.length) {
					break;
				}

				// Check if this entry matches any checkpoint percentiles
				if (viewportPercentage >= percentiles[percentileIndex]) {
					const elementNames = entries.map((e: ViewportEntryData) => e.elementName);

					// Process all matching percentiles in one go
					while (
						percentileIndex < percentiles.length &&
						viewportPercentage >= percentiles[percentileIndex]
					) {
						vcDetails[`${percentiles[percentileIndex]}`] = {
							t: Math.round(time),
							e: elementNames,
						};
						percentileIndex++;
					}

					// Clear buffer after processing all matching percentiles
					entryDataBuffer.clear();
				} else {
					// Only add to buffer if we haven't reached all percentiles
					entries.forEach((e: ViewportEntryData) => entryDataBuffer.add(e));
				}
			}
		}

		// Fill in any missing percentiles with the last known values
		let previousResult: { t: number; e: string[] } = { t: 0, e: [] };
		for (let i = 0; i < percentiles.length; i++) {
			const percentile = percentiles[i];
			if (!(percentile in vcDetails)) {
				vcDetails[`${percentile}`] = previousResult;
			} else {
				previousResult = vcDetails[`${percentile}`];
			}
		}

		// Handle devtool callback
		if (
			!isPostInteraction &&
			typeof window !== 'undefined' &&
			typeof (window as WindowWithUFORevisionDebugging).__ufo_devtool_onVCRevisionReady__ ===
				'function'
		) {
			try {
				(window as WindowWithUFORevisionDebugging).__ufo_devtool_onVCRevisionReady__?.({
					revision: this.revisionNo,
					isClean: isVCClean,
					abortReason: dirtyReason,
					vcLogs,
					interactionId,
				});
			} catch (e) {
				// if any error communicating with devtool, we don't want to break the app
				// eslint-disable-next-line no-console
				console.error('Error in onVCRevisionReady', e);
			}
		}

		return vcDetails;
	}

	async calculate({
		startTime,
		stopTime,
		orderedEntries,
		interactionId,
		isPostInteraction,
	}: VCCalculatorParam): Promise<RevisionPayloadEntry | undefined> {
		const filteredEntries = orderedEntries.filter((entry) => {
			return this.isEntryIncluded(entry);
		});

		let isVCClean: boolean;
		let dirtyReason: VCAbortReason | undefined;
		const getVCCleanStatusResult = this.getVCCleanStatus(filteredEntries);
		isVCClean = getVCCleanStatusResult.isVCClean;
		dirtyReason = getVCCleanStatusResult.dirtyReason;

		if (!isVCClean) {
			return {
				revision: this.revisionNo,
				'metric:vc90': null,
				clean: false,
				abortReason: dirtyReason,
			};
		}

		const vcDetails = await this.calculateWithDebugInfo(
			filteredEntries,
			startTime,
			stopTime,
			isPostInteraction,
			isVCClean,
			interactionId,
			dirtyReason,
		);

		const result: RevisionPayloadEntry = {
			revision: this.revisionNo,
			clean: true,
			'metric:vc90': vcDetails?.['90']?.t ?? null,
			vcDetails: vcDetails ?? undefined,
		};

		if (fg('platform_ufo_rev_ratios')) {
			result.ratios = this.calculateRatios(filteredEntries);
		}

		return result;
	}
}
