// eslint-disable-next-line import/no-extraneous-dependencies
import type { DocBuilder, RefsNode } from '@atlaskit/editor-common/types';
import { EditorState } from '@atlaskit/editor-prosemirror/state';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { BuilderContent } from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p, table, td, th } from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { defaultSchema } from '@atlaskit/editor-test-helpers/schema';

import { setSelectionTransform } from './set-selection';

export const createEditorState = (content: DocBuilder) => {
	const state = EditorState.create({
		doc: content(defaultSchema),
	});

	const { tr } = state;
	// @ts-ignore
	setSelectionTransform(state.doc, tr);
	return state.apply(tr);
};

export const createTable = (...content: BuilderContent[]): RefsNode => {
	return table()(...content)(defaultSchema);
};
export const createTableWithDoc = (...content: BuilderContent[]): RefsNode => {
	const contents = table()(...content);
	return createDoc(contents);
};
export const createDoc = (...content: BuilderContent[]): RefsNode => {
	return doc(...content)(defaultSchema);
};
export const createTd = ({ colspan = 1, rowspan = 1, content = p('x') }): RefsNode => {
	return td({ colspan, rowspan })(content)(defaultSchema);
};

export const c = (colspan: number, rowspan: number, content = p('x')) =>
	td({ colspan, rowspan })(content);
export const c11 = c(1, 1);
export const cCursor = td()(p('x{cursor}'));
export const cEmpty = td()(p());
export const cAnchor = td()(p('A{anchor}'));
export const cHead = td()(p('H{head}'));

export const h = (colspan: number, rowspan: number, content = p('x')) =>
	th({ colspan, rowspan })(content);
export const hEmpty = th()(p());
export const hCursor = th()(p('x{cursor}'));
export const h11 = h(1, 1);
