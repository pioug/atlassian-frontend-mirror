/**
 * Temporary file which extracts function from `editor-common`.
 *
 * Eventually we will deprecate and delete EditorActions. This is here to
 * help decouple it from editor-common
 */
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

const transformer = new JSONTransformer();
export function toJSON(node: PMNode): JSONDocNode {
	return transformer.encode(node);
}
