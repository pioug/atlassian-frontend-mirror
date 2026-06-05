import { Fragment } from '@atlaskit/editor-prosemirror/model';
import type { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';

/**
 * Checks if a node type is a valid child of a parent node by creating a minimal valid
 * instance and validating it against the parent's content expression. Unlike ProseMirror's
 * canReplaceWith, this checks general type compatibility without requiring a specific insertion index.
 */
export function isNodeTypeValidChildOf(
	childTypeName: string,
	parentNode: PMNode,
	schema: Schema,
): boolean {
	const childType = schema.nodes[childTypeName];
	if (!childType) {
		return false;
	}
	const candidate = childType.createAndFill();
	if (!candidate) {
		return false;
	}
	return parentNode.type.validContent(Fragment.from(candidate));
}
