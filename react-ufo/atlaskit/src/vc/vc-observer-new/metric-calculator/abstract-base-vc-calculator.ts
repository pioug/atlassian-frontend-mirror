import { fg } from '@atlaskit/platform-feature-flags';

import type { AbortReasonType, InteractionType } from '../../../common/common/types';
import type {
	CalculateTTVCResult,
	RevisionPayloadEntry,
	RevisionPayloadVCDetails,
	VCAbortReason,
	VCIgnoreReason,
	VCLabelStacks,
	VCRatioType,
} from '../../../common/vc/types';
import type { VCRevisionDebugDetails } from '../../vc-observer/getVCRevisionDebugDetails';
import type { VCObserverEntry, ViewportEntryData } from '../types';

import { calculateTTVCPercentilesWithDebugInfo } from './percentile-calc';
import type { VCCalculator, VCCalculatorParam } from './types';
import getViewportHeight from './utils/get-viewport-height';
import getViewportWidth from './utils/get-viewport-width';

declare global {
	interface Window {
		__ufo_devtool_onVCRevisionReady__?: (debugInfo: VCRevisionDebugDetails) => void;
		__on_ufo_vc_debug_data_ready?: (debugInfo: VCRevisionDebugDetails) => void;
		__ufo_devtool_vc_3p_debug_data?: VCRevisionDebugDetails;
	}
}

// Create comprehensive debug details including ignored entries
type EnhancedViewportEntryData = ViewportEntryData & {
	ignoreReason?: VCIgnoreReason;
};
type EnhancedVcLogEntry = {
	time: number;
	viewportPercentage: number | null;
	entries: EnhancedViewportEntryData[];
};

