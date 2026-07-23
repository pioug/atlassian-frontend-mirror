import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

const RENDERER_DOCUMENT_POSITION_OFFSET = 1;

export type HeadingSection = {
	contentFrom: number;
	headingPos: number;
	level: number;
	to: number;
};

/** Builds collapsible ranges for headings that are direct children of the renderer document. */
export function buildTopLevelHeadingSections(pmDocument?: PMNode): HeadingSection[] {
	if (!pmDocument) {
		return [];
	}

	const sections: HeadingSection[] = [];
	const openSections: HeadingSection[] = [];
	const documentEnd = pmDocument.content.size + RENDERER_DOCUMENT_POSITION_OFFSET;

	pmDocument.forEach((node, offset) => {
		if (node.type.name !== 'heading') {
			return;
		}

		const headingPos = offset + RENDERER_DOCUMENT_POSITION_OFFSET;
		const level = Number(node.attrs.level);

		while (openSections.length > 0 && openSections[openSections.length - 1].level >= level) {
			const section = openSections.pop();
			if (section) {
				section.to = headingPos;
			}
		}

		const section: HeadingSection = {
			contentFrom: headingPos + node.nodeSize,
			headingPos,
			level,
			to: documentEnd,
		};
		sections.push(section);
		openSections.push(section);
	});

	return sections;
}
