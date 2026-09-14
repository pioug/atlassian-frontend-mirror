import type { Slice } from '@atlaskit/editor-prosemirror/model';

/**
 * [CCI-17994] Meta carried on the transaction that applies a batch of REMOTE
 * agent-authored steps (BE streaming) in `editor-plugin-collab-edit`'s
 * `applyRemoteSteps`. It lets `editor-plugin-ai` record the agent's changes for a
 * Post Stream Review ("Review moment") WITHOUT collab-edit depending on the AI
 * plugin: the contract is neutral and lives here in `editor-common`, which both
 * plugins already depend on.
 *
 * Stamped whenever a received remote-step batch contains agent-authored steps.
 *
 * The batch is reduced to COARSE segments — one per edited top-level region — in
 * exactly the shape the AI plugin already stores in `aiContentPositions` for the
 * FE (`buildCommitTransaction`) path: `[startPos, endPos]` in the live doc plus a
 * closed `originalSlice` / `newSlice` pair. The AI plugin appends these verbatim,
 * then the Post Stream Review screen refines them identically to FE
 * (`calculateTopLevelNodeSegments`, and `calculateDiffSegments` when the
 * diff-based-segmenting gate is on). Producing coarse segments here (rather than
 * fine-grained diffs) preserves the screen's two-layer contract; producing them
 * as CLOSED, whole-top-level-node slices avoids the boundary-bleed / open-slice
 * data-loss hazards of the earlier hand-rolled per-step slicing.
 */
export const AGENT_REMOTE_EDIT_REVIEW_DATA = 'agentRemoteEditReviewData';

/**
 * One coarse reviewable segment for a single edited top-level region, matching the
 * `aiContentPositions` entry shape the AI plugin stores for FE streaming.
 */
export interface AgentRemoteEditReviewSegment {
	/** Live-doc end of the applied (new) content. Equals `startPos` for a pure removal. */
	endPos: number;
	/** Change kind, mirroring the FE coarse-entry classification. */
	kind: 'add' | 'remove' | 'update';
	/**
	 * The post-edit content of this region (`tr.doc`), as a CLOSED slice snapped to
	 * whole top-level nodes. `Slice.empty` for a pure removal.
	 */
	newSlice: Slice;
	/**
	 * The pre-edit content of this region (`tr.before`), as a CLOSED slice snapped
	 * to whole top-level nodes. `Slice.empty` for a pure addition.
	 */
	originalSlice: Slice;
	/** Live-doc start of the applied (new) content. */
	startPos: number;
}

export interface AgentRemoteEditReviewData {
	/**
	 * AAID the agent acted on behalf of (the requester), read from the agent
	 * steps' `userId`. The AI plugin opens the Review moment only on the client
	 * whose local user matches this — so only the requester reviews. `undefined`
	 * when the batch carried no attributable user.
	 */
	actorUserId?: string;
	/**
	 * Identifier of the specific agent that authored the batch, from the agent
	 * steps' `agentId`. Additive on the steps contract, so it may be absent. Not
	 * consumed yet — carried so the contract is explicit, and so a future
	 * multi-agent Review moment can attribute each change to the agent that made
	 * it (`agentType` alone cannot distinguish two agents of the same kind).
	 */
	agentId?: string;
	/** The agent kind (e.g. `'mcp'` | `'twg'`), from the agent steps' `agentType`. */
	agentType?: string;
	/**
	 * Hybrid end-of-edit signal. When the BE/NCS marks a batch as the terminal one
	 * of an agent edit, the AI plugin opens the Review moment immediately instead of
	 * waiting for the idle debounce. `false`/absent ⇒ rely on the debounce.
	 */
	complete?: boolean;
	/**
	 * Whether the local client is the one that requested this agent edit, resolved by
	 * matching `actorUserId` against the local collab participant's AAID.
	 *
	 * Agent steps are broadcast to every collaborator, so anything that must happen
	 * exactly once per edit (notably acceptance-rate analytics) has to run on a single
	 * client. `false` when the local user is not the requester, and also when either AAID
	 * is unavailable: an unattributable batch would otherwise emit one event per connected
	 * client, and silently inflating a metric is worse than a known gap.
	 *
	 * Optional so producers predating this field stay valid; `undefined` is treated as
	 * "not the requester", keeping the fail-closed behaviour.
	 */
	isLocalUserRequester?: boolean;
	/**
	 * The coarse reviewable segments derived from the batch — one per edited
	 * top-level region, with closed whole-node slices. Appended verbatim to
	 * `aiContentPositions` by the AI plugin.
	 */
	segments: AgentRemoteEditReviewSegment[];
}
