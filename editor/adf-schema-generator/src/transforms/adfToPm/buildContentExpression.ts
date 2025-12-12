export const buildContentExpression = (expr: Array<string>, operator?: string): string => {
	const exprs = Array(...new Set(expr));
	let expression = exprs.length === 1 ? exprs[0] : `(${exprs.join(' | ')})`;
	if (operator) {
		expression = `${expression}${operator}`;
	}
	return expression;
};
