import { type AstNode, type JastVisitor } from '../types';

export abstract class AbstractJastVisitor<Result> implements JastVisitor<Result> {
	/**
	 * The default implementation calls AstNode#accept on the specified node.
	 * @param node
	 */
	visit(node: AstNode): Result {
		return node.accept(this);
	}

	/**
	 * The default implementation initializes the aggregate result to defaultResult(). Before visiting each child, it
	 * calls shouldVisitNextChild; if the result is false no more children are visited and the current aggregate result is
	 * returned. After visiting a child, the aggregate result is updated by calling aggregateResult with the previous
	 * aggregate result and the result of visiting the child.
	 */
	visitChildren(node: AstNode): Result {
		let result = this.defaultResult();
		const children = node.getChildren();
		for (let i = 0; i < children.length; i++) {
			if (!this.shouldVisitNextChild(node, result)) {
				break;
			}
			const childResult = children[i].accept(this);
			result = this.aggregateResult(result, childResult);
		}
		return result;
	}

	/**
	 * Aggregates the results of visiting multiple children of a node.
	 *
	 * The default implementation returns `nextResult`, meaning
	 * {@link #visitChildren} will return the result of the last child visited
	 * (or return the initial value if the node has no children).
	 *
	 * @param _aggregate The previous aggregate value. In the default
	 * implementation, the aggregate value is initialized to
	 * {@link #defaultResult}, which is passed as the `aggregate` argument
	 * to this method after the first child node is visited.
	 * @param nextResult The result of the immediately preceeding call to visit
	 * a child node.
	 *
	 * @returns The updated aggregate result.
	 */
	protected aggregateResult(_aggregate: Result, nextResult: Result): Result {
		return nextResult;
	}
	/**
	 * This method is called before visiting each child in
	 * {@link #visitChildren}. When the method is first called\ `currentResult`
	 * will be the initial value (in the default implementation, the initial value
	 * is returned by a call to {@link #defaultResult}).
	 *
	 * The default implementation always returns `true`, indicating that
	 * `visitChildren` should only return after all children are visited.
	 * One reason to override this method is to provide a "short circuit"
	 * evaluation option for situations where the result of visiting a single
	 * child has the potential to determine the result of the visit operation as
	 * a whole.
	 *
	 * @param _node The {@link AstNode} whose children are currently being
	 * visited.
	 * @param _currentResult The current aggregate result of the children visited
	 * to the current point.
	 *
	 * @returns `true` to continue visiting children. Otherwise return
	 * `false` to stop visiting children and immediately return the
	 * current aggregate result from {@link #visitChildren}.
	 */
	protected shouldVisitNextChild(_node: AstNode, _currentResult: Result) {
		return true;
	}

	/**
	 * Gets the default value returned by visitor methods.
	 *
	 * The default implementation of {@link #visitChildren visitChildren}
	 * initializes its aggregate result to this value.
	 *
	 * @returns The default value returned by visitor methods.
	 */
	protected abstract defaultResult(): Result;
}
