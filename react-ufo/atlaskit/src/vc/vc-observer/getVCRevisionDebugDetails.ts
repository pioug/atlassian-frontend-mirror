import type { ComponentsLogType, VCEntryType } from '../../common/vc/types';
import type { VCObserverEntryType } from '../vc-observer-new/types';

interface VCRevisionDebugDetails {
	revision: string;
	isClean: boolean;
	abortReason: string | null;
	vcLogs: Array<{
		time: number;
		viewportPercentage: number;
		entries: Array<{
			elementName: string;
			type: VCObserverEntryType;
			rect: DOMRect;
			visible: boolean;
			attributeName?: string | null;
			oldValue?: string | null;
			newValue?: string | null;
		}>;
	}>;
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
	abortReason: string | null;
	VCEntries: VCEntryType[];
	componentsLog: ComponentsLogType;
	interactionId?: string;
}): VCRevisionDebugDetails {
	return {
		revision,
		isClean,
		abortReason,
		vcLogs: VCEntries.map((entry) => ({
			time: entry.time,
			viewportPercentage: entry.vc,
			entries: entry.elements.map((element) => {
				const logEntry = componentsLog[entry.time]?.find((log) => log.targetName === element);
				return {
					elementName: element,
					type: logEntry?.type as VCObserverEntryType,
					rect: logEntry?.intersectionRect as DOMRect,
					visible: true,
					attributeName: logEntry?.attributeName,
					oldValue: logEntry?.oldValue,
					newValue: logEntry?.newValue,
				};
			}),
		})),
		interactionId,
	};
}
