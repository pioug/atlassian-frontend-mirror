export const CLAUSE_OPERATOR_NOT = 'not';

export const OPERATOR_EQUALS = '=';
export const OPERATOR_NOT_EQUALS = '!=';
export const OPERATOR_GT = '>';
export const OPERATOR_LT = '<';
export const OPERATOR_GT_EQUALS = '>=';
export const OPERATOR_LT_EQUALS = '<=';
export const OPERATOR_IN = 'in';
export const OPERATOR_NOT_IN = 'not in';
export const OPERATOR_LIKE = '~';
export const OPERATOR_NOT_LIKE = '!~';
export const OPERATOR_IS = 'is';
export const OPERATOR_IS_NOT = 'is not';
export const OPERATOR_WAS = 'was';
export const OPERATOR_WAS_IN = 'was in';
export const OPERATOR_WAS_NOT_IN = 'was not in';
export const OPERATOR_WAS_NOT = 'was not';
export const OPERATOR_CHANGED = 'changed';

// Operator groups

export const EQUALS_OPERATORS: readonly ['=', '!='] = [
	OPERATOR_EQUALS,
	OPERATOR_NOT_EQUALS,
] as const;

export const LIKE_OPERATORS: readonly ['~', '!~'] = [OPERATOR_LIKE, OPERATOR_NOT_LIKE] as const;

export const COMPARISON_OPERATORS: readonly ['<', '>', '<=', '>='] = [
	OPERATOR_LT,
	OPERATOR_GT,
	OPERATOR_LT_EQUALS,
	OPERATOR_GT_EQUALS,
] as const;

export const IN_OPERATORS: readonly ['in', 'not in'] = [OPERATOR_IN, OPERATOR_NOT_IN] as const;

export const IS_OPERATORS: readonly ['is', 'is not'] = [OPERATOR_IS, OPERATOR_IS_NOT] as const;

export const WAS_OPERATORS: readonly ['was', 'was not'] = [OPERATOR_WAS, OPERATOR_WAS_NOT] as const;

export const WAS_IN_OPERATORS: readonly ['was in', 'was not in'] = [
	OPERATOR_WAS_IN,
	OPERATOR_WAS_NOT_IN,
] as const;

export const CHANGED_OPERATORS: readonly ['changed'] = [OPERATOR_CHANGED] as const;

export const OPERATORS: readonly [
	'=',
	'!=',
	'~',
	'!~',
	'<',
	'>',
	'<=',
	'>=',
	'in',
	'not in',
	'is',
	'is not',
	'was',
	'was not',
	'was in',
	'was not in',
	'changed',
] = [
	...EQUALS_OPERATORS,
	...LIKE_OPERATORS,
	...COMPARISON_OPERATORS,
	...IN_OPERATORS,
	...IS_OPERATORS,
	...WAS_OPERATORS,
	...WAS_IN_OPERATORS,
	...CHANGED_OPERATORS,
] as const;

export const LIST_OPERATORS: readonly ['in', 'not in', 'was in', 'was not in'] = [
	OPERATOR_IN,
	OPERATOR_NOT_IN,
	OPERATOR_WAS_IN,
	OPERATOR_WAS_NOT_IN,
] as const;
