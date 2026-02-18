import type { RevisionPayload } from '../../common/vc/types';

/**
 * Path recorded in event:trimmedFields when VC debug data (early checkpoint `e` arrays) is trimmed.
 * Matches the location of the trimmed data in the payload: properties['ufo:vc:rev'][].vcDetails[].e
 */
export const VC_DEBUG_TRIM_TRIMMED_FIELD_PATH = 'ufo:vc:rev.vcDetails.e';

/** VC viewport checkpoints to trim; we keep `e` arrays for the rest. */
const VC_CHECKPOINTS_TO_TRIM = ['25', '50', '75'];

/**
 * Trims VC debug data by clearing the `e` (element selector) arrays for early viewport checkpoints
 * (25, 50, 75), keeping the rest 80, 85, 90, 95, 98, 99, 100. Reduces payload size when it still
 * exceeds the limit after interactionMetrics trimming.
 * Mutates `properties` in place and updates event:isTrimmed and event:trimmedFields.
 */
export function trimVcDebugData(
	/** Properties object to trim VC debug data from. */
	properties: Record<string, unknown>,
	/** Current payload size in KB (e.g. from getPayloadSize(properties)). */
	currentPayloadSizeKb: number,
	/** Maximum allowed payload size in KB. Trim runs only when currentPayloadSizeKb > maxPayloadSizeKb. */
	maxPayloadSizeKb: number,
	/** Whether VC revision trim is enabled (e.g. from feature flag). */
	isEnabled: boolean
): void {
	let isTrimmed = false;
	const isPayloadSizeExceeded = currentPayloadSizeKb > maxPayloadSizeKb;
	if (!isEnabled || !isPayloadSizeExceeded) {
		return;
	}

	const vcRev = properties['ufo:vc:rev'] as RevisionPayload | undefined;
	if (!Array.isArray(vcRev) || vcRev.length === 0) {
		return;
	}

	for (const rev of vcRev) {
		for (const [key, detail] of Object.entries(rev.vcDetails ?? {})) {
			if (VC_CHECKPOINTS_TO_TRIM.includes(key)) {
				detail.e = [];
				isTrimmed = true;
			}
		}
	}
	if(isTrimmed) {
		(properties as Record<string, unknown>)['event:isTrimmed'] = isTrimmed;

		let trimmedFields = (properties['event:trimmedFields'] as string[] | undefined);
		if (!Array.isArray(trimmedFields)) {
			trimmedFields = [];
		}
		trimmedFields.push(VC_DEBUG_TRIM_TRIMMED_FIELD_PATH);
		(properties as Record<string, unknown>)['event:trimmedFields'] = trimmedFields;
	}
}
