import type { ASTPath, CallExpression, Comment, JSCodeshift } from 'jscodeshift';

export function addOrUpdateEslintIgnoreComment(
	j: JSCodeshift,
	tokenValue: string,
	fallbackValue: string | undefined,
	callPath: ASTPath<CallExpression>,
) {
	const commentText = `eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage -- The token value "${tokenValue}" and fallback "${fallbackValue}" do not match and can't be replaced automatically.`;
	// first see if we can add the comment to the parent object property
	const updatedCommentInObjectExpression =
		addOrUpdateEslintIgnoreCommentForParentInObjectExpression(j, commentText, callPath);
	// if the comment was not added to the parent object property, add it to the node itself
	if (!updatedCommentInObjectExpression) {
		addOrUpdateEslintIgnoreCommentForNodeItself(j, commentText, callPath);
	}
}

function addOrUpdateEslintIgnoreCommentForNodeItself(
	j: JSCodeshift,
	commentText: string,
	callPath: ASTPath<CallExpression>,
): void {
	const leadingComments =
		(callPath.node as unknown as { leadingComments: Comment[] }).leadingComments || [];
	const existingCommentIndex = leadingComments.findIndex((comment) =>
		comment.value.includes(
			'eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage',
		),
	);
	const commentLine = j.commentLine(commentText, true);
	if (existingCommentIndex !== -1) {
		// Replace the existing comment
		// Note: in order to modify the comment, it's fine to update it in the `leadingComments` array
		leadingComments[existingCommentIndex] = commentLine;
	} else {
		// Add a new comment if none exists
		// Note: Adding new comment to 'leadingComments' doesn't affect anything, we need to add it to 'comments' property
		callPath.node.comments = [commentLine];
	}
}

function addOrUpdateEslintIgnoreCommentForParentInObjectExpression(
	j: JSCodeshift,
	commentText: string,
	callPath: ASTPath<CallExpression>,
): boolean {
	const parent = callPath.parentPath;
	// Check if the parent node is an ObjectProperty
	if (parent && parent.node.type === 'ObjectProperty') {
		const grandparent = parent.parentPath;
		// Check if the grandparent is an ObjectExpression
		if (grandparent && grandparent.node.type === 'ObjectExpression') {
			// Check for existing leading comments
			const leadingComments =
				(parent.node as unknown as { leadingComments: Comment[] }).leadingComments || [];
			const existingCommentIndex = leadingComments.findIndex((comment) =>
				comment.value.includes(
					'eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage',
				),
			);
			const commentLine = j.commentLine(commentText, true);
			if (existingCommentIndex !== -1) {
				// Replace the existing comment
				leadingComments[existingCommentIndex] = commentLine;
			} else {
				// Add a new comment if none exists
				parent.node.comments = [commentLine, ...(parent.node.comments || [])];
			}
			return true;
		}
	}
	return false;
}
