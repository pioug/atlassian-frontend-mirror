import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import type { Node, Schema } from '@atlaskit/editor-prosemirror/model';
import { Transform } from '@atlaskit/editor-prosemirror/transform';
import { fg } from '@atlaskit/platform-feature-flags/fg';

/**
 * Returns true when documents have the same text and block structure, while ignoring marks and
 * attributes. This is useful when comparing documents produced by different serialization paths.
 */
export function areDocsEqualByBlockStructureAndText(node1: Node, node2: Node): boolean {
	if (fg('confluence_ncs_step_diffing_version_history')) {
		node1 = normalizeDocument(node1);
		node2 = normalizeDocument(node2);
	}

	if (node1.textContent !== node2.textContent) {
		return false;
	}

	const stripped1 = stripMarks(node1);
	const stripped2 = stripMarks(node2);
	return stripped1.nodeSize === stripped2.nodeSize && isBlockStructureEqual(stripped1, stripped2);
}

const transformers = new WeakMap<Schema, JSONTransformer>();

function normalizeDocument(node: Node): Node {
	const schema = node.type.schema;
	let transformer = transformers.get(schema);
	if (!transformer) {
		transformer = new JSONTransformer(schema);
		transformers.set(schema, transformer);
	}
	return transformer.parse(transformer.encode(node));
}

function stripMarks(doc: Node): Node {
	const tr = new Transform(doc);
	tr.removeMark(0, doc.content.size);
	return tr.doc;
}

function isBlockStructureEqual(node1: Node, node2: Node): boolean {
	if (node1.type !== node2.type || node1.childCount !== node2.childCount) {
		return false;
	}
	for (let index = 0; index < node1.childCount; index++) {
		if (!isBlockStructureEqual(node1.child(index), node2.child(index))) {
			return false;
		}
	}
	return true;
}
