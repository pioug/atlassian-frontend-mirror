/**
 * Neutral transaction metadata used by streaming producers to tell the collab layer not to flush
 * the unconfirmed queue for this transaction.
 *
 * The transaction is still applied to the local document immediately; only the network send is
 * held back. The steps stay in the collab plugin's unconfirmed queue, which is where sending is
 * deferred from — `sendableSteps` returns the whole queue, so the next unheld transaction sends
 * everything that accumulated.
 *
 * Holding the send is what gives `collapseStreamingSteps` a window to work in: `send()` stamps
 * `mergeIsLocked` on every origin it flushes, and locked steps can no longer be composed.
 *
 * Producers must bound how long they hold. Held steps are content the collab service has not seen,
 * so they are lost if the tab closes, and a peer editing the same region while steps are held will
 * rebase against a document that is missing them.
 *
 * @example
 * ```ts
 * tr.setMeta(DEFER_COLLAB_SEND, true);
 * ```
 */
export const DEFER_COLLAB_SEND = 'deferCollabSend';
