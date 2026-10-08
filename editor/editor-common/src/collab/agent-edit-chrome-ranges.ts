import type { AgentEditChromeRange } from './agent-edit-chrome';
import type { AgentEditRangeTransaction } from './agent-edit-range-mapping';
import { agentEditRangeMapping } from './agent-edit-range-mapping';

/**
 * Maps existing textblock activity through each applied step into tr.doc coordinates.
 * Replaced content is dropped unless an unchanged block survives with a unique ID
 * or in the same structural slot. Newly changed blocks belong to the producer.
 */
export function mapAgentEditChromeRanges(
	tr: AgentEditRangeTransaction,
	ranges: readonly AgentEditChromeRange[],
): AgentEditChromeRange[] {
	return agentEditRangeMapping.mapChromeRanges(tr, ranges);
}
