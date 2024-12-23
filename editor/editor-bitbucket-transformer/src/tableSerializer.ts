import type { MarkdownSerializerState } from '@atlaskit/editor-prosemirror/markdown';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

const isHeaderRow = (row: PMNode): boolean => row.child(0).type.name === 'tableHeader';

const isHeaderRowPresent = (table: PMNode): boolean => {
	let headerRowPresent = false;
	table.content.forEach((row: PMNode) => {
		if (isHeaderRow(row)) {
			headerRowPresent = true;
		}
	});
	return headerRowPresent;
};

const renderNode = (state: MarkdownSerializerState, node: PMNode, index: number): void => {
	if (index > 0) {
		state.write(' ');
	}
	node.content.forEach((child: PMNode, i: number) => {
		if (child.isTextblock || child.type.name === 'mediaSingle') {
			if (i > 0) {
				state.write(' ');
			}
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(state as any).context.insideTable = true;
			state.renderInline(child);
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(state as any).context.insideTable = false;
		} else {
			renderNode(state, child, i);
		}
	});
};

const renderInlineContent = (state: MarkdownSerializerState, node: PMNode) => {
	state.write('| ');
	renderNode(state, node, 0);
	state.write(' ');
};

export default {
	table(state: MarkdownSerializerState, node: PMNode) {
		if (isHeaderRowPresent(node)) {
			node.content.forEach((child, i) => state.render(child, node, i));
			state.closeBlock(node);
		}
	},
	tableRow(state: MarkdownSerializerState, node: PMNode) {
		node.content.forEach((child, i) => {
			state.render(child, node, i);
		});
		state.write('|');
		state.ensureNewLine();
		if (isHeaderRow(node)) {
			for (let i = 0; i < node.childCount; i++) {
				state.write('| --- ');
			}
			state.write('|');
			state.ensureNewLine();
		}
	},
	tableHeader: renderInlineContent,
	tableCell: renderInlineContent,
};
