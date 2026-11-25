import { getAgentEditChangedRanges } from '@atlaskit/editor-common/collab-agent-edit-changed-ranges';
import type { AgentInvocationReviewBatch } from '@atlaskit/editor-common/collab-agent-invocation';
import { slicesEqualIgnoringLocalId } from '@atlaskit/editor-common/collab-agent-review-slice-compare';
import { mapAgentEditRanges } from '@atlaskit/editor-common/collab-map-agent-edit-ranges';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { isAgentStepWithInvocation } from './agent-edit-requester';
import { getMarkStepRange } from './agent-shimmer-ranges';

export const getAgentInvocationReviewBatches = (
	rawSteps: unknown[],
	transaction: Transaction,
): { invocations: AgentInvocationReviewBatch[]; legacyIndexes: number[] } => {
	const invocations = new Map<string, AgentInvocationReviewBatch>();
	const legacyIndexes: number[] = [];
	const rebasedData = transaction.getMeta('rebasedData') as
		| { remoteSteps: readonly unknown[] }
		| undefined;
	// Acknowledged local steps are absent from the transaction. Remaining remote steps are
	// applied after the unconfirmed local steps are rolled back and before they're replayed.
	const acknowledged = rebasedData ? rawSteps.length - rebasedData.remoteSteps.length : 0;
	const rolledBack = Number(transaction.getMeta('rebased')) || 0;

	rawSteps.forEach((rawStep, index) => {
		if (!isAgentStepWithInvocation(rawStep)) {
			legacyIndexes.push(index);
			return;
		}
		const { invocationId } = rawStep;
		if (index < acknowledged) {
			return;
		}
		const stepIndex = rolledBack + index - acknowledged;
		const step = transaction.steps[stepIndex];
		if (!step) {
			return;
		}

		const before = transaction.docs[stepIndex];
		const after = transaction.docs[stepIndex + 1] ?? transaction.doc;
		let changed = false;
		let ranges: AgentInvocationReviewBatch['ranges'] = [];
		let hasCoarseReplacement = false;
		const addChangedRange = (oldFrom: number, oldTo: number, from: number, to: number) => {
			if (oldFrom === oldTo && from === to) {
				return;
			}
			if (oldFrom < oldTo && from < to) {
				const previous = before.slice(oldFrom, oldTo);
				const current = after.slice(from, to);
				if (
					oldTo - oldFrom === to - from &&
					(previous.eq(current) || slicesEqualIgnoringLocalId(previous, current))
				) {
					return;
				}
				hasCoarseReplacement ||=
					previous.openStart === 0 &&
					previous.openEnd === 0 &&
					current.openStart === 0 &&
					current.openEnd === 0 &&
					(current.content.childCount > 1 || previous.content.childCount > 1) &&
					current.content.firstChild?.isBlock === true;
			}
			changed = true;
			if (from < to) {
				ranges.push({ from, to });
			}
		};

		const markRange = getMarkStepRange(step);
		let hasPositionChanges = false;
		if (markRange) {
			const { from, to } = markRange;
			addChangedRange(from, to, from, to);
		} else {
			step.getMap().forEach((oldFrom, oldTo, from, to) => {
				hasPositionChanges = true;
				addChangedRange(oldFrom, oldTo, from, to);
			});
		}
		if (!markRange && !hasPositionChanges) {
			ranges = getAgentEditChangedRanges(transaction, [stepIndex]);
			changed = ranges.length > 0;
		} else if (ranges.length) {
			ranges = mapAgentEditRanges(ranges, transaction, { from: stepIndex + 1 });
			if (hasCoarseReplacement && ranges.length) {
				// A whole-document step can carry blocks the agent did not edit. Use the
				// snapshot comparison to exclude them and keep the mapped range boundaries
				// so later steps cannot add unrelated text to these ranges.
				const changedBlocks = getAgentEditChangedRanges(transaction, [stepIndex]);
				ranges = ranges.flatMap((range) =>
					changedBlocks.flatMap((block) => {
						const from = Math.max(range.from, block.from);
						const to = Math.min(range.to, block.to);
						return from < to ? [{ from, to }] : [];
					}),
				);
			}
		}

		const complete = rawStep.agentEditComplete === true;
		if (!changed && !complete) {
			return;
		}
		let batch = invocations.get(invocationId);
		if (!batch) {
			batch = {
				invocationId,
				agentId: typeof rawStep.agentId === 'string' ? rawStep.agentId : undefined,
				complete: false,
				ranges: [],
			};
			invocations.set(invocationId, batch);
		}
		batch.complete ||= complete;
		batch.ranges.push(...ranges);
	});
	return { invocations: [...invocations.values()], legacyIndexes };
};
