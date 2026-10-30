import {
	BLOCK_CONTROL_UI_CONTEXT,
	type BlockControlUIContext,
} from '@atlaskit/editor-common/block-controls/block-control-ui-context';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { createSurfaceContext } from '@atlaskit/editor-ui-control-model/create-surface-context';
import type { RegisterComponent, SurfaceContext } from '@atlaskit/editor-ui-control-model/types';

import type { ActiveNode } from '../blockControlsPluginType';
import {
	getBlockControlsLeftSurfaceComponents,
	getBlockControlsRightSurfaceComponents,
} from '../ui/block-controls-surface-components';
import { createBlockControlsSurfaceContextForPosition } from '../ui/block-controls-surface-context';
import type { BlockControlsSurfaceTarget } from '../ui/block-controls-surface-targets';
import { areBlockControlsSurfaceContextsEqual } from './are-block-controls-surface-contexts-equal';

export type SurfaceDescriptor = BlockControlsSurfaceTarget & {
	readonly anchorName: string;
	readonly blockControlsContext: BlockControlUIContext;
	readonly isTopLevel: boolean;
	readonly surfaceComponents: RegisterComponent[];
	readonly surfaceContext: SurfaceContext;
};

type Input = {
	activeNode: ActiveNode | undefined;
	components: RegisterComponent[];
	state: EditorState;
	surfaceActiveNodes: ReadonlyMap<number, ActiveNode> | undefined;
	surfaceAnchors: ReadonlyMap<number, string>;
	targets: readonly BlockControlsSurfaceTarget[];
};

/**
 * Resolves each target into the controls, context and anchor information needed to render a surface.
 * When a previous descriptor still matches, reuse it without rerunning component visibility
 * predicates. The caller must omit `previous` when registry or external state changes invalidate
 * those results. Targets without an anchor, a valid context or renderable components are omitted.
 */
const createDescriptors = (
	{ activeNode, components, state, surfaceActiveNodes, surfaceAnchors, targets }: Input,
	resolveComponents: typeof getBlockControlsLeftSurfaceComponents,
	previous?: ReadonlyMap<string, SurfaceDescriptor>,
): SurfaceDescriptor[] =>
	targets.flatMap((target) => {
		const anchorName = surfaceAnchors.get(target.position);
		if (!anchorName) {
			return [];
		}
		const context = createBlockControlsSurfaceContextForPosition(
			state,
			target.position,
			surfaceActiveNodes?.get(target.position) ?? activeNode,
		);
		if (!context) {
			return [];
		}
		const cached = previous?.get(anchorName);
		if (
			cached &&
			cached.position === target.position &&
			cached.source === target.source &&
			areBlockControlsSurfaceContextsEqual(cached.blockControlsContext, context)
		) {
			return [cached];
		}
		const surfaceContext = createSurfaceContext(BLOCK_CONTROL_UI_CONTEXT, context);
		const surfaceComponents = resolveComponents(components, surfaceContext);
		if (!surfaceComponents) {
			return [];
		}
		return [
			{
				...target,
				anchorName,
				blockControlsContext: context,
				isTopLevel: context.targetNode.parentType === 'doc',
				surfaceComponents,
				surfaceContext,
			},
		];
	});

/**
 * Creates a cache owned by one editor view and surface side on the gated CLS fix path.
 * Unchanged descriptors let memoized surfaces skip rendering; preserving the array reference also
 * lets SurfaceLifecycle skip publishing an otherwise unchanged snapshot. Registry changes or
 * explicit invalidation force predicates to run again, even if the document context is unchanged.
 */
export const createSurfaceDescriptorResolver = (
	side: 'left' | 'right',
): ((input: Input, invalidated: boolean) => SurfaceDescriptor[]) => {
	let descriptors: SurfaceDescriptor[] = [];
	let components: RegisterComponent[] = [];
	return (input: Input, invalidated: boolean): SurfaceDescriptor[] => {
		const registryUnchanged =
			components.length === input.components.length &&
			components.every((component, index) => component === input.components[index]);
		const previous =
			!invalidated && registryUnchanged
				? new Map(descriptors.map((descriptor) => [descriptor.anchorName, descriptor]))
				: undefined;
		const next = createDescriptors(
			input,
			side === 'left'
				? getBlockControlsLeftSurfaceComponents
				: getBlockControlsRightSurfaceComponents,
			previous,
		);
		components = input.components;
		if (
			next.length !== descriptors.length ||
			next.some((descriptor, index) => descriptor !== descriptors[index])
		) {
			descriptors = next;
		}
		return descriptors;
	};
};
