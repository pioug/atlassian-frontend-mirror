/* eslint-disable @atlaskit/editor/no-re-export -- VOLTC-139 tracks removal of these deprecated compatibility re-export shims. */
import type { NodeSpec, MarkSpec } from '@atlaskit/editor-prosemirror/model';
import { Schema } from '@atlaskit/editor-prosemirror/model';

import { addItems } from './add-items';
import { markGroupDeclarationsNames } from './mark-group-declarations-names';
import { marksInOrder } from './marks-in-order';
import { nodesInOrder } from './nodes-in-order';
import { sanitizeNodes } from './sanitizeNodes';

/**
 * Creates a schema preserving order of marks and nodes.
 */
export function createSchema<N extends string = string, M extends string = string>(
	config: SchemaConfig<N, M>,
): Schema<N, M> {
	const { customNodeSpecs, customMarkSpecs } = config;
	const nodesConfig = Object.keys(customNodeSpecs || {}).concat(config.nodes);
	const marksConfig = Object.keys(customMarkSpecs || {})
		.concat(config.marks || [])
		.concat(markGroupDeclarationsNames);

	let nodes = addItems(nodesInOrder, nodesConfig, customNodeSpecs) as Record<string, NodeSpec>;
	const marks = addItems(marksInOrder, marksConfig, customMarkSpecs) as Record<string, MarkSpec>;
	nodes = sanitizeNodes(nodes, marks);
	return new Schema<string, string>({
		nodes,
		marks,
	});
}

export interface SchemaConfig<N = string, M = string> {
	customMarkSpecs?: SchemaCustomMarkSpecs;
	customNodeSpecs?: SchemaCustomNodeSpecs;
	marks?: M[];
	nodes: N[];
}

export interface SchemaBuiltInItem {
	name: string;
	spec: NodeSpec | MarkSpec;
}

export interface SchemaCustomNodeSpecs {
	[name: string]: NodeSpec;
}

export interface SchemaCustomMarkSpecs {
	[name: string]: MarkSpec;
}

export const allowCustomPanel: boolean = true;

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { getNodesAndMarksMap } from './get-nodes-and-marks-map';
