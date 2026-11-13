/**
 * The ADF strike parser recognises the `text-decoration` shorthand when a decorated NodeView is
 * reconciled. Use the visually equivalent longhand for AI suggestion diffs so presentation-only
 * styling cannot be retained as document content.
 */
export const getStandardDeletedTextDecorationStyle = (): {
	textDecorationLine: 'line-through';
} => ({
	textDecorationLine: 'line-through',
});
