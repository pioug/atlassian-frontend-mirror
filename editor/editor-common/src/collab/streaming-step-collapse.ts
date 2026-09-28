/**
 * Neutral transaction metadata used by streaming producers (for example editor-plugin-ai's
 * in-editor direct streaming) to tell the collab layer that this transaction's steps are an
 * intermediate frame of a single logical edit.
 *
 * Streaming producers re-render the whole in-progress region on every chunk, which means each
 * frame is a full replace of the region the previous frame inserted. Every frame is applied to the
 * local document immediately (so the user sees the content stream in), but only the *composition*
 * of the frames needs to reach the collab service.
 *
 * Stamping a transaction with this meta does NOT stop its steps from being sent — it only makes
 * them eligible to be composed with adjacent frames while they are still unconfirmed. See
 * `collapseStreamingSteps` in `@atlaskit/editor-plugin-collab-edit`.
 *
 * @example
 * ```ts
 * tr.setMeta(STREAMING_COLLAPSIBLE_STEPS, true);
 * ```
 */
export const STREAMING_COLLAPSIBLE_STEPS = 'streamingCollapsibleSteps';
