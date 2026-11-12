import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type {
	ComponentIdentifier,
	RegisterComponent,
} from '@atlaskit/editor-ui-control-model/types';

/**
 * The `uiControlRegistry` lookups the host needs. `getComponent` is an indexed lookup of one
 * component, and `getComponents` returns the cached components of one surface.
 */
export type ElementToolbarRegistry = {
	getComponent: (component: ComponentIdentifier) => RegisterComponent | undefined;
	getComponents: (key: string) => RegisterComponent[];
};

export type ActiveElementToolbar = {
	components: RegisterComponent[];
	key: string;
	node: PMNode;
	pos: number;
};

const findActive = (
	node: PMNode,
	pos: number,
	registry: ElementToolbarRegistry,
): ActiveElementToolbar | undefined => {
	// By convention an element toolbar root uses its node type name as its key.
	const key = node.type.name;
	const root = registry.getComponent({ type: 'toolbar', key });
	if (root && !root.isHidden?.()) {
		return { components: registry.getComponents(key), key, node, pos };
	}
};

/**
 * Finds the element toolbar for the current selection: the selected node first, then the deepest
 * ancestor of the selection whose root is not hidden. Cost is O(selection depth) indexed root
 * lookups, then one surface lookup.
 */
export const getActiveElementToolbar = (
	state: EditorState,
	registry: ElementToolbarRegistry,
): ActiveElementToolbar | undefined => {
	const { selection } = state;

	if (selection instanceof NodeSelection) {
		const active = findActive(selection.node, selection.from, registry);
		if (active) {
			return active;
		}
	}

	const { $from } = selection;
	for (let depth = $from.depth; depth > 0; depth--) {
		const active = findActive($from.node(depth), $from.before(depth), registry);
		if (active) {
			return active;
		}
	}
};
