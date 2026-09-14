import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { BlockCollapseSection } from '../blockCollapsePluginType';

/**
 * Returns the top-level content owned by a heading. A section ends at the next heading whose level
 * is equal to or higher than the owning heading.
 */
export const getBlockCollapseSection = (
	doc: PMNode,
	headingPos: number,
): BlockCollapseSection | null => {
	const { index, node, offset } = doc.childAfter(headingPos);
	if (!node || offset !== headingPos || node.type.name !== 'heading') {
		return null;
	}

	const from = headingPos + node.nodeSize;
	let to = from;

	for (let childIndex = index + 1; childIndex < doc.childCount; childIndex++) {
		const child = doc.child(childIndex);
		if (child.type.name === 'heading' && child.attrs.level <= node.attrs.level) {
			break;
		}
		to += child.nodeSize;
	}

	return from < to ? { from, headingPos, to } : null;
};

export const blockCollapseSectionContainsRange = (
	doc: PMNode,
	headingPos: number,
	from: number,
	to: number,
): boolean => {
	const section = getBlockCollapseSection(doc, headingPos);
	return Boolean(section && from >= section.from && to <= section.to);
};
