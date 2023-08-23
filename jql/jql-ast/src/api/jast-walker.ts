import { AstNode, Jast, JastListener } from '../types';

/**
 * Default method to walk an AST an invoke the corresponding listener methods for each node.
 *
 * @param listener Listener to invoke enter and exit methods
 * @param jast JQL AST to walk
 */
export const walkAST = (listener: JastListener, jast: Jast): void => {
  jast.query && walkNode(listener, jast.query);
};

const walkNode = (listener: JastListener, node: AstNode): void => {
  listener.enterEveryNode && listener.enterEveryNode(node);
  node.enterNode(listener);
  node.getChildren().forEach(child => walkNode(listener, child));
  node.exitNode(listener);
  listener.exitEveryNode && listener.exitEveryNode(node);
};
