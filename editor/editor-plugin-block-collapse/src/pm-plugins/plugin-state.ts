import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';

import { isTopLevelHeading, reconcileCollapsedContent } from './collapsed-content';
import { blockCollapseSectionContainsRange, getBlockCollapseSection } from './section-model';
import type { BlockCollapseAction, BlockCollapsePluginState } from './types';

export const createInitialPluginState = (): BlockCollapsePluginState => ({
	collapsedHeadingAtSectionEnd: new Map(),
	collapsedHeadingPositions: new Set(),
	collapsedSectionEnds: new Map(),
	decorations: DecorationSet.empty,
});

const mapCollapsedHeadingPositions = (
	positions: ReadonlySet<number>,
	tr: ReadonlyTransaction,
): ReadonlySet<number> => {
	const mappedPositions = new Set<number>();

	for (const position of positions) {
		const mapped = tr.mapping.mapResult(position, 1);
		if (!mapped.deleted && isTopLevelHeading(tr.doc, mapped.pos)) {
			mappedPositions.add(mapped.pos);
		}
	}

	return mappedPositions;
};

const applyAction = (
	action: BlockCollapseAction | undefined,
	collapsedHeadingPositions: ReadonlySet<number>,
	tr: ReadonlyTransaction,
	collapsedSectionEnds?: ReadonlyMap<number, number>,
): ReadonlySet<number> => {
	if (!action) {
		return collapsedHeadingPositions;
	}

	const nextPositions = new Set(collapsedHeadingPositions);

	switch (action.type) {
		case 'toggle':
			if (nextPositions.has(action.headingPos)) {
				nextPositions.delete(action.headingPos);
			} else if (getBlockCollapseSection(tr.doc, action.headingPos)) {
				nextPositions.add(action.headingPos);
			}
			break;
		case 'expand':
			nextPositions.delete(action.headingPos);
			break;
		case 'expandContainingRange':
			for (const position of nextPositions) {
				const sectionEnd = collapsedSectionEnds?.get(position);
				const headingNode = sectionEnd === undefined ? undefined : tr.doc.nodeAt(position);
				const containsRange =
					sectionEnd !== undefined && headingNode
						? action.from >= position + headingNode.nodeSize && action.to <= sectionEnd
						: blockCollapseSectionContainsRange(tr.doc, position, action.from, action.to);
				if (containsRange) {
					nextPositions.delete(position);
				}
			}
			break;
		case 'collapsePositions':
			for (const position of action.positions) {
				// Reconciliation validates that each heading owns content in one document pass.
				// Only do the constant-depth top-level check here to avoid scanning a section for
				// every requested heading.
				if (isTopLevelHeading(tr.doc, position)) {
					nextPositions.add(position);
				}
			}
			break;
	}

	return nextPositions;
};

const getCandidatePositions = (
	tr: ReadonlyTransaction,
	pluginState: BlockCollapsePluginState,
	action: BlockCollapseAction | undefined,
): ReadonlySet<number> => {
	const positions =
		tr.docChanged && pluginState.collapsedHeadingPositions.size > 0
			? mapCollapsedHeadingPositions(pluginState.collapsedHeadingPositions, tr)
			: pluginState.collapsedHeadingPositions;

	return applyAction(
		action,
		positions,
		tr,
		tr.docChanged ? undefined : pluginState.collapsedSectionEnds,
	);
};

const createPluginState = (
	tr: ReadonlyTransaction,
	pluginState: BlockCollapsePluginState,
	candidatePositions: ReadonlySet<number>,
): BlockCollapsePluginState => {
	if (candidatePositions.size === 0) {
		return pluginState.collapsedHeadingPositions.size === 0
			? pluginState
			: createInitialPluginState();
	}

	return reconcileCollapsedContent(tr.doc, candidatePositions);
};

export const updatePluginState = (
	tr: ReadonlyTransaction,
	pluginState: BlockCollapsePluginState,
	action: BlockCollapseAction | undefined,
): BlockCollapsePluginState =>
	createPluginState(tr, pluginState, getCandidatePositions(tr, pluginState, action));
