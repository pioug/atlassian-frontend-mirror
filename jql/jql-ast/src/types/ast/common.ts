import { JastListener, JastVisitor } from '../api';

/**
 * Tuple representing the [start, stop] position of an element.
 */
export type Position = [number, number];

/**
 * Represents a string in both its raw (literal) and clean (semantic) versions.
 */
export type StringValue = {
  /**
   * Literal value for a string (with quotes and escaping preserved).
   */
  text: string;
  /**
   * Semantic value for a string (without quotes or escaping derived from those quotes).
   */
  value: string;
  /**
   * Tuple representing the character position of the string.
   */
  position: Position | null;
};

/**
 * Represents a node in the AST.
 */
export interface AstNode<Parent extends AstNode = AstNode<any>> {
  /**
   * Delegates to the appropriate visit method of the current node for the provided visitor.
   * @param visitor Visitor with the visit method to invoke.
   */
  accept: <Result>(visitor: JastVisitor<Result>) => Result;
  /**
   * Delegates to the appropriate enter method of the current node for the provided listener.
   * @param listener Listener with the enter method to invoke.
   */
  enterNode: (listener: JastListener) => void;
  /**
   * Delegates to the appropriate exit method of the current node for the provided listener.
   * @param listener Listener with the exit method to invoke.
   */
  exitNode: (listener: JastListener) => void;
  /**
   * Returns all children of the current node. Order of elements in the array must reflect the logic positional of nodes
   * in the tree to ensure correct traversal order for listeners/visitors.
   */
  getChildren: () => AstNode[];
  /**
   * Tuple representing the character position of the node or `null` if positional data has not been computed.
   */
  position: Position | null;
  /**
   * Node parent
   */
  parent: Parent | null;
}

/**
 * Denotes a node in the AST that can be removed from the tree.
 */
export interface Removable {
  /**
   * Remove the current node from its parent. The parent node is responsible for implementing the logic to remove any
   * references to the child node.
   */
  remove: () => void;
}

/**
 * Denotes a node in the AST that can be replaced with another node of a given type.
 */
export interface Replaceable<T extends AstNode> {
  /**
   * Replace the current node from its parent with the provided node. The parent node is responsible for implementing
   * the logic to replace any references to the child node.
   */
  replace: (node: T) => void;
}
