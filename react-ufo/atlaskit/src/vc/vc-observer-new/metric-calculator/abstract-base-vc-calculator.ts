import { fg } from '@atlaskit/platform-feature-flags';

import type {
	RevisionPayloadEntry,
	RevisionPayloadVCDetails,
	VCAbortReason,
	VCIgnoreReason,
	VCLabelStacks,
	VCRatioType,
} from '../../../common/vc/types';
import getPageVisibilityUpToTTAI from '../../../create-payload/utils/get-page-visibility-up-to-ttai';
import { getInteractionId } from '../../../interaction-id-context';
import { interactions } from '../../../interaction-metrics/common/constants';
import type { VCRevisionDebugDetails } from '../../vc-observer/getVCRevisionDebugDetails';
import type { VCObserverEntry, ViewportEntryData } from '../types';
import { cssIssueOccurrence } from '../viewport-observer/utils/track-display-content-occurrence';

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

export default abstract class AbstractVCCalculatorBase implements VCCalculator {
	private revisionNo: string;
	constructor(revisionNo: string) {
		this.revisionNo = revisionNo;
	}
	protected abstract isEntryIncluded(entry: VCObserverEntry, include3p?: boolean): boolean;

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
			ratios[elementName] = elementArea / totalViewportArea;
		}

		return ratios;
	}

	private getLabelStacks(filteredEntries: ReadonlyArray<VCObserverEntry>): VCLabelStacks {
		const labelStacks: VCLabelStacks = {};
		for (const entry of filteredEntries) {
			if ('elementName' in entry.data && entry.data.labelStacks) {
				labelStacks[entry.data.elementName] = {
					segment: entry.data.labelStacks.segment,
					labelStack: entry.data.labelStacks.labelStack,
				};
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
		interactionId?: string,
		dirtyReason?: VCAbortReason,
		allEntries?: ReadonlyArray<VCObserverEntry>,
		include3p?: boolean,
	): Promise<RevisionPayloadVCDetails> {
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
		const shouldCalculateDebugDetails =
			(!isPostInteraction || shouldCalculate3p) &&
			(typeof window?.__ufo_devtool_onVCRevisionReady__ === 'function' ||
				typeof window?.__on_ufo_vc_debug_data_ready === 'function');

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
				if ('rect' in entry.data && !this.isEntryIncluded(entry, include3p)) {
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
			if (fg('platform_ufo_unify_abort_status_in_ttvc_debug_data')) {
				// NOTE: using this instead of directly calling `getActiveInteraction()` to get around circular dependencies
				const activeInteractionId = getInteractionId();
				const activeInteraction = interactions.get(activeInteractionId.current ?? '');

				const pageVisibilityUpToTTAI = activeInteraction
					? getPageVisibilityUpToTTAI(activeInteraction)
					: null;
				const isBackgrounded = pageVisibilityUpToTTAI !== 'visible';

				v3RevisionDebugDetails = {
					revision: this.revisionNo,
					isClean: isVCClean && !activeInteraction?.abortReason && !isBackgrounded,
					abortReason: isBackgrounded
						? 'browser_backgrounded'
						: (dirtyReason ?? activeInteraction?.abortReason),
					vcLogs: enhancedVcLogs,
					interactionId,
				};
			} else {
				v3RevisionDebugDetails = {
					revision: this.revisionNo,
					isClean: isVCClean,
					abortReason: dirtyReason,
					vcLogs: enhancedVcLogs,
					interactionId,
				};
			}
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

		return vcDetails;
	}

	async calculate({
		startTime,
		stopTime,
		orderedEntries,
		interactionId,
		isPostInteraction,
		include3p,
	}: VCCalculatorParam): Promise<RevisionPayloadEntry | undefined> {
		const filteredEntries = orderedEntries.filter((entry) => {
			return this.isEntryIncluded(entry, include3p);
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

		const vcDetails = await this.calculateWithDebugInfo(
			filteredEntries,
			startTime,
			stopTime,
			isPostInteraction,
			isVCClean,
			interactionId,
			dirtyReason,
			orderedEntries,
			include3p,
		);

		const result: RevisionPayloadEntry = {
			revision: this.revisionNo,
			clean: true,
			'metric:vc90': vcDetails?.['90']?.t ?? null,
			vcDetails: vcDetails ?? undefined,
		};

		result.ratios = this.calculateRatios(filteredEntries);

		if (isPostInteraction) {
			result.labelStacks = this.getLabelStacks(filteredEntries);
		}

		if (fg('platform_ufo_display_content_track_occurrence')) {
			result.displayContentsOccurrence = cssIssueOccurrence;
		}

		return result;
	}
}
