import { findSelectedNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { isDatasourceNode } from '../../pm-plugins/utils';
import type { DatasourceNode } from '../../types';

import { DATASOURCE_TABLE_LAYOUTS, type DatasourceTableLayout } from './types';

export const getDatasource = (
	editorView: EditorView | undefined,
):
	| {
			depth: number;
			node: DatasourceNode;
			pos: number;
			start: number;
	  }
	| {
			node: undefined;
			pos: undefined;
	  } => {
	if (editorView) {
		const { selection, schema } = editorView.state;
		const { blockCard } = schema.nodes;

		const findResult = findSelectedNodeOfType([blockCard])(selection);

		if (findResult && isDatasourceNode(findResult.node)) {
			return {
				...findResult,
				node: findResult.node,
			};
		}
	}

	return {
		node: undefined,
		pos: undefined,
	};
};

export const isDatasourceTableLayout = (layout: unknown): layout is DatasourceTableLayout => {
	return DATASOURCE_TABLE_LAYOUTS.some((l) => l === layout);
};
