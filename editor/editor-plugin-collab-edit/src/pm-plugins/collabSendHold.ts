import { DEFER_COLLAB_SEND } from '@atlaskit/editor-common/collab-defer-collab-send';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

/**
 * Upper bound on how long the send may stay held, measured from the transaction that *started* the
 * hold rather than the most recent one.
 *
 * This is the only time bound on the hold. Producers decide when to release on semantic grounds —
 * a completed block, the end of a stream — and this bounds how long that can take. It therefore
 * doubles as the guarantee that a producer which never releases, because it aborted or threw
 * between hold and release, cannot stop the editor sending for the rest of the session.
 */
export const MAX_SEND_HOLD_MS = 2000;

export type CollabSendHold = {
	/**
	 * Whether the flush is currently held. Reads the clock, so a hold that has outlived
	 * {@link MAX_SEND_HOLD_MS} reports as released without needing a transaction to clear it.
	 */
	isHeld: (now?: number) => boolean;
	/**
	 * Feed every transaction through this. Transactions that carry no {@link DEFER_COLLAB_SEND}
	 * metadata leave the hold untouched — that is the whole point of the hold being sticky rather
	 * than per-transaction.
	 */
	observe: (transaction: Readonly<Transaction>, now?: number) => void;
};

/**
 * Tracks whether sending to the collab service is currently held back.
 *
 * A producer that streams into the document needs several of its transactions to accumulate in the
 * unconfirmed queue before anything is sent, so they can be composed into one step. Marking only
 * the producer's own transactions is not enough: `sendTransaction` runs for *every* state update,
 * and `provider.send` flushes and locks the entire queue regardless of which transaction triggered
 * it. Acknowledgements from previous commits, remote steps, selection changes and the user's own
 * typing all trigger it.
 *
 * So the hold has to be a state that spans transactions rather than a flag on one:
 *
 * - `tr.setMeta(DEFER_COLLAB_SEND, true)` starts the hold, and does *not* extend one already in
 *   progress
 * - `tr.setMeta(DEFER_COLLAB_SEND, false)` releases it
 * - anything else leaves it as it is
 *
 * Not extending matters. A producer marks every frame it wants held, so re-arming on each one
 * would push the deadline back indefinitely and the bound would never be reached during an active
 * stream. Measuring from the first held transaction instead makes the hold flush at least every
 * {@link MAX_SEND_HOLD_MS}, with the next held frame starting a fresh window.
 *
 * While held, nothing is sent. Note this includes the local user's own edits: `sendableSteps`
 * returns the queue in version order, so there is no way to send a step that sits behind held
 * steps. Producers should keep hold windows short for that reason.
 */
export const createCollabSendHold = (): CollabSendHold => {
	let heldSince: number | undefined;

	return {
		observe: (transaction, now = Date.now()) => {
			const meta = transaction.getMeta(DEFER_COLLAB_SEND);

			if (meta === true) {
				// Only start a window, never extend one, so a continuous stream of held frames
				// still reaches the bound. See the note on this type about why.
				if (heldSince === undefined) {
					heldSince = now;
				}
				return;
			}

			if (meta === false) {
				heldSince = undefined;
			}
		},
		isHeld: (now = Date.now()) => {
			if (heldSince === undefined) {
				return false;
			}

			if (now - heldSince >= MAX_SEND_HOLD_MS) {
				// Clear as well as report, so the next held frame opens a fresh window instead of
				// being judged against the expired one.
				heldSince = undefined;
				return false;
			}

			return true;
		},
	};
};
