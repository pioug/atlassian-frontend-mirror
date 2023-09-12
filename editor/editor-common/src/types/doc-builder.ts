import type { Schema } from '@atlaskit/editor-prosemirror/model';
import type { Node } from '@atlaskit/editor-prosemirror/model';

/**
 * Represents a ProseMirror "position" in a document.
 */
export type position = number;

/**
 * A useful feature of the builder is being able to declaratively mark positions
 * in content using the curly braces e.g. `{<>}`.
 *
 * These positions are called "refs" (inspired by React), and are tracked on
 * every node in the tree that has a ref on any of its descendants.
 */
export type Refs = { [name: string]: position };

/**
 * A standard ProseMirror Node that also tracks refs.
 */
export interface RefsNode extends Node {
  refs: Refs;
  ignoreContent?: boolean;
  originalAttributes?: unknown;
}

export type DocBuilder = (schema: Schema) => RefsNode;
