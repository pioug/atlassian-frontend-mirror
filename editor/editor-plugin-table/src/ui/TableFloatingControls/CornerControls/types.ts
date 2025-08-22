import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export type CornerControlProps = {
	editorView: EditorView;
	hoveredRows?: number[];
	isHeaderColumnEnabled?: boolean;
	isHeaderRowEnabled?: boolean;
	isInDanger?: boolean;
	isResizing?: boolean;
	stickyTop?: number;
	tableRef?: HTMLTableElement;
};
