import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import type { AgentEditChromeRange } from './agent-edit-chrome';
import { agentEditRangeMapping } from './agent-edit-range-mapping';

/**
 * Returns whole content-block ranges for selected applied steps, in tr.doc coordinates.
 * Callers select actual AI writes (excluding restores, acknowledgments and preparation)
 * and own experiment/lifecycle decisions. This helper does not dispatch or render.
 *
 * Comparing each step's snapshots also handles attribute/mark steps with empty maps.
 * Shared unchanged subtrees are skipped by reference. Only localId changes are ignored;
 * meaningful attributes and marks retain the affected node's full content scope.
 * Callers can require unique source IDs when preserving ranges across replacements.
 */
export function getAgentEditChangedRanges(
	tr: Transaction,
	includedStepIndexes: readonly number[],
	options?: { requireUniqueSourceIds?: boolean },
): AgentEditChromeRange[] {
	return agentEditRangeMapping.getChangedRanges(
		tr,
		includedStepIndexes,
		options?.requireUniqueSourceIds ?? false,
	);
}
