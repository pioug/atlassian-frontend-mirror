import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export type CornerControlProps = {
	editorView: EditorView;
	tableRef?: HTMLTableElement;
	isInDanger?: boolean;
	isResizing?: boolean;
	hoveredRows?: number[];
	isHeaderColumnEnabled?: boolean;
	isHeaderRowEnabled?: boolean;
	stickyTop?: number;
};
