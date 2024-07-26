import { findSelectedNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { isDatasourceNode } from '../../utils';

import { DATASOURCE_TABLE_LAYOUTS, type DatasourceTableLayout } from './types';

export const getDatasource = (editorView: EditorView) => {
	const { selection, schema } = editorView.state;
	const { blockCard } = schema.nodes;

	const findResult = findSelectedNodeOfType([blockCard])(selection);

	if (findResult && isDatasourceNode(findResult.node)) {
		return {
			...findResult,
			node: findResult.node,
		};
	}

	return {
		node: undefined,
		pos: undefined,
	};
};

export const isDatasourceTableLayout = (layout: unknown): layout is DatasourceTableLayout => {
	return DATASOURCE_TABLE_LAYOUTS.some((l) => l === layout);
};
