import type {
	ComponentsLogType,
	VCAbortReason,
	VCEntryType,
	VCIgnoreReason,
} from '../../common/vc/types';
import type { VCObserverEntryType } from '../vc-observer-new/types';

export type VCLogEntry = {
	time: number;
	viewportPercentage: number | null;
	entries: Array<{
		elementName: string;
		type: VCObserverEntryType;
		rect: DOMRect;
		visible: boolean;
		attributeName?: string | null;
		oldValue?: string | null;
		newValue?: string | null;
		ignoreReason?: VCIgnoreReason;
	}>;
};

export interface VCRevisionDebugDetails {
	revision: string;
	isClean: boolean;
	abortReason?: VCAbortReason | null;
	vcLogs: VCLogEntry[];
	interactionId?: string;
}

export function getVCRevisionDebugDetails({
	revision,
	isClean,
	abortReason,
	VCEntries,
	componentsLog,
	interactionId,
}: {
	revision: string;
	isClean: boolean;
	abortReason?: VCAbortReason | null;
	VCEntries: VCEntryType[];
	componentsLog: ComponentsLogType;
	interactionId?: string;
}): VCRevisionDebugDetails {
	// Pre-sort VCEntries by time for efficient lookups
	const sortedVCEntries = [...VCEntries].sort((a, b) => a.time - b.time);

	// Pre-calculate max viewport percentage up to each time for efficient lookups
	const maxViewportPercentageAtTime = new Map<number, number>();
	let maxSoFar = 0;
	for (const entry of sortedVCEntries) {
		maxSoFar = Math.max(maxSoFar, entry.vc);
		maxViewportPercentageAtTime.set(entry.time, maxSoFar);
	}

	// Helper function to find the biggest previous viewport percentage
	const getBiggestPreviousViewportPercentage = (targetTime: number): number | null => {
		// Binary search for the largest time <= targetTime
		let left = 0;
		let right = sortedVCEntries.length - 1;
		let result = -1;

		while (left <= right) {
			const mid = Math.floor((left + right) / 2);
			if (sortedVCEntries[mid].time <= targetTime) {
				result = mid;
				left = mid + 1;
			} else {
				right = mid - 1;
			}
		}

		return result >= 0
			? maxViewportPercentageAtTime.get(sortedVCEntries[result].time) || null
			: null;
	};

	const allVcLogs: VCLogEntry[] = [];

	// Add regular VC entries
	for (const entry of VCEntries) {
		const timeLogEntries = componentsLog[entry.time];
		allVcLogs.push({
			time: entry.time,
			viewportPercentage: entry.vc,
			entries: entry.elements.map((element) => {
				const logEntry = timeLogEntries?.find((log) => log.targetName === element);
				return {
					elementName: element,
					type: logEntry?.type as VCObserverEntryType,
					rect: logEntry?.intersectionRect as DOMRect,
					visible: true,
					attributeName: logEntry?.attributeName,
					oldValue: logEntry?.oldValue,
					newValue: logEntry?.newValue,
					ignoreReason: logEntry?.ignoreReason,
				};
			}),
		});
	}

	// Add ignored elements - only process timestamps that have ignored elements
	for (const [timestamp, timeLogEntries] of Object.entries(componentsLog)) {
		const ignoredElements = timeLogEntries.filter((log) => log.ignoreReason);

		if (ignoredElements.length === 0) {
			continue;
		}

		const time = Number(timestamp);
		const viewportPercentage = getBiggestPreviousViewportPercentage(time);

		allVcLogs.push({
			time,
			viewportPercentage,
			entries: ignoredElements.map((logEntry) => ({
				elementName: logEntry.targetName,
				type: logEntry.type as VCObserverEntryType,
				rect: logEntry.intersectionRect as DOMRect,
				visible: false,
				attributeName: logEntry.attributeName,
				oldValue: logEntry.oldValue,
				newValue: logEntry.newValue,
				ignoreReason: logEntry.ignoreReason,
			})),
		});
	}

	// Sort once at the end
	allVcLogs.sort((a, b) => a.time - b.time);

	return {
		revision,
		isClean,
		abortReason,
		vcLogs: allVcLogs,
		interactionId,
	};
}
