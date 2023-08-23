import { AstNode } from '../types';

/**
 * Default `getChildren` implementation for nodes in the AST that have no children.
 */
export const noChildren = () => [];

/**
 * Assign the provided node as the parent of all child nodes.
 */
export const assignParent = (node: AstNode): void => {
  node.getChildren().forEach(child => {
    child.parent = node;
  });
};
