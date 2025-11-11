import type { RawObservation, RevisionPayloadEntry, VCAbortReason } from '../../../common/vc/types';
import getViewportHeight from '../metric-calculator/utils/get-viewport-height';
import getViewportWidth from '../metric-calculator/utils/get-viewport-width';
import type { VCObserverEntry, ViewportEntryData, WindowEventEntryData } from '../types';
const ABORTING_WINDOW_EVENT = ['wheel', 'scroll', 'keydown', 'resize'] as const;
const MAX_OBSERVATIONS = 100;

export default class RawDataHandler {
	private readonly revisionNo: string = 'raw-handler';

	protected getVCCleanStatus(filteredEntries: readonly VCObserverEntry[]) {
		let dirtyReason: VCAbortReason | '' = '';
		let abortTimestamp = -1;
		const hasAbortEvent = filteredEntries.some((entry) => {
			if (entry.data.type === 'window:event') {
				const data = entry.data as WindowEventEntryData;
				if (ABORTING_WINDOW_EVENT.includes(data.eventType)) {
					dirtyReason = data.eventType === 'keydown' ? 'keypress' : data.eventType;
					abortTimestamp = Math.round(entry.time);
					return true;
				}
			}
			return false;
		});

		if (hasAbortEvent && dirtyReason) {
			return {
				isVCClean: false,
				dirtyReason,
				abortTimestamp,
			};
		}

		return {
			isVCClean: true,
		};
	}

	async getRawData({
		entries,
		startTime,
		stopTime,
		isPageVisible,
	}: {
		entries: ReadonlyArray<VCObserverEntry>;
		startTime: number;
		stopTime: number;
		isPageVisible: boolean;
	}): Promise<RevisionPayloadEntry | undefined> {
		let isVCClean: boolean;
		let dirtyReason: VCAbortReason | undefined;
		const getVCCleanStatusResult = this.getVCCleanStatus(entries);
		isVCClean = getVCCleanStatusResult.isVCClean;
		dirtyReason = getVCCleanStatusResult.dirtyReason;

		if (!isPageVisible) {
			return {
				revision: this.revisionNo,
				clean: false,
				'metric:vc90': null,
				abortReason: 'browser_backgrounded',
				abortTimestamp: -1,
				viewport: { w: getViewportWidth(), h: getViewportHeight() },
			};
		}

		const viewportEntries = entries.filter((entry) => {
			return (
				entry.time >= startTime &&
				entry.time <= stopTime &&
				entry.data &&
				(entry.data as ViewportEntryData).visible
			);
		});

		const targetNameToIdMap = new Map<string, number>();
		const elementMapEntriesMap: Record<number, string> = {};
		let nextElementId = 1;
		const typeMap = new Map<string, number>();
		const typeMapEntriesMap: Record<number, string> = {};
		let nextTypeId = 1;
		const attributeMap = new Map<string, number>();
		const attributeEntriesMap: Record<number, string> = {};
		let nextAttributeId = 1;

		let rawObservations = viewportEntries.map((entry) => {
			const viewportEntry = entry.data as ViewportEntryData;

			const targetName = viewportEntry.elementName || '';
			const type = viewportEntry.type || '';
			const rect = viewportEntry.rect;
			const attributeName = viewportEntry.attributeName || '';
			let eid = targetNameToIdMap.get(viewportEntry.elementName || '') || 0;
			if (eid === 0) {
				eid = nextElementId;
				nextElementId += 1;
				targetNameToIdMap.set(targetName, eid);
				elementMapEntriesMap[eid] = targetName;
			}

			let chg = typeMap.get(type || '') || 0;
			if (chg === 0) {
				chg = nextTypeId;
				nextTypeId += 1;
				typeMap.set(type, chg);
				typeMapEntriesMap[chg] = type;
			}

			let att = 0;
			if (attributeName) {
				att = attributeMap.get(attributeName) || 0;
				if (att === 0) {
					att = nextAttributeId;
					nextAttributeId += 1;
					attributeMap.set(attributeName, att);
					attributeEntriesMap[att] = attributeName;
				}
			}
			const observation: RawObservation = {
				t: Math.round(entry.time),
				r: [
					Math.round(rect.left * 10) / 10,
					Math.round(rect.top * 10) / 10,
					Math.round(rect.right * 10) / 10,
					Math.round(rect.bottom * 10) / 10,
				],
				chg,
				eid: eid || 0,
				...(att > 0 ? { att } : {}),
			};

			return observation;
		});
		// If the number of observations is greater than the maximum allowed, we need to trim the observations to the maximum allowed.
		// We do this by keeping the first observation and the last MAX_OBSERVATIONS observations.
		// We then collect the referenced IDs from the remaining observations and remove the unreferenced entries from the maps
		if (rawObservations.length > MAX_OBSERVATIONS) {
			const firstObservation = rawObservations[0];
			const lastObservations = rawObservations.slice(-MAX_OBSERVATIONS);
			rawObservations = [firstObservation, ...lastObservations];

			// Collect referenced IDs from remaining observations
			const referencedEids = new Set<number>();
			const referencedChgs = new Set<number>();
			const referencedAtts = new Set<number>();

			for (const observation of rawObservations) {
				if (observation.eid > 0) {
					referencedEids.add(observation.eid);
				}
				if (typeof observation.chg === 'number' && observation.chg > 0) {
					referencedChgs.add(observation.chg);
				}
				if (observation.att !== undefined && observation.att > 0) {
					referencedAtts.add(observation.att);
				}
			}

			// Remove unreferenced entries from maps
			for (const eid of Object.keys(elementMapEntriesMap).map(Number)) {
				if (!referencedEids.has(eid)) {
					delete elementMapEntriesMap[eid];
				}
			}

			for (const chg of Object.keys(typeMapEntriesMap).map(Number)) {
				if (!referencedChgs.has(chg)) {
					delete typeMapEntriesMap[chg];
				}
			}

			for (const att of Object.keys(attributeEntriesMap).map(Number)) {
				if (!referencedAtts.has(att)) {
					delete attributeEntriesMap[att];
				}
			}
		}

		const result: RevisionPayloadEntry = {
			revision: this.revisionNo,
			clean: isVCClean,
			'metric:vc90': null,
			rawData: {
				obs: rawObservations ?? undefined,
				eid: elementMapEntriesMap ?? undefined,
				chg: typeMapEntriesMap ?? undefined,
				att: attributeEntriesMap ?? undefined,
			},
			abortReason: dirtyReason,
			abortTimestamp: getVCCleanStatusResult.abortTimestamp,
			viewport: { w: getViewportWidth(), h: getViewportHeight() },
		};

		return result;
	}
}
