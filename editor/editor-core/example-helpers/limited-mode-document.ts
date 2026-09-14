import { LIMITED_MODE_DEFAULT_DOC_SIZE_THRESHOLD } from '@atlaskit/editor-common/limited-mode-document-thresholds';

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AdfNode = Record<string, any>;

const LOREM =
	'The quick brown fox jumps over the lazy dog while the editor renders yet another paragraph of filler text to grow this document. ';

const paragraph = (text: string): AdfNode => ({
	type: 'paragraph',
	content: [{ type: 'text', text }],
});

const heading = (text: string): AdfNode => ({
	type: 'heading',
	attrs: { level: 2 },
	content: [{ type: 'text', text }],
});

const cell = (type: 'tableCell' | 'tableHeader', text: string): AdfNode => ({
	type,
	attrs: {},
	content: [paragraph(text)],
});

const ROW_COUNT = 5;
const COLUMN_COUNT = 3;

const table = (index: number): AdfNode => ({
	type: 'table',
	attrs: {
		isNumberColumnEnabled: false,
		layout: 'default',
		localId: `limited-mode-table-${index}`,
		// Alternate between a table that has been resized and one that has not, so both the explicit
		// and the default table container width are represented.
		...(index % 2 === 0 ? { width: 600 } : {}),
	},
	content: [
		{
			type: 'tableRow',
			content: Array.from({ length: COLUMN_COUNT }, (_, column) =>
				cell('tableHeader', `Column ${column + 1}`),
			),
		},
		...Array.from({ length: ROW_COUNT - 1 }, (_, row) => ({
			type: 'tableRow',
			content: Array.from({ length: COLUMN_COUNT }, (_, column) =>
				cell('tableCell', `Cell ${row + 1}.${column + 1}`),
			),
		})),
	],
});

const section = (index: number): AdfNode[] => [
	heading(`Section ${index + 1}`),
	paragraph(LOREM.repeat(2)),
	table(index),
	paragraph(LOREM),
];

/**
 * Approximates the ProseMirror `nodeSize` of an ADF node: text counts for its length, every other
 * node counts for its content plus its own open and close tokens. Used so the generated document is
 * known to breach the limited mode threshold rather than relying on hand arithmetic.
 */
const estimateNodeSize = (node: AdfNode): number => {
	if (node.type === 'text') {
		return String(node.text ?? '').length;
	}
	const content: AdfNode[] = node.content ?? [];
	return 2 + content.reduce((total, child) => total + estimateNodeSize(child), 0);
};

/**
 * Builds a document large enough to put the editor into limited mode on load — it keeps adding
 * sections until it is comfortably past `LIMITED_MODE_DEFAULT_DOC_SIZE_THRESHOLD`.
 *
 * Each section contains a table so that table behaviour in limited mode (no table width handle when
 * `platform_editor_table_limited_mode` is on) can be inspected without having to build a large page
 * by hand.
 */
export const createLimitedModeDocument = (): AdfNode => {
	const content: AdfNode[] = [];
	// A margin over the threshold so the document stays in limited mode even after a few deletions.
	const targetSize = LIMITED_MODE_DEFAULT_DOC_SIZE_THRESHOLD * 1.2;

	let size = 2;
	for (let index = 0; size <= targetSize; index++) {
		const nodes = section(index);
		content.push(...nodes);
		size += nodes.reduce((total, node) => total + estimateNodeSize(node), 0);
	}

	return {
		version: 1,
		type: 'doc',
		content,
	};
};
