import type { Node as PMNode, Slice } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { Step } from '@atlaskit/editor-prosemirror/transform';
import { findParentNode } from '@atlaskit/editor-prosemirror/utils';
import { fg } from '@atlaskit/platform-feature-flags';

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
		step.getMap().forEach((oldStart, oldEnd, newStart, newEnd) => {
			tr.doc.nodesBetween(newStart, Math.min(newEnd, tr.doc.content.size), (node) => {
				let nodeToCheck: PMNode = node;
				if (fg('cc_complexit_fe_improve_node_validation')) {
					const { schema } = tr.selection.$from.doc.type;
					const parentNode = findParentNode((node) => node.type !== schema.nodes.paragraph)(
						tr.selection,
					);
					nodeToCheck = parentNode ? parentNode.node : node;
				}
				if (!nodes.find((n) => n === nodeToCheck)) {
					nodes.push(nodeToCheck);
				}
				return false;
			});
		});
	});

	return nodes;
};
