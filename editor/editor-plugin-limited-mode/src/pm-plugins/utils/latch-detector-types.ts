import type { LatchPolicy } from './latch-policy';
import type { LatchDetails } from './latch-policy-types';

export type LatchDetector = {
	destroy: () => void;
	/**
	 * Call once per text input. Measures the time from the input reaching ProseMirror to the next
	 * animation frame — i.e. dispatch plus all plugin work, before the browser paints.
	 */
	measureInput: () => void;
	/**
	 * Report a document change so bulk work can be discounted. The policy decides what counts as
	 * bulk; the caller only supplies the facts.
	 */
	noteDocumentChange: (change: { isDocumentReplaced: boolean; nodeSizeDelta: number }) => void;
};

export type CreateLatchDetectorOptions = {
	/**
	 * Invoked at most once, when the high bar is met, with what the latch was based on. The policy
	 * builds that snapshot before clearing its evidence buffers.
	 */
	onLatchCriteriaMet: (details: LatchDetails) => void;
	/**
	 * The decision itself. Injected rather than constructed here so a caller can supply a differently
	 * configured policy — and so the detector holds no thresholds of its own.
	 */
	policy: LatchPolicy;
};
