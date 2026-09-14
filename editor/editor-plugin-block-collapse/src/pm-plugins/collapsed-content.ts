import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';

import type { BlockCollapsePluginState } from './types';

const COLLAPSED_CONTENT_DECORATION_TYPE = 'block-collapse-collapsed-content';

type ActiveCollapsedHeading = Readonly<{
	contentFrom: number;
	level: number;
	pos: number;
}>;

const createCollapsedContentDecoration = (node: PMNode, pos: number): Decoration =>
	Decoration.node(
		pos,
		pos + node.nodeSize,
		{
			'aria-hidden': 'true',
			'data-collapsible-heading-collapsed-content': 'true',
			hidden: 'true',
			// Author styles such as the editor's ordered-list display rule can override
			// the browser's default styling for the hidden attribute.
			// CodeMirror owns the code block root and sets display: flex !important.
			// An inline important declaration is needed to override that vendor rule.
			style: node.type.name === 'codeBlock' ? 'display: none !important;' : 'display: none;',
		},
		{ type: COLLAPSED_CONTENT_DECORATION_TYPE },
	);

export const isTopLevelHeading = (doc: PMNode, pos: number): boolean => {
	const { node, offset } = doc.childAfter(pos);
	return offset === pos && node?.type.name === 'heading';
};

export const reconcileCollapsedContent = (
	doc: PMNode,
	candidatePositions: ReadonlySet<number>,
): BlockCollapsePluginState => {
	const activeHeadings: ActiveCollapsedHeading[] = [];
	const collapsedHeadingAtSectionEnd = new Map<number, number>();
	const collapsedHeadingPositions = new Set<number>();
	const collapsedSectionEnds = new Map<number, number>();
	const decorations: Decoration[] = [];

	const finishSection = (heading: ActiveCollapsedHeading, sectionEnd: number) => {
		if (sectionEnd <= heading.contentFrom) {
			return;
		}
		collapsedHeadingPositions.add(heading.pos);
		collapsedSectionEnds.set(heading.pos, sectionEnd);
		// Sections close from the most deeply nested heading to the outer heading. The final value
		// is therefore the visible, outermost collapsed heading before this section boundary.
		collapsedHeadingAtSectionEnd.set(sectionEnd, heading.pos);
	};

	doc.forEach((node, pos) => {
		const headingLevel = node.type.name === 'heading' ? Number(node.attrs.level) : undefined;
		if (headingLevel !== undefined) {
			while (
				activeHeadings.length > 0 &&
				activeHeadings[activeHeadings.length - 1].level >= headingLevel
			) {
				const heading = activeHeadings.pop();
				if (heading) {
					finishSection(heading, pos);
				}
			}
		}

		if (activeHeadings.length > 0) {
			decorations.push(createCollapsedContentDecoration(node, pos));
		}

		if (headingLevel !== undefined && candidatePositions.has(pos)) {
			activeHeadings.push({
				contentFrom: pos + node.nodeSize,
				level: headingLevel,
				pos,
			});
		}
	});

	while (activeHeadings.length > 0) {
		const heading = activeHeadings.pop();
		if (heading) {
			finishSection(heading, doc.content.size);
		}
	}

	return {
		collapsedHeadingAtSectionEnd,
		collapsedHeadingPositions,
		collapsedSectionEnds,
		decorations: DecorationSet.create(doc, decorations),
	};
};