// Helper function for reporting ratios
function roundDecimal(value: number, decimals: number = 3): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export default abstract class AbstractVCCalculatorBase implements VCCalculator {
	private revisionNo: string;
	constructor(revisionNo: string) {
		this.revisionNo = revisionNo;
	}
	protected abstract isEntryIncluded(
		entry: VCObserverEntry,
		include3p?: boolean,
		excludeSmartAnswersInSearch?: boolean,
	): boolean;

	protected abstract getVCCleanStatus(filteredEntries: ReadonlyArray<VCObserverEntry>): {
		isVCClean: boolean;
		dirtyReason?: VCAbortReason;
		abortTimestamp?: number;
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

			if (fg('platform_ufo_round_vc_ratios')) {
				ratios[elementName] = roundDecimal(elementArea / totalViewportArea);
			} else {
				ratios[elementName] = elementArea / totalViewportArea;
			}
		}

		return ratios;
	}

	private getLabelStacks(
		filteredEntries: ReadonlyArray<VCObserverEntry>,
		isPostInteraction?: boolean,
	): VCLabelStacks {
		const labelStacks: VCLabelStacks = {};
		for (const entry of filteredEntries) {
			if ('elementName' in entry.data && entry.data.labelStacks) {
				if (isPostInteraction) {
					labelStacks[entry.data.elementName] = {
						segment: entry.data.labelStacks.segment,
						labelStack: entry.data.labelStacks.labelStack,
					};
				} else if (fg('platform_ufo_add_segment_names_to_dom_offenders')) {
					labelStacks[entry.data.elementName] = entry.data.labelStacks.labelStack;
				}
			}
		}
		return labelStacks;
	}

	private async calculateWithDebugInfo(
		filteredEntries: ReadonlyArray<VCObserverEntry>,
		startTime: number,
		stopTime: number,
		isPostInteraction: boolean,
		isVCClean: boolean,
		interactionType: InteractionType,
		isPageVisible: boolean,
		interactionId?: string,
		dirtyReason?: VCAbortReason,
		allEntries?: ReadonlyArray<VCObserverEntry>,
		include3p?: boolean,
		excludeSmartAnswersInSearch?: boolean,
		interactionAbortReason?: AbortReasonType,
		includeSSRRatio?: boolean,
	): Promise<CalculateTTVCResult> {
		const percentiles = [25, 50, 75, 80, 85, 90, 95, 98, 99, 100];
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

		let ssrRatio = -1;

		if (vcLogs) {
			for (const entry of vcLogs) {
				const { time, viewportPercentage, entries } = entry;

				if (
					includeSSRRatio &&
					ssrRatio === -1 &&
					entries.some((e) => e.elementName === 'SSR')
				) {
					ssrRatio = viewportPercentage;
				}

				// Only process entries if we haven't reached all percentiles
				if (percentileIndex >= percentiles.length) {
					break;
				}

				// Check if this entry matches any checkpoint percentiles
				if (viewportPercentage >= percentiles[percentileIndex]) {
					let elementNames: string[] = [];

					if (fg('platform_ufo_dedupe_repeated_vc_offenders')) {
						elementNames = [...(new Set(entries.map((e: ViewportEntryData) => e.elementName)))]
					} else {
						elementNames = entries.map((e: ViewportEntryData) => e.elementName);
					}

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

		let enhancedVcLogs: EnhancedVcLogEntry[] = vcLogs
			? vcLogs.map((log) => ({
					...log,
					entries: log.entries.map((entry) => ({
						...entry,
						rect: entry.rect?.toJSON(),
						previousRect: entry.previousRect?.toJSON(),
					})),
					viewportPercentage: log.viewportPercentage as number | null,
				}))
			: [];

		// If 3p metric enabled - calculate the debug details
		const shouldCalculate3p = include3p && fg('platform_ufo_enable_ttai_with_3p');
		// Only calculate enhanced debug details if devtool callbacks exist
		let shouldCalculateDebugDetails =
			(!isPostInteraction || shouldCalculate3p) &&
			(typeof window?.__ufo_devtool_onVCRevisionReady__ === 'function' ||
				typeof window?.__on_ufo_vc_debug_data_ready === 'function');

		if (fg('platform_ufo_fix_post_interaction_check_vc_debug')) {
			shouldCalculateDebugDetails =
				!isPostInteraction &&
				(typeof window?.__ufo_devtool_onVCRevisionReady__ === 'function' ||
					typeof window?.__on_ufo_vc_debug_data_ready === 'function' ||
					typeof window?.__ufo_devtool_vc_3p_debug_data === 'function');
		}

		if (shouldCalculateDebugDetails && allEntries && vcLogs) {
			// Pre-sort vcLogs by time for efficient lookups
			const sortedVcLogs = [...vcLogs].sort((a, b) => a.time - b.time);

			// Pre-calculate max viewport percentage up to each time for efficient lookups
			const maxViewportPercentageAtTime = new Map<number, number>();
			let maxSoFar = 0;
			for (const log of sortedVcLogs) {
				if (log.viewportPercentage !== null) {
					maxSoFar = Math.max(maxSoFar, log.viewportPercentage);
					maxViewportPercentageAtTime.set(log.time, maxSoFar);
				}
			}

			// Helper function to find the biggest previous viewport percentage
			const getBiggestPreviousViewportPercentage = (targetTime: number): number | null => {
				// Binary search for the largest time <= targetTime
				let left = 0;
				let right = sortedVcLogs.length - 1;
				let result = -1;

				while (left <= right) {
					const mid = Math.floor((left + right) / 2);
					if (sortedVcLogs[mid].time <= targetTime) {
						result = mid;
						left = mid + 1;
					} else {
						right = mid - 1;
					}
				}

				return result >= 0
					? maxViewportPercentageAtTime.get(sortedVcLogs[result].time) || null
					: null;
			};

			// Group ignored entries by timestamp
			const ignoredEntriesByTime = new Map<number, EnhancedViewportEntryData[]>();

			for (const entry of allEntries) {
				if (
					'rect' in entry.data &&
					!this.isEntryIncluded(entry, include3p, excludeSmartAnswersInSearch)
				) {
					const viewportData = entry.data as ViewportEntryData;
					const timestamp = Math.round(entry.time);

					if (!ignoredEntriesByTime.has(timestamp)) {
						ignoredEntriesByTime.set(timestamp, []);
					}

					ignoredEntriesByTime.get(timestamp)?.push({
						...viewportData,
						rect: viewportData.rect?.toJSON(),
						previousRect: viewportData.previousRect?.toJSON(),
						ignoreReason: (viewportData.visible
							? viewportData.type
							: 'not-visible') as VCIgnoreReason,
					});
				}
			}

			// Add ignored entries to vcLogs
			const additionalVcLogs: EnhancedVcLogEntry[] = [];
			for (const [timestamp, ignoredEntries] of ignoredEntriesByTime) {
				if (ignoredEntries.length > 0) {
					const viewportPercentage = getBiggestPreviousViewportPercentage(timestamp);
					additionalVcLogs.push({
						time: timestamp,
						viewportPercentage,
						entries: ignoredEntries,
					});
				}
			}

			// Combine and sort all vcLogs
			enhancedVcLogs = [...enhancedVcLogs, ...additionalVcLogs].sort((a, b) => a.time - b.time);
		}

		// Only create debug details if callbacks exist
		let v3RevisionDebugDetails: VCRevisionDebugDetails | null = null;
		if (shouldCalculateDebugDetails) {
			v3RevisionDebugDetails = {
				revision: this.revisionNo,
				isClean: isVCClean && !interactionAbortReason && isPageVisible,
				abortReason: !isPageVisible
					? 'browser_backgrounded'
					: (dirtyReason ?? interactionAbortReason),
				vcLogs: enhancedVcLogs,
				interactionId,
				interactionType,
			};
		}

		// Handle devtool callback
		if (
			v3RevisionDebugDetails &&
			typeof window?.__ufo_devtool_onVCRevisionReady__ === 'function' &&
			!include3p
		) {
			try {
				window?.__ufo_devtool_onVCRevisionReady__?.(v3RevisionDebugDetails);
			} catch (e) {
				// if any error communicating with devtool, we don't want to break the app
				// eslint-disable-next-line no-console
				console.error('Error in onVCRevisionReady', e);
			}
		}

		if (
			v3RevisionDebugDetails &&
			typeof window?.__on_ufo_vc_debug_data_ready === 'function' &&
			!include3p
		) {
			try {
				window?.__on_ufo_vc_debug_data_ready?.(v3RevisionDebugDetails);
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error('Error in onVCRevisionReady', e);
			}
		}

		if (v3RevisionDebugDetails && shouldCalculate3p) {
			try {
				// Log vc details with 3p for debugging
				window.__ufo_devtool_vc_3p_debug_data = v3RevisionDebugDetails;
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error('Error in 3pDebugData', e);
			}
		}

		return {
			vcDetails,
			ssrRatio,
		};
	}

	async calculate({
		startTime,
		stopTime,
		orderedEntries,
		interactionId,
		isPostInteraction,
		include3p,
		excludeSmartAnswersInSearch,
		includeSSRRatio,
		interactionType,
		isPageVisible,
		interactionAbortReason,
	}: VCCalculatorParam): Promise<RevisionPayloadEntry | undefined> {
		const filteredEntries = orderedEntries.filter((entry) => {
			return this.isEntryIncluded(entry, include3p, excludeSmartAnswersInSearch);
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
				abortTimestamp: getVCCleanStatusResult.abortTimestamp,
			};
		}

		const { vcDetails, ssrRatio } = await this.calculateWithDebugInfo(
			filteredEntries,
			startTime,
			stopTime,
			isPostInteraction,
			isVCClean,
			interactionType,
			isPageVisible,
			interactionId,
			dirtyReason,
			orderedEntries,
			include3p,
			excludeSmartAnswersInSearch,
			interactionAbortReason,
			includeSSRRatio,
		);

		const result: RevisionPayloadEntry = {
			revision: this.revisionNo,
			clean: true,
			'metric:vc90': vcDetails?.['90']?.t ?? null,
			vcDetails: vcDetails ?? undefined,
		};

		result.ratios = this.calculateRatios(filteredEntries);

		if (ssrRatio !== -1) {
			result.ssrRatio = ssrRatio;
		}

		if (isPostInteraction || fg('platform_ufo_add_segment_names_to_dom_offenders')) {
			result.labelStacks = this.getLabelStacks(filteredEntries, isPostInteraction);
		}

		return result;
	}
}
