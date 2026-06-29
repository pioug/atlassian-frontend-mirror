/**
 * Transaction meta key used by the selection-preservation plugin
 * to detect formatting operations that need selection re-syncing.
 *
 * When a formatting command (text color, highlight, etc.) changes the document,
 * it sets this meta key to `true` so the selection-preservation plugin can
 * re-sync the DOM selection after the transaction is applied.
 */
export const FORMAT_SELECTION_SYNC_META = 'editorPluginSelectionPreservationFormatSync';
