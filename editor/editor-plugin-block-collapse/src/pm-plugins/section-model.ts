import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { BlockCollapseSection } from '../blockCollapsePluginType';

/**
 * Returns the top-level content owned by a heading if collapsible. A section ends at the next
 * heading whose level is equal to or higher than the owning heading. Returns null if the heading
 * is not found, is nested, or is empty and the experiment is not enabled.
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

	if (from === to && !isExperimentEnabled('platform_editor_empty_section_toggle')) {
		return null;
	}

	return { from, headingPos, to };
};

export const blockCollapseSectionContainsRange = (
	doc: PMNode,
	headingPos: number,
	from: number,
	to: number,
): boolean => {
	const section = getBlockCollapseSection(doc, headingPos);
	// Explicitly exclude empty sections (section.from === section.to) to prevent boundary expansion
	if (!section || section.from === section.to) {
		return false;
	}
	return from >= section.from && to <= section.to;
};
