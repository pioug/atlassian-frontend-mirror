import React from 'react';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { TableCellEdgeProps } from '../tableCell';

type EdgeMap = Map<number, TableCellEdgeProps>;

// The table node includes the number-column setting. Cache only its edge data.
const edgeCache = new WeakMap<PMNode, EdgeMap>();
const noEdges: TableCellEdgeProps = {
	reachesTop: false,
	reachesBottom: false,
	reachesLeft: false,
	reachesRight: false,
};

export const getCachedTableEdges = (node: PMNode): EdgeMap | undefined => edgeCache.get(node);

export const cacheTableEdges = (node: PMNode, edges: EdgeMap): void => {
	// The existing geometry builder provides every cell; retain only the perimeter.
	for (const [offset, props] of edges) {
		if (!props.reachesTop && !props.reachesBottom && !props.reachesLeft && !props.reachesRight) {
			edges.delete(offset);
		}
	}
	edgeCache.set(node, edges);
};

export const withTableCellEdgeProps = (
	element: React.ReactElement,
	edges: TableCellEdgeProps = noEdges,
): React.ReactElement => {
	const current = element.props as TableCellEdgeProps;
	if (
		Boolean(current.reachesTop) === edges.reachesTop &&
		Boolean(current.reachesBottom) === edges.reachesBottom &&
		Boolean(current.reachesLeft) === edges.reachesLeft &&
		Boolean(current.reachesRight) === edges.reachesRight
	) {
		return element;
	}
	// Also clears stale edges when a previously decorated element becomes an interior cell.
	return React.cloneElement(element, edges);
};
