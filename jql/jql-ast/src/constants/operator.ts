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

export const EQUALS_OPERATORS = [OPERATOR_EQUALS, OPERATOR_NOT_EQUALS] as const;

export const LIKE_OPERATORS = [OPERATOR_LIKE, OPERATOR_NOT_LIKE] as const;

export const COMPARISON_OPERATORS = [
  OPERATOR_LT,
  OPERATOR_GT,
  OPERATOR_LT_EQUALS,
  OPERATOR_GT_EQUALS,
] as const;

export const IN_OPERATORS = [OPERATOR_IN, OPERATOR_NOT_IN] as const;

export const IS_OPERATORS = [OPERATOR_IS, OPERATOR_IS_NOT] as const;

export const WAS_OPERATORS = [OPERATOR_WAS, OPERATOR_WAS_NOT] as const;

export const WAS_IN_OPERATORS = [OPERATOR_WAS_IN, OPERATOR_WAS_NOT_IN] as const;

export const CHANGED_OPERATORS = [OPERATOR_CHANGED] as const;

export const OPERATORS = [
  ...EQUALS_OPERATORS,
  ...LIKE_OPERATORS,
  ...COMPARISON_OPERATORS,
  ...IN_OPERATORS,
  ...IS_OPERATORS,
  ...WAS_OPERATORS,
  ...WAS_IN_OPERATORS,
  ...CHANGED_OPERATORS,
] as const;

export const LIST_OPERATORS = [
  OPERATOR_IN,
  OPERATOR_NOT_IN,
  OPERATOR_WAS_IN,
  OPERATOR_WAS_NOT_IN,
] as const;
