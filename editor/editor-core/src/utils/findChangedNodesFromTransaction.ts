import type { Node as PMNode, Slice } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { Step } from '@atlaskit/editor-prosemirror/transform';

/**
 * Finds all top level nodes affected by the transaction
 * Uses from/to positions in transaction's steps to work out which nodes will
 * be changed by the transaction
 */
export const findChangedNodesFromTransaction = (tr: Transaction): PMNode[] => {
	const nodes: PMNode[] = [];
	const steps = (tr.steps || []) as (Step & {
		from: number;
		slice?: Slice;
		to: number;
	})[];
	steps.forEach((step) => {
		step.getMap().forEach((_oldStart, _oldEnd, newStart, newEnd) => {
			tr.doc.nodesBetween(newStart, Math.min(newEnd, tr.doc.content.size), (node) => {
				if (!nodes.find((n) => n === node)) {
					nodes.push(node);
				}
				return false;
			});
		});
	});

	return nodes;
};
