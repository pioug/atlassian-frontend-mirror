/* eslint-disable @atlaskit/editor/no-re-export -- VOLTC-139 tracks removal of these deprecated compatibility re-export shims. */
import type {
	DOMOutputSpec,
	Node as PMNode,
	NodeSpec,
	Mark,
	MarkSpec,
} from '@atlaskit/editor-prosemirror/model';

import type { createPMMarkSpecFactory } from './create-pm-mark-spec-factory';
import type { createPMNodeSpecFactory } from './create-pm-node-spec-factory';

export type NodeSpecOptions<N extends PMNode> = {
	parseDOM?: NodeSpec['parseDOM'];
	toDebugString?: () => string;
	toDOM?: (node: N) => DOMOutputSpec;
};

export type NodeSpecFactory = typeof createPMNodeSpecFactory;

export type MarkSpecOptions<M extends Mark> = {
	parseDOM?: MarkSpec['parseDOM'];
	toDebugString?: () => string;
	toDOM?: (mark: M, inline: boolean) => DOMOutputSpec;
};

export type MarkSpecFactory = typeof createPMMarkSpecFactory;

/** Result of calling {@link createPMMarkSpecFactory} with a concrete mark spec (for isolated declarations). */
export type PMMarkSpecFactoryInstance<M extends Omit<Mark, 'toDOM' | 'parseDOM'> = Mark> = (
	options: MarkSpecOptions<M>,
) => MarkSpec;

/** Result of calling {@link createPMNodeSpecFactory} with a concrete node spec (for isolated declarations). */
export type PMNodeSpecFactoryInstance<N extends Omit<PMNode, 'toDOM' | 'parseDOM'> = PMNode> = (
	options: NodeSpecOptions<N>,
) => NodeSpec;

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { createPMNodeSpecFactory } from './create-pm-node-spec-factory';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { createPMMarkSpecFactory } from './create-pm-mark-spec-factory';
