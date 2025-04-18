import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';

import type { AlignmentState } from '../types';

export const getActiveAlignment = (state: EditorState): AlignmentState | undefined => {
	if (state.selection instanceof CellSelection) {
		const marks: string[] = [];
		state.selection.forEachCell((cell) => {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const mark = cell.firstChild!.marks.filter(
				(mark) => mark.type === state.schema.marks.alignment,
			)[0];
			marks.push(mark ? mark.attrs.align : 'start');
		});
		return marks.every((mark) => mark === marks[0]) ? (marks[0] as AlignmentState) : 'start';
	}

	const node = findParentNodeOfType([state.schema.nodes.paragraph, state.schema.nodes.heading])(
		state.selection,
	);
	const getMark =
		node && node.node.marks.filter((mark) => mark.type === state.schema.marks.alignment)[0];

	return (getMark && getMark.attrs.align) || 'start';
};
